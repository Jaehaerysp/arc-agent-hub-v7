import { formatTokenAmount } from '../../lib/format'

/**
 * Pure selectors for the Payments page — same pattern as
 * walletAnalytics.js/jobsAnalytics.js. Reads only from data the page
 * already has: `wallet.activity` (locally logged transactions, filtered to
 * `type: 'payment'`) and a live fee-estimate result. No new state, no
 * fabricated figures.
 */

/** Payment History — only activity entries logged by this feature. */
export function computePaymentHistory(activity, limit = 10) {
  return activity
    .filter((a) => a.type === 'payment')
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      hash: a.txHash,
      detail: a.detail || a.label,
      status: a.status,
      timestamp: a.timestamp,
    }))
}

/** Formats a live fee-estimate result into a display string, or a fallback while unavailable. */
export function formatFeeEstimate(fee, loading, error) {
  if (loading) return 'Estimating…'
  if (error) return 'Unavailable'
  if (!fee || fee.feeFormatted === null) return '—'
  return `${formatTokenAmount(fee.feeFormatted, 6)} (network gas)`
}
