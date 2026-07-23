// Retry logic — ports the two-tier retry design from the ArcVault
// reference implementation (reverse-engineering guide, Part 7).
//
// Tier A (this module's `withRetry`): a synchronous retry *within one
// quote request* — flat delays (not exponential backoff, matching
// ArcVault's own `SWAP_QUOTE_RETRY_DELAYS_MS = [300, 800]`), 3 total
// attempts. Lives in the service layer (called from quoteService.js),
// same as ArcVault's `estimateSwapWithRetry`.
//
// Tier B (`scheduleBackgroundRetry`): if Tier A exhausts all attempts and
// there's no cached fallback, ArcVault schedules ONE more attempt 1.6s
// later, up to 3 times per quote key. In ArcVault that lived inside
// `refreshSwapState` (the hook-equivalent orchestration function); here
// it's called from `useSwap.js` for the same reason — it's the layer that
// owns the debounce/lifecycle, not the pure service layer.

/** Flat retry delays in ms — 2 retries after the first attempt, 3 attempts total. Matches ArcVault's SWAP_QUOTE_RETRY_DELAYS_MS. */
export const QUOTE_RETRY_DELAYS_MS = [300, 800]

export const BACKGROUND_RETRY_DELAY_MS = 1600
export const BACKGROUND_RETRY_LIMIT = 3

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retries `fn` up to `QUOTE_RETRY_DELAYS_MS.length + 1` times with flat
 * delays between attempts. `shouldContinue()` is checked before every
 * attempt and after every failure — same race-guard purpose as ArcVault's
 * closure over its request counter: pass a function that returns false
 * once a newer request has superseded this one, so a stale attempt stops
 * retrying instead of eventually applying an outdated quote.
 */
export async function withRetry<T>(fn: () => Promise<T>, shouldContinue: () => boolean = () => true): Promise<T | null> {
  let lastError: unknown

  for (let attempt = 0; attempt <= QUOTE_RETRY_DELAYS_MS.length; attempt += 1) {
    if (!shouldContinue()) return null

    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === QUOTE_RETRY_DELAYS_MS.length || !shouldContinue()) {
        break
      }

      await wait(QUOTE_RETRY_DELAYS_MS[attempt])
    }
  }

  throw lastError
}

const retryCounts = new Map<string, number>()
const retryTimers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Schedules one background retry for `key`, up to BACKGROUND_RETRY_LIMIT
 * times. Call this from useSwap.js when a quote request has exhausted
 * `withRetry` and fallen back to a cached (or no) result. `onRetry` should
 * re-trigger the same quote fetch — same role as ArcVault's
 * `scheduleSwapQuoteRetry` calling `refreshSwapState()` again.
 */
export function scheduleBackgroundRetry(key: string, onRetry: () => void): void {
  const count = retryCounts.get(key) ?? 0
  if (count >= BACKGROUND_RETRY_LIMIT) return

  retryCounts.set(key, count + 1)

  const existing = retryTimers.get(key)
  if (existing) clearTimeout(existing)

  const timer = setTimeout(() => {
    retryTimers.delete(key)
    onRetry()
  }, BACKGROUND_RETRY_DELAY_MS)

  retryTimers.set(key, timer)
}

/** Call on a successful quote for `key` so a later failure starts a fresh retry budget instead of inheriting an exhausted one. */
export function clearBackgroundRetry(key: string): void {
  retryCounts.delete(key)
  const existing = retryTimers.get(key)
  if (existing) {
    clearTimeout(existing)
    retryTimers.delete(key)
  }
}
