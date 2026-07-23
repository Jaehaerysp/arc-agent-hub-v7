import { describe, it, expect } from 'vitest'
import { SWAP_STATUS, swapStatusLabel, computeSwapHistory, formatSwapAmount } from './swapHistoryService'

const ACTIVITY = [
  { id: 1, type: 'swap', status: 'success', txHash: '0xabc', tokenIn: 'USDC', tokenOut: 'EURC', amountIn: '1', amountOut: '0.92', wallet: '0x1234…5678', timestamp: '2026-07-01T00:00:00Z' },
  { id: 2, type: 'payment', status: 'success', detail: 'not a swap', timestamp: '2026-07-01T00:00:00Z' },
  { id: 3, type: 'swap', status: 'error', detail: 'Quote unavailable', tokenIn: 'EURC', tokenOut: 'USDC', amountIn: '2', timestamp: '2026-07-02T00:00:00Z' },
]

describe('SWAP_STATUS', () => {
  it('covers the single-transaction swap lifecycle', () => {
    expect(SWAP_STATUS).toEqual(['pending', 'success', 'error'])
  })
})

describe('swapStatusLabel', () => {
  it('labels every known status', () => {
    for (const status of SWAP_STATUS) {
      expect(swapStatusLabel(status)).not.toBe('Unknown')
    }
  })

  it('falls back to Unknown for anything else', () => {
    expect(swapStatusLabel('not-a-status')).toBe('Unknown')
  })
})

describe('computeSwapHistory', () => {
  it('only includes swap activity entries, not payments or other types', () => {
    const history = computeSwapHistory(ACTIVITY)
    expect(history).toHaveLength(2)
    expect(history.every((h) => ACTIVITY.find((a) => a.id === h.id).type === 'swap')).toBe(true)
  })

  it('respects the limit', () => {
    expect(computeSwapHistory(ACTIVITY, 1)).toHaveLength(1)
  })

  it('carries through token in/out, amounts, wallet, hash, and status', () => {
    const [entry] = computeSwapHistory(ACTIVITY, 1)
    expect(entry).toMatchObject({
      hash: '0xabc',
      tokenIn: 'USDC',
      tokenOut: 'EURC',
      amountIn: '1',
      amountOut: '0.92',
      wallet: '0x1234…5678',
      status: 'success',
    })
  })
})

describe('formatSwapAmount', () => {
  it('formats an amount with its symbol', () => {
    expect(formatSwapAmount(1.5, 'USDC')).toBe('1.5 USDC')
  })

  it('falls back for a missing amount', () => {
    expect(formatSwapAmount(null, 'USDC')).toBe('—')
  })
})
