// Universal Token Swap (Sprint 4) — quote/estimate service.
//
// Wraps Circle App Kit's `kit.estimateSwap()` — the SDK's dedicated
// pre-swap estimate call (see the Arc Docs "Estimate swap rate" how-to:
// `const estimate = await kit.estimateSwap(params)`), which takes the
// exact same `SwapParams` shape as `kit.swap()` in `swapService.js` but
// never submits a transaction. Kept as its own service (rather than
// folded into `swapService.js`) because it's read-only and safe to call on
// every keystroke via `useSwap.js`'s debounce, same as Bridge's
// `bridgeEstimator.js` is a separate module from `bridgeService.js`.

import logger from '../../../utils/logger'
import { SWAP_CHAIN } from './swapService'
import { getAppKit } from './appKit'
import { buildQuoteKey, getCachedQuote, setCachedQuote } from './quoteCache'
import { withRetry } from './quoteRetry'

// Shared App Kit instance (also used by swapService.js) — see appKit.ts.
const kit = getAppKit()

/**
 * Gets a pre-swap estimate for `amountIn` of `tokenIn` -> `tokenOut`.
 * Never throws: a failed estimate resolves to `{ ...null fields, error }`
 * so the form can still show a stale/absent quote without blocking input.
 *
 * `adapter`/`kitKey` are passed in rather than re-resolved here so a
 * single adapter (and its wallet-signature-free read calls) can be shared
 * between the estimate and the eventual `kit.swap()` call.
 *
 * Everything below is read straight off `kit.estimateSwap()`'s
 * `SwapEstimate` — nothing here is computed manually:
 *   - `estimatedOutput` / `fees` are returned as-is.
 *   - `minimumReceived` is the SDK's own `stopLimit` field, renamed to
 *     match how the UI/callers refer to it (`stopLimit`'s own doc comment
 *     describes it as "the minimum amount of tokens the user should
 *     receive after accounting for slippage" — i.e. minimum received).
 *   - `estimatedGas` is the `fees` entry the SDK itself tags
 *     `type: 'gas'` — App Kit doesn't expose a separate top-level gas
 *     field, so this pulls the one that's already there instead of
 *     estimating gas independently.
 *   - `slippage` echoes the `slippageBps` this estimate was actually
 *     requested with, so the UI can show what tolerance a stale quote
 *     was computed under — App Kit's `SwapEstimate` doesn't return this
 *     itself since it's an input, not part of the quote.
 *   - `priceImpact` and `route` are NOT part of App Kit's `SwapEstimate`
 *     response (verified against the SDK's type definitions) — surfaced
 *     as `null` rather than approximated, so callers can tell "the SDK
 *     doesn't provide this" apart from "this failed to load."
 *
 * Retry + cache (ports ArcVault reverse-engineering guide, Parts 7-8):
 * the actual `kit.estimateSwap()` call is wrapped in `withRetry` — 3
 * attempts total, flat 300ms/800ms delays, matching the ArcVault
 * reference exactly. `shouldContinue` (optional) is forwarded into every
 * retry attempt so a caller with its own request-id race guard (see
 * useSwap.js) can abort an in-flight retry once a newer request has
 * superseded it. If every attempt fails, a cached quote for the same
 * `tokenIn`/`tokenOut`/`amountIn`/`slippageBps` combination is returned
 * instead of an error when one exists (`stale: true`) — the UI keeps
 * showing the last-known-good numbers instead of going blank. A
 * successful call always updates the cache.
 */
export async function getSwapQuote({ adapter, kitKey, tokenIn, tokenOut, amountIn, slippageBps, shouldContinue }) {
  const cacheKey = tokenIn && tokenOut ? getSwapQuoteKey(tokenIn, tokenOut, amountIn, slippageBps) : null

  try {
    if (!adapter) throw new Error('Connect your wallet to continue')
    if (!kitKey) throw new Error('KIT_KEY missing — set VITE_CIRCLE_KIT_KEY (or VITE_SWAP_KIT_KEY) in your .env')
    if (tokenIn.key === tokenOut.key) throw new Error('Token In and Token Out must be different')
    if (!amountIn || Number(amountIn) <= 0) throw new Error('Invalid amount')

    const estimate = await withRetry(
      () =>
        kit.estimateSwap({
          from: { adapter, chain: SWAP_CHAIN },
          tokenIn: tokenIn.symbol,
          tokenOut: tokenOut.symbol,
          amountIn,
          config: { kitKey, ...(slippageBps ? { slippageBps } : {}) },
        }),
      shouldContinue
    )

    if (!estimate) {
      // shouldContinue() returned false mid-retry — a newer request has
      // already superseded this one; nothing to return, cache untouched.
      return null
    }

    const fees = estimate.fees ?? []
    const gasFee = fees.find((fee) => fee.type === 'gas') ?? null
    const minimumReceived = estimate.stopLimit ?? null

    if (cacheKey) setCachedQuote(cacheKey, { estimatedOutput: estimate.estimatedOutput ?? null, minimumReceived, fees })

    return {
      estimatedOutput: estimate.estimatedOutput ?? null,
      fees,
      minimumReceived,
      estimatedGas: gasFee,
      slippage: slippageBps ?? null,
      priceImpact: null, // not provided by kit.estimateSwap()
      route: null, // not provided by kit.estimateSwap()
      error: null,
      cacheKey,
      stale: false,
    }
  } catch (e) {
    const message = e?.reason || e?.shortMessage || e?.message || 'Quote unavailable'
    logger.error('Quote failed', { tokenIn: tokenIn?.symbol, tokenOut: tokenOut?.symbol, amountIn, message })

    const cached = cacheKey ? getCachedQuote(cacheKey) : null
    if (cached) {
      return {
        estimatedOutput: cached.estimatedOutput,
        fees: cached.fees,
        minimumReceived: cached.minimumReceived,
        estimatedGas: (cached.fees || []).find((fee) => fee.type === 'gas') ?? null,
        slippage: slippageBps ?? null,
        priceImpact: null,
        route: null,
        error: null,
        cacheKey,
        stale: true,
      }
    }

    return {
      estimatedOutput: null,
      fees: [],
      minimumReceived: null,
      estimatedGas: null,
      slippage: slippageBps ?? null,
      priceImpact: null,
      route: null,
      error: message,
      cacheKey,
      stale: false,
    }
  }
}

/** Builds the cache key for a given quote request — exposed so useSwap.js can schedule a background retry (quoteRetry.js's `scheduleBackgroundRetry`) against the exact same key this function used internally. */
export function getSwapQuoteKey(tokenIn, tokenOut, amountIn, slippageBps) {
  return buildQuoteKey(tokenIn.key, tokenOut.key, amountIn, slippageBps ?? 0)
}
