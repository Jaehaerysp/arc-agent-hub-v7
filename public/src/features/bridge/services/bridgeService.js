import logger from "../../../utils/logger";
import { ERC20_ABI } from "../../../contracts/abis/erc20";
import { ethers } from "ethers";
import {
  BRIDGE_CONTRACTS,
  isBridgeConfigured,
} from "./bridgeContracts";

// CCTP V2 TokenMessengerV2 — depositForBurn signature (adds destinationCaller,
// maxFee, minFinalityThreshold vs. V1). See bridgeContracts.js for addresses.
const TOKEN_MESSENGER_ABI = [
  "function depositForBurn(uint256 amount,uint32 destinationDomain,bytes32 mintRecipient,address burnToken,bytes32 destinationCaller,uint256 maxFee,uint32 minFinalityThreshold) external returns (uint64)",
];

// Standard (non-Fast) Transfer: minFinalityThreshold of 2000 waits for hard
// finality; 0 maxFee is sufficient since Standard Transfers don't require a
// nonzero fee on most CCTP V2 domains.
const STANDARD_MAX_FEE = 0n;
const STANDARD_MIN_FINALITY_THRESHOLD = 2000;

// CCTP represents EVM addresses as left-padded bytes32.
function addressToBytes32(address) {
  return ethers.zeroPadValue(ethers.getAddress(address), 32);
}

export async function initiateBridge({
  signer,
  token,
  network,
  amount,
  recipient,
}) {
  if (!signer) {
    return { error: "Connect your wallet to continue" };
  }

  if (network?.kind !== "evm") {
    return {
      error: `${network?.name || "This network"} isn't supported yet.`,
    };
  }

  if (!isBridgeConfigured(network.id)) {
    return {
      error: `Bridge not configured for ${network.name}`,
    };
  }

  if (!amount || Number(amount) <= 0) {
    return { error: "Invalid amount" };
  }

  if (!ethers.isAddress(recipient)) {
    return { error: "Invalid recipient address" };
  }

  try {
    logger.log("========================================");
    logger.log("Bridge Debug Started");
    logger.log("========================================");

    const wallet = await signer.getAddress();

    logger.log("Wallet:", wallet);
    logger.log("Token:", token.symbol);
    logger.log("Token Address:", token.address);
    logger.log("Decimals:", token.decimals);

    logger.log("Destination Network:", network.name);

    const config = BRIDGE_CONTRACTS[network.id];

    logger.log("Domain:", config.domain);
    logger.log("TokenMessenger:", config.tokenMessenger);

    const parsedAmount = ethers.parseUnits(
      amount,
      token.decimals
    );

    logger.log("Parsed Amount:", parsedAmount.toString());

    //---------------------------------------------------
    // Token Contract
    //---------------------------------------------------

    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      signer
    );

    const balance = await tokenContract.balanceOf(wallet);

    logger.log(
      "Wallet Balance:",
      ethers.formatUnits(balance, token.decimals)
    );

    const allowance = await tokenContract.allowance(
      wallet,
      config.tokenMessenger
    );

    logger.log(
      "Current Allowance:",
      ethers.formatUnits(allowance, token.decimals)
    );

    //---------------------------------------------------
    // Approve
    //---------------------------------------------------

    logger.log("Submitting Approve...");

    const approveTx =
      await tokenContract.approve(
        config.tokenMessenger,
        parsedAmount
      );

    logger.log(
      "Approve TX:",
      approveTx.hash
    );

    const approveReceipt =
      await approveTx.wait();

    logger.log(
      "Approve Confirmed:",
      approveReceipt.hash
    );

    //---------------------------------------------------
    // Verify Allowance
    //---------------------------------------------------

    const newAllowance =
      await tokenContract.allowance(
        wallet,
        config.tokenMessenger
      );

    logger.log(
      "Allowance After Approve:",
      ethers.formatUnits(
        newAllowance,
        token.decimals
      )
    );

    //---------------------------------------------------
    // Bridge Contract
    //---------------------------------------------------

    const messenger =
      new ethers.Contract(
        config.tokenMessenger,
        TOKEN_MESSENGER_ABI,
        signer
      );

    logger.log("Calling depositForBurn()");

    logger.log({
      amount: parsedAmount.toString(),
      destinationDomain: config.domain,
      mintRecipient:
        addressToBytes32(recipient),
      burnToken: token.address,
      destinationCaller:
        ethers.ZeroHash,
      maxFee:
        STANDARD_MAX_FEE.toString(),
      minFinalityThreshold:
        STANDARD_MIN_FINALITY_THRESHOLD,
    });

    //---------------------------------------------------
    // Estimate Gas First
    //---------------------------------------------------

    try {
      const gas =
        await messenger.depositForBurn.estimateGas(
          parsedAmount,
          config.domain,
          addressToBytes32(recipient),
          token.address,
          ethers.ZeroHash,
          STANDARD_MAX_FEE,
          STANDARD_MIN_FINALITY_THRESHOLD
        );

      logger.log(
        "Estimated Gas:",
        gas.toString()
      );
    } catch (gasError) {
      logger.error(
        "Estimate Gas FAILED"
      );

      logger.error(gasError);

      return {
        error:
          gasError.reason ||
          gasError.shortMessage ||
          gasError.message,
      };
    }

    //---------------------------------------------------
    // Send Transaction
    //---------------------------------------------------

    const burnTx =
      await messenger.depositForBurn(
        parsedAmount,
        config.domain,
        addressToBytes32(recipient),
        token.address,
        ethers.ZeroHash,
        STANDARD_MAX_FEE,
        STANDARD_MIN_FINALITY_THRESHOLD
      );

    logger.log(
      "Bridge TX:",
      burnTx.hash
    );

    const receipt =
      await burnTx.wait();

    logger.log(
      "Bridge Success"
    );

    logger.log(receipt);

    return {
      txHash: burnTx.hash,
      receipt,
    };

  } catch (e) {

    logger.log("=================================");
    logger.log("BRIDGE FAILED");
    logger.log("=================================");

    logger.error("Full Error:", e);

    logger.error("Reason:", e.reason);

    logger.error("Message:", e.message);

    logger.error("Short Message:", e.shortMessage);

    logger.error("Code:", e.code);

    logger.error("Data:", e.data);

    logger.error("Info:", e.info);

    logger.error("Error:", e.error);

    logger.error("Stack:", e.stack);

    return {
      error:
        e.reason ||
        e.shortMessage ||
        e.message ||
        "Bridge transaction failed",
    };
  }
}