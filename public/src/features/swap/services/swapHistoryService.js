// Universal Token Swap (Sprint 4) — pure selectors over `wallet.activity`,
// same pattern as `bridgeHistoryService.js`/`paymentsAnalytics.js`. No new
// state, no separate history store — reads only entries this feature
// itself logged via `addActivity` (`type: 'swap'`), which `useWallet.js`
// already persists (see `useLocalStorage('arc_activity', ...)`). Every
// field the Sprint 4 brief's "History" section asks for (token in/out,
// amount, wallet, timestamp, tx hash, explorer URL, status) is already
// present on that entry shape — `explorerUrl` is composed by the caller
// from `arcExplorer` + `hash`, same as every other history table in this
// app (Bridge/Payments).

import { formatTokenAmount } from '../../../lib/format'

// Swap is a single-transaction write (one `kit.swap()` call — no separate
// burn/mint phases like Bridge), so its activity `status` follows the
// same 'pending' | 'success' | 'error' convention Payments already uses
// rather than Bridge's multi-phase pipeline.
export const SWAP_STATUS = ['pending', 'success', 'error']

export function swapStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'success':
      return 'Completed'
    case 'error':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

/** Swap History table rows — only activity entries logged by this feature. */
export function computeSwapHistory(activity, limit = 10) {
  return activity
    .filter((a) => a.type === 'swap')
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      hash: a.txHash,
      tokenIn: a.tokenIn,
      tokenOut: a.tokenOut,
      amountIn: a.amountIn,
      amountOut: a.amountOut,
      wallet: a.wallet,
      detail: a.detail || a.label,
      status: a.status,
      timestamp: a.timestamp,
    }))
}

export function formatSwapAmount(amount, symbol) {
  if (amount === null || amount === undefined) return '—'
  return `${formatTokenAmount(Number(amount), 4)} ${symbol}`
}
