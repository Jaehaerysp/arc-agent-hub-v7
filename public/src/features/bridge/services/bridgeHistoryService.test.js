import { describe, it, expect } from 'vitest'
import { BRIDGE_STATUS, bridgeStatusLabel, computeBridgeHistory, formatBridgeAmount } from './bridgeHistoryService'

const ACTIVITY = [
  { id: 1, type: 'bridge', status: 'completed', txHash: '0xabc', detail: '1 USDC → Base Sepolia', sourceNetwork: 'Arc Testnet', destinationNetwork: 'Base Sepolia', amount: '1', tokenSymbol: 'USDC', timestamp: '2026-07-01T00:00:00Z' },
  { id: 2, type: 'payment', status: 'success', detail: 'not a bridge', timestamp: '2026-07-01T00:00:00Z' },
  { id: 3, type: 'bridge', status: 'failed', detail: '2 EURC → Polygon Amoy', timestamp: '2026-07-02T00:00:00Z' },
]

describe('BRIDGE_STATUS', () => {
  it('covers the full Sprint 3.2 pipeline, burn through mint', () => {
    expect(BRIDGE_STATUS).toEqual([
      'pending',
      'submitted',
      'confirming',
      'burn_confirmed',
      'switching_network',
      'waiting_attestation',
      'minting',
      'mint_confirmed',
      'completed',
      'failed',
    ])
  })
})

describe('bridgeStatusLabel', () => {
  it('labels every known status', () => {
    for (const status of BRIDGE_STATUS) {
      expect(bridgeStatusLabel(status)).not.toBe('Unknown')
    }
  })

  it('falls back to Unknown for anything else', () => {
    expect(bridgeStatusLabel('not-a-status')).toBe('Unknown')
  })
})

describe('computeBridgeHistory', () => {
  it('only includes bridge activity entries, not payments or other types', () => {
    const history = computeBridgeHistory(ACTIVITY)
    expect(history).toHaveLength(2)
    expect(history.every((h) => ACTIVITY.find((a) => a.id === h.id).type === 'bridge')).toBe(true)
  })

  it('respects the limit', () => {
    expect(computeBridgeHistory(ACTIVITY, 1)).toHaveLength(1)
  })
})

describe('formatBridgeAmount', () => {
  it('formats an amount with its symbol', () => {
    expect(formatBridgeAmount(1.5, 'USDC')).toBe('1.5 USDC')
  })

  it('falls back for a missing amount', () => {
    expect(formatBridgeAmount(null, 'USDC')).toBe('—')
  })
})
