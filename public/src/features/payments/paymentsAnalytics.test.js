import { describe, it, expect } from 'vitest'
import { computePaymentHistory, formatFeeEstimate } from './paymentsAnalytics'

function activityEntry(overrides = {}) {
  return { id: 1, type: 'payment', label: 'USDC payment', status: 'success', timestamp: '2026-01-01T00:00:00.000Z', ...overrides }
}

describe('computePaymentHistory', () => {
  it('only includes activity entries of type "payment"', () => {
    const activity = [activityEntry({ id: 1 }), activityEntry({ id: 2, type: 'transfer' })]
    const payments = computePaymentHistory(activity, 10)
    expect(payments).toHaveLength(1)
    expect(payments[0].id).toBe(1)
  })

  it('respects the limit', () => {
    const activity = Array.from({ length: 5 }, (_, i) => activityEntry({ id: i }))
    expect(computePaymentHistory(activity, 2)).toHaveLength(2)
  })

  it('falls back to the label when there is no detail', () => {
    const activity = [activityEntry({ detail: undefined, label: 'USDC payment' })]
    expect(computePaymentHistory(activity)[0].detail).toBe('USDC payment')
  })
})

describe('formatFeeEstimate', () => {
  it('shows a loading message while estimating', () => {
    expect(formatFeeEstimate(null, true, null)).toBe('Estimating…')
  })

  it('shows unavailable on error', () => {
    expect(formatFeeEstimate(null, false, 'RPC error')).toBe('Unavailable')
  })

  it('shows an em dash when there is no estimate yet', () => {
    expect(formatFeeEstimate(null, false, null)).toBe('—')
  })

  it('formats a resolved fee estimate', () => {
    const result = formatFeeEstimate({ feeFormatted: 0.000123 }, false, null)
    expect(result).toContain('network gas')
  })
})
