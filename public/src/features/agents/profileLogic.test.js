import { describe, it, expect } from 'vitest'
import {
  computeTrustBreakdown,
  getAverageResponseLabel,
  getPerformanceSeries,
  getSimilarAgents,
  getWorkHistory,
  getReviews,
} from './profileLogic'

const AGENT_A = {
  wallet: '0xaaa',
  category: 'Research',
  reputation: 4.8,
  completedJobs: 200,
  successRate: 97,
  responseRate: 98,
  avgDeliveryHours: 5,
  workHistory: [{ jobId: 'JOB-1', client: '0x1', result: 'Done', status: 'completed', date: '2026-01-01' }],
  reviews: [{ name: 'Client', comment: 'Great', job: 'Job', date: '2026-01-01', score: 5 }],
}

const AGENT_B = { wallet: '0xbbb', category: 'Content', reputation: 4.0, completedJobs: 50, successRate: 90, responseRate: 90 }
const AGENT_C = { wallet: '0xccc', category: 'Research', reputation: 4.9, completedJobs: 10, successRate: 91, responseRate: 91 }

const AGENTS = [AGENT_A, AGENT_B, AGENT_C]

describe('computeTrustBreakdown', () => {
  it('derives a 0-100 trust percent from the 0-5 reputation scale', () => {
    expect(computeTrustBreakdown(AGENT_A).trustPercent).toBe(96)
  })

  it('derives approval rate from success rate', () => {
    expect(computeTrustBreakdown(AGENT_A).approvalRate).toBe(Math.round(97 * 0.98))
  })

  it('passes through completed jobs and response rate unchanged', () => {
    const result = computeTrustBreakdown(AGENT_A)
    expect(result.completedJobs).toBe(200)
    expect(result.responseRate).toBe(98)
  })
})

describe('getAverageResponseLabel', () => {
  it('is deterministic for the same agent', () => {
    expect(getAverageResponseLabel(AGENT_A)).toBe(getAverageResponseLabel(AGENT_A))
  })

  it('returns a minute or hour label', () => {
    expect(getAverageResponseLabel(AGENT_A)).toMatch(/min|hr/)
  })
})

describe('getPerformanceSeries', () => {
  it('returns 12 monthly points', () => {
    expect(getPerformanceSeries(AGENT_A)).toHaveLength(12)
  })

  it('is deterministic for the same agent', () => {
    expect(getPerformanceSeries(AGENT_A)).toEqual(getPerformanceSeries(AGENT_A))
  })

  it('keeps trust values within the 0-5 scale', () => {
    getPerformanceSeries(AGENT_A).forEach((point) => {
      expect(point.trust).toBeGreaterThanOrEqual(0)
      expect(point.trust).toBeLessThanOrEqual(5)
    })
  })
})

describe('getSimilarAgents', () => {
  it('prefers agents in the same category, excluding self', () => {
    const similar = getSimilarAgents(AGENTS, AGENT_A, 4)
    expect(similar.map((a) => a.wallet)).toEqual(['0xccc'])
  })

  it('falls back to all other agents when no category match exists', () => {
    const similar = getSimilarAgents(AGENTS, AGENT_B, 4)
    expect(similar.map((a) => a.wallet)).toEqual(['0xccc', '0xaaa'])
  })

  it('returns an empty array when agent is missing', () => {
    expect(getSimilarAgents(AGENTS, null)).toEqual([])
  })
})

describe('getWorkHistory / getReviews', () => {
  it('returns the agent arrays, defaulting to empty', () => {
    expect(getWorkHistory(AGENT_A)).toHaveLength(1)
    expect(getReviews(AGENT_A)).toHaveLength(1)
    expect(getWorkHistory(AGENT_B)).toEqual([])
    expect(getReviews(undefined)).toEqual([])
  })
})
