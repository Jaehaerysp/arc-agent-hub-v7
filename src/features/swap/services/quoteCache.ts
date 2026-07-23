// Quote cache — ports the caching behavior from the ArcVault reference
// implementation (reverse-engineering guide, Part 8) into a standalone,
// typed module `quoteService.js` can call into.
//
// Same shape as ArcVault's `swapQuoteCache`: a plain in-memory `Map`, no
// TTL/expiration (entries live until overwritten by a newer successful
// quote for the same key), no persistence across a page reload. It's a
// fallback path only — `quoteService.js` still attempts a live quote on
// every call; this cache is what lets a request that fails outright still
// show the last-known-good numbers instead of a hard error.

export interface CachedQuote {
  estimatedOutput: unknown
  minimumReceived: unknown
  fees: unknown
  updatedAt: number
}

const cache = new Map<string, CachedQuote>()

/** Builds a cache key from the inputs that actually change the quote — same fields ArcVault's `getSwapQuoteKey` used, plus slippage since this app makes that user-configurable (ArcVault's was a fixed constant). */
export function buildQuoteKey(tokenInKey: string, tokenOutKey: string, amountIn: string, slippageBps: number): string {
  return `${tokenInKey}->${tokenOutKey}:${amountIn}:${slippageBps}`
}

export function getCachedQuote(key: string): CachedQuote | null {
  return cache.get(key) ?? null
}

export function setCachedQuote(
  key: string,
  quote: { estimatedOutput: unknown; minimumReceived: unknown; fees: unknown }
): void {
  cache.set(key, { ...quote, updatedAt: Date.now() })
}
