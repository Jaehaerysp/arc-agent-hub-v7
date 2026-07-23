// Token configuration for the Swap feature — the single source of truth
// for which tokens can be swapped, and their App Kit-facing metadata.
//
// Previously `SWAP_TOKENS` was assembled inline at the top of
// swapService.js as `[USDC_TOKEN, EURC_TOKEN].filter(Boolean)`, pulled
// from two other features' token descriptors (Payments' USDC_TOKEN,
// Wallet's WALLET_TOKENS). This module is that same assembly, pulled out
// so it can be extended with cirBTC and shared by swapService.js and
// quoteService.js without either re-deriving it.
//
// cirBTC's address/decimals are NOT new — they already exist in
// `tokenRegistry.js` (`{ key: 'cirbtc', address: '0xf0C4a4...', decimals:
// 8, ... }`) for the Wallet page's balance reads. This module just adds
// that same entry to the swap-eligible set.
import { USDC_TOKEN } from '../../payments/services/usdcPaymentService'
import { WALLET_TOKENS } from '../../wallet/services/tokenRegistry'

export interface SwapToken {
  key: string
  symbol: string
  name: string
  address: string
  decimals: number
  /**
   * The symbol Circle App Kit expects for this token in `tokenIn`/
   * `tokenOut`. Kept as its own field rather than reusing `symbol`
   * outright, in case App Kit ever expects a different string than what
   * the UI displays — see the ArcVault reverse-engineering guide, Part 6,
   * for why this separation is intentional rather than redundant. Today
   * it's identical to `symbol` for every token below.
   */
  appKitSymbol: string
}

function fromWalletToken(key: string): SwapToken | undefined {
  const token = WALLET_TOKENS.find((t) => t.key === key)
  if (!token) return undefined
  return { ...token, appKitSymbol: token.symbol }
}

const EURC_TOKEN = fromWalletToken('eurc')
const CIRBTC_TOKEN = fromWalletToken('cirbtc')

/**
 * Every asset the Swap page can offer. Every supported pair in this
 * feature is `<asset> -> USDC` (or the reverse) — that's what both the
 * ArcVault reference and this app's own App Kit usage have actually been
 * exercised against. EURC and cirBTC are NOT verified to swap directly
 * against each other; `getOppositeSwapToken` below enforces that USDC is
 * always one side of the pair so the UI can never construct an
 * unverified route.
 */
export const SWAP_TOKENS: SwapToken[] = [
  { ...USDC_TOKEN, appKitSymbol: USDC_TOKEN.symbol },
  EURC_TOKEN,
  CIRBTC_TOKEN,
].filter((t): t is SwapToken => Boolean(t))

export function getSwapToken(key: string): SwapToken {
  return SWAP_TOKENS.find((t) => t.key === key) || SWAP_TOKENS[0]
}

/**
 * The token that belongs on the *other* side of the pair from `key`.
 * With three tokens now (not the original two), "opposite" specifically
 * means "the USDC side of an <asset> -> USDC pair": if `key` is USDC,
 * defaults to EURC (matching the existing USDC -> EURC default
 * direction); for any non-USDC key (EURC or cirBTC), returns USDC.
 */
export function getOppositeSwapToken(key: string): SwapToken {
  if (key === 'usdc') return getSwapToken('eurc')
  return getSwapToken('usdc')
}

/** True if `key` is anything other than USDC — used to enforce the USDC-paired constraint in SwapPage's change handlers. */
export function isNonUsdcToken(key: string): boolean {
  return key !== 'usdc'
}
