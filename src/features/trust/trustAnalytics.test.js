import { describe, it, expect } from 'vitest'
import {
  computeTrustEvents,
  computeReputationEvents,
  computeValidationEvents,
  computeReputationStats,
  computeValidationStats,
  computeTrustScore,
  computeValidationSuccessRing,
  computeNetworkDistribution,
  computeBadges,
  computeCertificates,
  computeSecurityInsights,
  computeRiskLevel,
  computeReputationTimeline,
} from './trustAnalytics'

function feedback(overrides = {}) {
  return { id: Math.random(), type: 'feedback', status: 'success', timestamp: new Date().toISOString(), score: 8, feedbackType: 'Validator', ...overrides }
}

function validation(overrides = {}) {
  return { id: Math.random(), type: 'validation', status: 'success', timestamp: new Date().toISOString(), validator: '0xabc', ...overrides }
}

describe('computeTrustEvents / computeReputationEvents / computeValidationEvents', () => {
  it('filters activity by type', () => {
    const activity = [feedback(), validation(), { id: 1, type: 'job', status: 'success' }]
    expect(computeTrustEvents(activity)).toHaveLength(2)
    expect(computeReputationEvents(activity)).toHaveLength(1)
    expect(computeValidationEvents(activity)).toHaveLength(1)
  })
})

describe('computeReputationStats', () => {
  it('averages score across successful feedback only', () => {
    const activity = [feedback({ score: 10 }), feedback({ score: 6 }), feedback({ status: 'error', score: undefined })]
    const stats = computeReputationStats(activity)
    expect(stats.total).toBe(3)
    expect(stats.successful).toBe(2)
    expect(stats.failed).toBe(1)
    expect(stats.averageScore).toBe(8)
  })

  it('returns null average when there is no successful feedback', () => {
    expect(computeReputationStats([]).averageScore).toBeNull()
  })
})

describe('computeValidationStats', () => {
  it('splits requested vs failed', () => {
    const activity = [validation(), validation({ status: 'error' })]
    expect(computeValidationStats(activity)).toEqual({ total: 2, requested: 1, failed: 1 })
  })
})

describe('computeTrustScore', () => {
  it('is unregistered with no agentId', () => {
    expect(computeTrustScore(null, computeReputationStats([]), computeValidationStats([]))).toEqual({ score: null, tier: 'Unregistered' })
  })

  it('is New with an agentId but no activity', () => {
    const result = computeTrustScore('1', computeReputationStats([]), computeValidationStats([]))
    expect(result.score).toBe(50)
    expect(result.tier).toBe('Building')
  })

  it('reaches Elite with strong scores and validations', () => {
    const activity = [feedback({ score: 10 }), validation(), validation(), validation(), validation(), validation()]
    const result = computeTrustScore('1', computeReputationStats(activity), computeValidationStats(activity))
    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.tier).toBe('Elite')
  })
})

describe('computeValidationSuccessRing', () => {
  it('returns null with no attempts', () => {
    expect(computeValidationSuccessRing({ requested: 0, failed: 0 })).toBeNull()
  })

  it('computes a percent otherwise', () => {
    expect(computeValidationSuccessRing({ requested: 3, failed: 1 })).toBe(75)
  })
})

describe('computeNetworkDistribution', () => {
  it('buckets successful feedback by feedbackType', () => {
    const activity = [feedback({ feedbackType: 'Peer' }), feedback({ feedbackType: 'Peer' }), feedback({ feedbackType: 'Community' })]
    const dist = computeNetworkDistribution(activity)
    expect(dist.find((d) => d.label === 'Peer').value).toBe(2)
    expect(dist.find((d) => d.label === 'Community').value).toBe(1)
    expect(dist.find((d) => d.label === 'Validator').value).toBe(0)
  })
})

describe('computeBadges', () => {
  it('unlocks badges based on real thresholds only', () => {
    const reputationStats = { total: 5, successful: 5, failed: 0, averageScore: 9 }
    const validationStats = { total: 3, requested: 3, failed: 0 }
    const badges = computeBadges('1', reputationStats, validationStats, 'Elite')
    const byKey = Object.fromEntries(badges.map((b) => [b.key, b.unlocked]))
    expect(byKey.verified).toBe(true)
    expect(byKey.trusted).toBe(true)
    expect(byKey.elite).toBe(true)
    expect(byKey.contributor).toBe(true)
    expect(byKey.builder).toBe(true)
    expect(byKey['top-provider']).toBe(true)
  })

  it('keeps badges locked when thresholds are not met', () => {
    const badges = computeBadges(null, { successful: 0 }, { requested: 0 }, 'Unregistered')
    expect(badges.every((b) => !b.unlocked)).toBe(true)
  })
})

describe('computeCertificates', () => {
  it('unlocks Trust Passport only when identity + validation + feedback all exist', () => {
    const reputationStats = { successful: 1 }
    const validationStats = { requested: 1 }
    const certs = computeCertificates('1', reputationStats, validationStats, true)
    expect(certs.find((c) => c.key === 'passport').unlocked).toBe(true)
  })

  it('keeps Trust Passport locked when any leg is missing', () => {
    const certs = computeCertificates('1', { successful: 0 }, { requested: 1 }, true)
    expect(certs.find((c) => c.key === 'passport').unlocked).toBe(false)
  })
})

describe('computeSecurityInsights / computeRiskLevel', () => {
  it('is Low risk when everything checks out', () => {
    const insights = computeSecurityInsights('1', { requested: 1 }, true)
    expect(insights.every((i) => i.status === 'healthy')).toBe(true)
    expect(computeRiskLevel(insights)).toBe('Low')
  })

  it('is Elevated risk when identity and validation are both missing', () => {
    const insights = computeSecurityInsights(null, { requested: 0 }, true)
    expect(computeRiskLevel(insights)).toBe('Elevated')
  })

  it('is Medium risk when only one check needs attention', () => {
    const insights = computeSecurityInsights(null, { requested: 1 }, true)
    expect(computeRiskLevel(insights)).toBe('Medium')
  })
})

describe('computeReputationTimeline', () => {
  it('includes an Agent Registered milestone when agentId is set', () => {
    const milestones = computeReputationTimeline([], '42')
    expect(milestones.some((m) => m.id === 'agent-registered')).toBe(true)
  })

  it('produces no milestones without an agentId or activity', () => {
    expect(computeReputationTimeline([], null)).toEqual([])
  })
})
