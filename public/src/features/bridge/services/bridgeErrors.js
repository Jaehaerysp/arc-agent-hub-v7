// Bridge Center — error classification.
//
// `initiateBridge`/`estimateBridgeFee` already reduce ethers/RPC errors to
// a plain string (same `e?.reason || e?.shortMessage || e?.message`
// pattern every write in this app uses); `attestationService.js`/
// `messageTransmitterService.js` (Sprint 3.2's post-burn half) follow the
// same convention. This module maps that string (or a known precondition
// this feature checks itself) onto the error cases the Sprint 3/3.2
// briefs call out, so the UI can show a consistent, human label instead
// of a raw provider/fetch error string.

export const BRIDGE_ERROR_KIND = {
  RPC: 'rpc',
  UNSUPPORTED_NETWORK: 'unsupported_network',
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  USER_REJECTED: 'user_rejected',
  TIMEOUT: 'timeout',
  NETWORK_UNAVAILABLE: 'network_unavailable',
  // Sprint 3.2 — post-burn (attestation + mint) additions.
  IRIS_UNAVAILABLE: 'iris_unavailable',
  ATTESTATION_TIMEOUT: 'attestation_timeout',
  INVALID_ATTESTATION: 'invalid_attestation',
  ALREADY_MINTED: 'already_minted',
  RECEIVE_MESSAGE_REVERTED: 'receive_message_reverted',
  DESTINATION_RPC_UNAVAILABLE: 'destination_rpc_unavailable',
  DESTINATION_GAS_REQUIRED: 'destination_gas_required',
  UNKNOWN: 'unknown',
}

