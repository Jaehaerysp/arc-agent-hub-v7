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

import { AppKit } from '@circle-fin/app-kit'
import logger from '../../../utils/logger'
import { SWAP_CHAIN } from './swapService'

// Own module-level `AppKit` instance, same convention as `swapService.js`'s
// `kit` — estimates are read-only (no signing), so sharing one instance
// across every debounced quote call is safe and avoids re-constructing the
// SDK on every keystroke.
const kit = new AppKit()

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
 */
export async function getSwapQuote({ adapter, kitKey, tokenIn, tokenOut, amountIn, slippageBps }) {
  try {
    if (!adapter) throw new Error('Connect your wallet to continue')
    if (!kitKey) throw new Error('KIT_KEY missing — set VITE_CIRCLE_KIT_KEY (or VITE_SWAP_KIT_KEY) in your .env')
    if (tokenIn.key === tokenOut.key) throw new Error('Token In and Token Out must be different')
    if (!amountIn || Number(amountIn) <= 0) throw new Error('Invalid amount')

    const estimate = await kit.estimateSwap({
      from: { adapter, chain: SWAP_CHAIN },
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn,
      config: { kitKey, ...(slippageBps ? { slippageBps } : {}) },
    })

    const fees = estimate.fees ?? []
    const gasFee = fees.find((fee) => fee.type === 'gas') ?? null

    return {
      estimatedOutput: estimate.estimatedOutput ?? null,
      fees,
      minimumReceived: estimate.stopLimit ?? null,
      estimatedGas: gasFee,
      slippage: slippageBps ?? null,
      priceImpact: null, // not provided by kit.estimateSwap()
      route: null, // not provided by kit.estimateSwap()
      error: null,
    }
  } catch (e) {
    logger.error('Quote failed', {
      tokenIn: tokenIn?.symbol,
      tokenOut: tokenOut?.symbol,
      amountIn,
      message: e?.reason || e?.shortMessage || e?.message || 'Quote unavailable',
    })
    return {
      estimatedOutput: null,
      fees: [],
      minimumReceived: null,
      estimatedGas: null,
      slippage: slippageBps ?? null,
      priceImpact: null,
      route: null,
      error: e?.reason || e?.shortMessage || e?.message || 'Quote unavailable',
    }
  }
}
