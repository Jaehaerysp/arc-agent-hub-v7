import { describe, it, expect } from 'vitest'
import {
  computeMarketplaceStats,
  getVerifiedAgents,
  getAgentMomentum,
  getAgentGrowthLabel,
  getTrendingAgents,
  getFeaturedAgents,
} from './marketplaceLogic'

const AGENTS = [
  {
    wallet: '0xaaa',
    category: 'Research',
    reputation: 4.8,
    completedJobs: 200,
    responseRate: 98,
    availability: 'available',
    registered: true,
  },
  {
    wallet: '0xbbb',
    category: 'Content',
    reputation: 4.0,
    completedJobs: 50,
    responseRate: 90,
    availability: 'busy',
    registered: false,
  },
  {
    wallet: '0xccc',
    category: 'Finance',
    reputation: 4.9,
    completedJobs: 10,
    responseRate: 91,
    availability: 'at_capacity',
    registered: true,
  },
]

describe('computeMarketplaceStats', () => {
  it('returns all-zero stats for an empty agent list', () => {
    expect(computeMarketplaceStats([])).toEqual({
      total: 0,
      verified: 0,
      totalCompletedJobs: 0,
      avgReputation: 0,
      avgTrustPercent: 0,
      availableNow: 0,
    })
  })

  it('counts verified (registered) agents', () => {
    expect(computeMarketplaceStats(AGENTS).verified).toBe(2)
  })

  it('counts agents currently available', () => {
    expect(computeMarketplaceStats(AGENTS).availableNow).toBe(1)
  })

  it('sums completed jobs and averages reputation', () => {
    const stats = computeMarketplaceStats(AGENTS)
    expect(stats.totalCompletedJobs).toBe(260)
    expect(stats.avgReputation).toBeCloseTo(4.566, 2)
  })
})

describe('getVerifiedAgents', () => {
  it('filters to only registered agents', () => {
    expect(getVerifiedAgents(AGENTS).map((a) => a.wallet)).toEqual(['0xaaa', '0xccc'])
  })
})

describe('getAgentMomentum / getAgentGrowthLabel', () => {
  it('is deterministic for the same agent', () => {
    expect(getAgentMomentum(AGENTS[0])).toBe(getAgentMomentum(AGENTS[0]))
    expect(getAgentGrowthLabel(AGENTS[0])).toBe(getAgentGrowthLabel(AGENTS[0]))
  })

  it('produces a percentage-formatted growth label', () => {
    expect(getAgentGrowthLabel(AGENTS[0])).toMatch(/^\+\d+%$/)
  })
})

describe('getTrendingAgents', () => {
  it('ranks agents starting at 1 and respects the limit', () => {
    const trending = getTrendingAgents(AGENTS, 2)
    expect(trending).toHaveLength(2)
    expect(trending[0].rank).toBe(1)
    expect(trending[1].rank).toBe(2)
  })
})

describe('getFeaturedAgents', () => {
  it('sorts by reputation descending', () => {
    const featured = getFeaturedAgents(AGENTS, 3)
    expect(featured.map((a) => a.wallet)).toEqual(['0xccc', '0xaaa', '0xbbb'])
  })

  it('respects the limit', () => {
    expect(getFeaturedAgents(AGENTS, 1)).toHaveLength(1)
  })
})