const PATTERNS = [
  { kind: BRIDGE_ERROR_KIND.USER_REJECTED, test: /user rejected|user denied|action_rejected/i },
  { kind: BRIDGE_ERROR_KIND.DESTINATION_GAS_REQUIRED, test: /has no .* on .* to pay for the mint/i },
  { kind: BRIDGE_ERROR_KIND.INSUFFICIENT_BALANCE, test: /insufficient funds|exceeds balance|transfer amount exceeds balance/i },
  { kind: BRIDGE_ERROR_KIND.ALREADY_MINTED, test: /already been minted|already used|already processed/i },
  { kind: BRIDGE_ERROR_KIND.INVALID_ATTESTATION, test: /invalid attestation|rejected .* as invalid|different message than this bridge/i },
  { kind: BRIDGE_ERROR_KIND.ATTESTATION_TIMEOUT, test: /timed out waiting for circle/i },
  { kind: BRIDGE_ERROR_KIND.IRIS_UNAVAILABLE, test: /attestation service is unavailable/i },
  { kind: BRIDGE_ERROR_KIND.DESTINATION_RPC_UNAVAILABLE, test: /destination chain's rpc|couldn't switch your wallet|couldn't reach/i },
  { kind: BRIDGE_ERROR_KIND.TIMEOUT, test: /timeout|timed out/i },
  { kind: BRIDGE_ERROR_KIND.NETWORK_UNAVAILABLE, test: /network error|failed to fetch|could not detect network|no wallet extension/i },
  { kind: BRIDGE_ERROR_KIND.UNSUPPORTED_NETWORK, test: /not yet configured|no wallet support|not reachable/i },
  { kind: BRIDGE_ERROR_KIND.RECEIVE_MESSAGE_REVERTED, test: /mint transaction failed|receivemessage/i },
  { kind: BRIDGE_ERROR_KIND.RPC, test: /rpc|call revert|missing revert data|-3200[0-9]/i },
]

export function classifyBridgeError(message) {
  if (!message) return { kind: BRIDGE_ERROR_KIND.UNKNOWN, message: null }
  const match = PATTERNS.find((p) => p.test.test(message))
  return { kind: match ? match.kind : BRIDGE_ERROR_KIND.UNKNOWN, message }
}

export const BRIDGE_ERROR_LABEL = {
  [BRIDGE_ERROR_KIND.RPC]: 'Network RPC error',
  [BRIDGE_ERROR_KIND.UNSUPPORTED_NETWORK]: 'Unsupported network',
  [BRIDGE_ERROR_KIND.INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [BRIDGE_ERROR_KIND.USER_REJECTED]: 'Transaction rejected',
  [BRIDGE_ERROR_KIND.TIMEOUT]: 'Bridge timed out',
  [BRIDGE_ERROR_KIND.NETWORK_UNAVAILABLE]: 'Network unavailable',
  [BRIDGE_ERROR_KIND.IRIS_UNAVAILABLE]: "Circle's attestation service is unavailable",
  [BRIDGE_ERROR_KIND.ATTESTATION_TIMEOUT]: 'Attestation timed out',
  [BRIDGE_ERROR_KIND.INVALID_ATTESTATION]: 'Invalid attestation',
  [BRIDGE_ERROR_KIND.ALREADY_MINTED]: 'Already minted',
  [BRIDGE_ERROR_KIND.RECEIVE_MESSAGE_REVERTED]: 'Mint transaction reverted',
  [BRIDGE_ERROR_KIND.DESTINATION_RPC_UNAVAILABLE]: 'Destination RPC unavailable',
  [BRIDGE_ERROR_KIND.DESTINATION_GAS_REQUIRED]: 'Destination chain needs gas',
  [BRIDGE_ERROR_KIND.UNKNOWN]: 'Bridge failed',
}

// Presentation-only, additive to the classification above: a plain-language
// sentence for each error kind so the UI never has to fall back to a raw
// provider/RPC string. Purely cosmetic copy -- does not change `PATTERNS`,
// matching, or any bridge/attestation/mint logic above or in useBridge.js.
export const BRIDGE_ERROR_DESCRIPTION = {
  [BRIDGE_ERROR_KIND.RPC]: 'The network had trouble processing this request. Please try again in a moment.',
  [BRIDGE_ERROR_KIND.UNSUPPORTED_NETWORK]: "This route isn't wired up for browser bridging yet. Pick a different destination network.",
  [BRIDGE_ERROR_KIND.INSUFFICIENT_BALANCE]: "You don't have enough balance to cover this bridge amount.",
  [BRIDGE_ERROR_KIND.USER_REJECTED]: 'The transaction was rejected in your wallet.',
  [BRIDGE_ERROR_KIND.TIMEOUT]: 'The bridge took longer than expected to confirm. Check the transaction on the explorer before retrying.',
  [BRIDGE_ERROR_KIND.NETWORK_UNAVAILABLE]: "Couldn't reach the network. Check your connection and wallet extension, then try again.",
  [BRIDGE_ERROR_KIND.IRIS_UNAVAILABLE]: "Circle's attestation service is temporarily unavailable. Your burn is safe -- try resuming shortly.",
  [BRIDGE_ERROR_KIND.ATTESTATION_TIMEOUT]: 'Your burn succeeded, but the attestation is taking longer than usual. You can resume this bridge to keep waiting.',
  [BRIDGE_ERROR_KIND.INVALID_ATTESTATION]: "Circle returned an attestation that didn't match this transfer. Please retry the bridge.",
  [BRIDGE_ERROR_KIND.ALREADY_MINTED]: 'This transfer was already minted on the destination chain -- no action needed.',
  [BRIDGE_ERROR_KIND.RECEIVE_MESSAGE_REVERTED]: 'The mint transaction reverted on the destination chain. Your funds remain burned and can be re-minted.',
  [BRIDGE_ERROR_KIND.DESTINATION_RPC_UNAVAILABLE]: "Couldn't switch your wallet to the destination network. Add or switch it manually and resume.",
  [BRIDGE_ERROR_KIND.DESTINATION_GAS_REQUIRED]: 'Your wallet needs a small amount of native gas on the destination chain to complete the mint.',
  [BRIDGE_ERROR_KIND.UNKNOWN]: 'Something went wrong with this bridge. Please try again, or check the explorer for details.',
}
