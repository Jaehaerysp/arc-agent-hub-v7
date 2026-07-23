// Shared Circle App Kit instance for the Swap feature.
//
// swapService.js and quoteService.js previously each created their own
// `new AppKit()` — see their original comments: "Same single, module-level
// AppKit instance the reference scripts create once... and reuse across
// every swap call" (swapService.js) and "Own module-level AppKit
// instance... estimates are read-only, so sharing one instance across
// every debounced quote call is safe" (quoteService.js). Both of those
// justifications are for ONE shared instance — having two separate ones
// was an accidental duplication, not a deliberate choice. This module is
// the single source of truth both files import from instead.
//
// No config is passed to the constructor (matches both the reference
// scripts and the ArcVault implementation it was ported from) — chain,
// kit key, and slippage are all supplied per-call in `estimateSwap`/
// `swap` params, not on the instance itself.
import { AppKit } from '@circle-fin/app-kit'
import { installCircleProxyBridge } from './circleProxyBridge'

let instance: AppKit | null = null

export function getAppKit(): AppKit {
  if (!instance) {
    // Install fetch interceptor BEFORE AppKit is created
    installCircleProxyBridge()

    instance = new AppKit()
  }

  return instance
}