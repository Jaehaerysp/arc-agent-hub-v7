import { describe, it, expect } from 'vitest'
import { computeAgentStats } from './AgentStats'

describe('computeAgentStats', () => {
  it('returns all-zero stats for an empty agent list', () => {
    expect(computeAgentStats([])).toEqual({
      total: 0,
      categories: 0,
      avgReputation: 0,
      totalCompletedJobs: 0,
    })
  })

  it('counts total agents and distinct categories', () => {
    const agents = [
      { category: 'Research', reputation: 4.8, completedJobs: 10 },
      { category: 'Research', reputation: 4.0, completedJobs: 5 },
      { category: 'Content', reputation: 4.6, completedJobs: 20 },
    ]
    const stats = computeAgentStats(agents)
    expect(stats.total).toBe(3)
    expect(stats.categories).toBe(2)
  })

  it('averages reputation across all agents', () => {
    const agents = [
      { category: 'A', reputation: 4.0, completedJobs: 0 },
      { category: 'B', reputation: 5.0, completedJobs: 0 },
    ]
    expect(computeAgentStats(agents).avgReputation).toBe(4.5)
  })

  it('sums completed jobs across all agents', () => {
    const agents = [
      { category: 'A', reputation: 4.5, completedJobs: 100 },
      { category: 'B', reputation: 4.5, completedJobs: 50 },
    ]
    expect(computeAgentStats(agents).totalCompletedJobs).toBe(150)
  })
})
