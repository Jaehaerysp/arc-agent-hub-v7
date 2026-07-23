// Universal Token Swap (Sprint 4) — error classification.
//
// Same convention as Bridge Center's `bridgeErrors.js`: `swapService.js`/
// `quoteService.js` already reduce Circle App Kit / ethers / RPC errors to
// a plain string (the same `e?.reason || e?.shortMessage || e?.message`
// pattern every write in this app uses). This module maps that string (or
// a known precondition this feature checks itself, e.g. no wallet, no kit
// key) onto the error cases the Sprint 4 brief calls out, so the UI can
// show a consistent, human label instead of a raw SDK/provider string.

export const SWAP_ERROR_KIND = {
  WALLET_NOT_CONNECTED: 'wallet_not_connected',
  UNSUPPORTED_NETWORK: 'unsupported_network',
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  USER_REJECTED: 'user_rejected',
  RPC_FAILURE: 'rpc_failure',
  QUOTE_UNAVAILABLE: 'quote_unavailable',
  KIT_KEY_MISSING: 'kit_key_missing',
  SAME_TOKEN: 'same_token',
  SWAP_FAILED: 'swap_failed',
  UNKNOWN: 'unknown',
}

const PATTERNS = [
  { kind: SWAP_ERROR_KIND.USER_REJECTED, test: /user rejected|user denied|action_rejected/i },
  { kind: SWAP_ERROR_KIND.INSUFFICIENT_BALANCE, test: /insufficient funds|insufficient balance|exceeds balance|transfer amount exceeds balance/i },
  { kind: SWAP_ERROR_KIND.KIT_KEY_MISSING, test: /kit_key|kit key|kitkey/i },
  { kind: SWAP_ERROR_KIND.UNSUPPORTED_NETWORK, test: /unsupported (chain|network|token)|not supported on/i },
  { kind: SWAP_ERROR_KIND.QUOTE_UNAVAILABLE, test: /quote|estimate.*(unavailable|failed)|no route/i },
  { kind: SWAP_ERROR_KIND.RPC_FAILURE, test: /rpc|call revert|missing revert data|failed to fetch|could not detect network|-3200[0-9]/i },
  { kind: SWAP_ERROR_KIND.WALLET_NOT_CONNECTED, test: /connect your wallet|no wallet extension|no provider/i },
]

/** Classifies a plain error string (or precondition message) into a `SWAP_ERROR_KIND`. */
export function classifySwapError(message) {
  if (!message) return { kind: SWAP_ERROR_KIND.UNKNOWN, message: null }
  const match = PATTERNS.find((p) => p.test.test(message))
  return { kind: match ? match.kind : SWAP_ERROR_KIND.SWAP_FAILED, message }
}

export const SWAP_ERROR_LABEL = {
  [SWAP_ERROR_KIND.WALLET_NOT_CONNECTED]: 'Wallet not connected',
  [SWAP_ERROR_KIND.UNSUPPORTED_NETWORK]: 'Unsupported network',
  [SWAP_ERROR_KIND.INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [SWAP_ERROR_KIND.USER_REJECTED]: 'Transaction rejected',
  [SWAP_ERROR_KIND.RPC_FAILURE]: 'Network RPC error',
  [SWAP_ERROR_KIND.QUOTE_UNAVAILABLE]: 'Quote unavailable',
  [SWAP_ERROR_KIND.KIT_KEY_MISSING]: 'Swap not configured',
  [SWAP_ERROR_KIND.SAME_TOKEN]: 'Choose two different tokens',
  [SWAP_ERROR_KIND.SWAP_FAILED]: 'Swap failed',
  [SWAP_ERROR_KIND.UNKNOWN]: 'Swap failed',
}

// Presentation-only, additive to the classification above: a plain-language
// sentence for each error kind so the UI never has to fall back to a raw
// SDK/RPC string. Purely cosmetic copy — does not change `PATTERNS` or any
// swap logic in swapService.js/quoteService.js/useSwap.js.
export const SWAP_ERROR_DESCRIPTION = {
  [SWAP_ERROR_KIND.WALLET_NOT_CONNECTED]: 'Connect your wallet to get a quote or swap.',
  [SWAP_ERROR_KIND.UNSUPPORTED_NETWORK]: `Switch to Arc Testnet to swap USDC and EURC.`,
  [SWAP_ERROR_KIND.INSUFFICIENT_BALANCE]: "You don't have enough balance to cover this swap.",
  [SWAP_ERROR_KIND.USER_REJECTED]: 'The transaction was rejected in your wallet.',
  [SWAP_ERROR_KIND.RPC_FAILURE]: 'The network had trouble processing this request. Please try again in a moment.',
  [SWAP_ERROR_KIND.QUOTE_UNAVAILABLE]: "Couldn't get a quote for this pair right now. Try a different amount or try again shortly.",
  [SWAP_ERROR_KIND.KIT_KEY_MISSING]: 'Swap is missing its App Kit configuration. Set VITE_CIRCLE_KIT_KEY and reload.',
  [SWAP_ERROR_KIND.SAME_TOKEN]: 'Token In and Token Out must be different.',
  [SWAP_ERROR_KIND.SWAP_FAILED]: 'Something went wrong completing this swap. Please try again.',
  [SWAP_ERROR_KIND.UNKNOWN]: 'Something went wrong with this swap. Please try again.',
}
