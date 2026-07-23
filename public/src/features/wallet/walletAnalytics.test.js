import { describe, it, expect } from 'vitest'
import {
  computeAssetBalances,
  computeExtendedAssetBalances,
  computeRecentTransactions,
  computeActivityTimeline,
  computeNetworkInfo,
  computePortfolioTotals,
  filterAssetsBySearch,
  filterAssetsByCategory,
  txTypeLabel,
} from './walletAnalytics'

function activityEntry(overrides = {}) {
  return { id: 1, type: 'transfer', label: 'ANV transfer', status: 'success', timestamp: '2026-01-01T00:00:00.000Z', ...overrides }
}

describe('computeAssetBalances', () => {
  it('returns native and ANV assets with no fabricated USD value', () => {
    const assets = computeAssetBalances(12.5, 42, true)
    expect(assets).toHaveLength(2)
    expect(assets[0].key).toBe('native')
    expect(assets[0].usdValue).toBeNull()
    expect(assets[1].key).toBe('anv')
    expect(assets[1].usdValue).toBeNull()
    expect(assets.every((a) => a.status === 'connected')).toBe(true)
  })

  it('flags wrong-network status when not on Arc', () => {
    const assets = computeAssetBalances(null, null, false)
    expect(assets.every((a) => a.status === 'wrong-network')).toBe(true)
  })
})

describe('computeExtendedAssetBalances', () => {
  const base = computeAssetBalances(12.5, 42, true)

  it('appends live token balances after the base native/ANV assets', () => {
    const tokenBalances = [
      { key: 'eurc', symbol: 'EURC', name: 'EURC Token', balance: 5, address: '0x1', error: null },
    ]
    const assets = computeExtendedAssetBalances(base, tokenBalances, true)
    expect(assets).toHaveLength(3)
    expect(assets[2].key).toBe('eurc')
    expect(assets[2].status).toBe('connected')
    expect(assets[2].usdValue).toBeNull()
  })

  it('surfaces a per-token error instead of a fabricated zero balance', () => {
    const tokenBalances = [
      { key: 'znp', symbol: 'ZNP', name: 'ZNP Token', balance: null, address: '0x2', error: 'Balance read failed' },
    ]
    const assets = computeExtendedAssetBalances(base, tokenBalances, true)
    expect(assets[2].status).toBe('error')
    expect(assets[2].balanceFormatted).toBe('Error')
  })

  it('returns just the base assets when there are no extra tokens yet', () => {
    expect(computeExtendedAssetBalances(base, [], true)).toHaveLength(2)
  })
})

describe('computeRecentTransactions', () => {
  it('only includes activity entries with a real tx hash', () => {
    const activity = [activityEntry({ id: 1, txHash: '0xabc' }), activityEntry({ id: 2, txHash: null })]
    const txs = computeRecentTransactions(activity, 10)
    expect(txs).toHaveLength(1)
    expect(txs[0].hash).toBe('0xabc')
  })

  it('respects the limit', () => {
    const activity = Array.from({ length: 5 }, (_, i) => activityEntry({ id: i, txHash: `0x${i}` }))
    expect(computeRecentTransactions(activity, 2)).toHaveLength(2)
  })

  it('falls back to an em dash when there is no detail', () => {
    const activity = [activityEntry({ id: 1, txHash: '0xabc', detail: undefined })]
    expect(computeRecentTransactions(activity)[0].amount).toBe('—')
  })
})

describe('computeActivityTimeline', () => {
  it('maps every activity entry, not just ones with a tx hash', () => {
    const activity = [activityEntry({ id: 1, txHash: null }), activityEntry({ id: 2, txHash: '0xabc' })]
    expect(computeActivityTimeline(activity)).toHaveLength(2)
  })
})

describe('computeNetworkInfo', () => {
  it('reports operational registry status when all four contracts are configured', () => {
    const info = computeNetworkInfo({ isArcNetwork: true, chainId: 5042002, rpcUrl: 'https://rpc', blockNumber: 100, gasPriceGwei: 1.2, latencyMs: 50 })
    expect(info.registryStatus).toBe('operational')
    expect(info.contractCount).toBe(4)
  })
})

describe('computePortfolioTotals', () => {
  it('counts tracked tokens and tokens actually held', () => {
    const assets = [
      { key: 'a', balance: 5 },
      { key: 'b', balance: 0 },
      { key: 'c', balance: null },
    ]
    const totals = computePortfolioTotals(assets)
    expect(totals.totalTokens).toBe(3)
    expect(totals.totalHeld).toBe(1)
  })
})

describe('filterAssetsBySearch', () => {
  const assets = [
    { key: 'agc', name: 'AgentCore', symbol: 'AGC', address: '0xAaAa' },
    { key: 'lqs', name: 'LiquiSwap', symbol: 'LQS', address: '0xBbBb' },
  ]

  it('matches by name, symbol, or address, case-insensitively', () => {
    expect(filterAssetsBySearch(assets, 'agent')).toHaveLength(1)
    expect(filterAssetsBySearch(assets, 'lqs')).toHaveLength(1)
    expect(filterAssetsBySearch(assets, '0xbbbb')).toHaveLength(1)
  })

  it('returns everything for an empty query', () => {
    expect(filterAssetsBySearch(assets, '')).toHaveLength(2)
    expect(filterAssetsBySearch(assets, '   ')).toHaveLength(2)
  })

  it('returns nothing when no asset matches', () => {
    expect(filterAssetsBySearch(assets, 'nope')).toHaveLength(0)
  })
})

describe('filterAssetsByCategory', () => {
  const assets = [
    { key: 'native', category: 'native' },
    { key: 'agc', category: 'ai' },
    { key: 'lqs', category: 'defi' },
  ]

  it('returns everything for the synthetic "all" category', () => {
    expect(filterAssetsByCategory(assets, 'all')).toHaveLength(3)
    expect(filterAssetsByCategory(assets, undefined)).toHaveLength(3)
  })

  it('filters down to a single category', () => {
    expect(filterAssetsByCategory(assets, 'ai')).toEqual([{ key: 'agc', category: 'ai' }])
  })
})

describe('txTypeLabel', () => {
  it('maps known types to human labels', () => {
    expect(txTypeLabel('transfer')).toBe('Transfer')
    expect(txTypeLabel('job')).toBe('Job')
  })

  it('title-cases unknown types instead of throwing', () => {
    expect(txTypeLabel('custom')).toBe('Custom')
  })

  it('falls back to Activity for a missing type', () => {
    expect(txTypeLabel(undefined)).toBe('Activity')
  })
})
