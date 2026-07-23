// Bridge Center — destination-chain mint (second half of CCTP).
//
// A note on the MessageTransmitterV2 address used below: CCTP V2 contracts
// are deployed via CREATE2 through a Circle-owned factory, so
// MessageTransmitterV2 lives at the *same* address on every EVM chain —
// source or destination, mainnet or testnet. This isn't an assumption;
// it's cross-checked directly against Circle's own published testnet
// contract-address table (developers.circle.com/cctp/references/
// contract-addresses), which lists identical MessageTransmitterV2
// addresses for Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Arc
// Testnet, and every other CCTP V2 testnet domain. `ARC_SOURCE_CCTP.
// messageTransmitter` (bridgeContracts.js) is that address — reusing it
// here for Base Sepolia (or whichever destination) isn't "reusing Arc's
// address" in the sense of guessing; it's the one official Circle
// deployment address, confirmed against Circle's docs rather than
// invented for this file.
//
// No private keys, Circle Wallets, App Kit, or Bridge Kit — this only
// ever signs through the already-connected `window.ethereum` (MetaMask)
// signer, same as every other write in this app.

import { ethers } from "ethers";
import { MESSAGE_TRANSMITTER_ABI } from "../../../contracts/abis/messageTransmitter";
import { ARC_SOURCE_CCTP } from "./bridgeContracts";
import { ARC_CHAIN_ID_HEX, ARC_NETWORK_PARAMS } from "../../../chains/arc";

/** Switches (or adds, if MetaMask doesn't know it yet) the connected wallet to `chainIdHex`. */
async function switchWalletChain(chainIdHex, addChainParams) {
  if (!window.ethereum) {
    throw new Error("No wallet extension detected. Install MetaMask or Rabby to continue.");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (switchError) {
    if (switchError.code === 4902 && addChainParams) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [addChainParams],
      });
    } else {
      throw switchError;
    }
  }
}

function classifyMintError(e) {
  const reason = e?.reason || e?.shortMessage || e?.message || "";

  if (/user rejected|user denied|action_rejected/i.test(reason)) {
    return reason;
  }
  if (/nonce already used|already been used|used nonce|already processed/i.test(reason)) {
    return "This transfer has already been minted on the destination chain.";
  }
  if (/could not detect network|failed to fetch|network error|missing response|timeout/i.test(reason)) {
    return "Couldn't reach the destination chain's RPC — check your connection and try again.";
  }
  if (/invalid attestation|signature|attester/i.test(reason)) {
    return "Circle's attestation was rejected by the destination contract as invalid.";
  }
  return reason || "Mint transaction failed";
}

/**
 * Switches the connected wallet to `network`, then calls
 * `receiveMessage(message, attestation)` on MessageTransmitterV2 there to
 * mint USDC to the original recipient. Always attempts to switch the
 * wallet back to Arc Testnet afterward (success or failure) so the rest of
 * this app — which assumes an Arc-connected signer — keeps working.
 *
 * Returns `{ txHash, receipt }` or `{ error }`.
 */
export async function receiveMessage({ network, message, attestation }) {
  if (!message || !attestation) {
    return { error: "Missing message or attestation — nothing to mint yet." };
  }

  if (network?.kind !== "evm") {
    return { error: `${network?.name || "This network"} isn't supported for minting yet.` };
  }

  const destinationChainParams = {
    chainId: network.chainIdHex,
    chainName: network.name,
    nativeCurrency: network.nativeCurrency,
    rpcUrls: [network.rpcUrl],
    blockExplorerUrls: [network.explorerUrl],
  };

  try {
    await switchWalletChain(network.chainIdHex, destinationChainParams);
  } catch (switchError) {
    return { error: switchError?.message || `Couldn't switch your wallet to ${network.name}.` };
  }

  try {
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const destinationSigner = await browserProvider.getSigner();

    // receiveMessage() is permissionless -- CCTP lets any address call it,
    // not just a Circle-run relayer -- so the connected wallet CAN
    // complete this step itself. What it can't do without a backend
    // paymaster (which this app deliberately doesn't add -- that would
    // mean a funded hot key server-side or embedded client-side) is pay
    // its own gas on a chain it holds none. Check for that up front so it
    // fails with a clear, actionable message instead of a raw wallet
    // revert after the user's already been prompted to sign.
    const destinationAddress = await destinationSigner.getAddress();
    const destinationBalance = await browserProvider.getBalance(destinationAddress);
    if (destinationBalance === 0n) {
      return {
        error: `Your wallet has no ${network.nativeCurrency?.symbol || "gas"} on ${network.name} to pay for the mint transaction. Fund it from a ${network.name} faucet, then retry -- the burn is already confirmed and won't need to run again.`,
        needsDestinationGas: true,
      };
    }

    const transmitter = new ethers.Contract(
      ARC_SOURCE_CCTP.messageTransmitter,
      MESSAGE_TRANSMITTER_ABI,
      destinationSigner
    );

    const mintTx = await transmitter.receiveMessage(message, attestation);
    const receipt = await mintTx.wait();

    return { txHash: mintTx.hash, receipt };
  } catch (e) {
    return { error: classifyMintError(e) };
  } finally {
    // Best-effort only — if this fails the user can switch back manually;
    // it doesn't change the mint's success/failure result above.
    try {
      await switchWalletChain(ARC_CHAIN_ID_HEX, ARC_NETWORK_PARAMS);
    } catch {
      /* non-fatal */
    }
  }
}
