import { describe, it, expect } from 'vitest'
import { computeJobStats } from './JobStats'

// Status enum, mirrored from the on-chain Job.status ordering documented in
// ARCHITECTURE.md: 0 Open, 1 Funded, 2 Submitted, 3 Completed.
const OPEN = 0
const FUNDED = 1
const SUBMITTED = 2
const COMPLETED = 3

describe('computeJobStats', () => {
  it('returns all-zero stats for an empty jobs array', () => {
    expect(computeJobStats([])).toEqual({
      total: 0,
      open: 0,
      funded: 0,
      submitted: 0,
      completed: 0,
      totalEscrow: 0,
      averageBudget: 0,
    })
  })

  it('counts jobs per status bucket', () => {
    const jobs = [
      { status: OPEN, budgetFormatted: '0' },
      { status: OPEN, budgetFormatted: '0' },
      { status: FUNDED, budgetFormatted: '10' },
      { status: SUBMITTED, budgetFormatted: '20' },
      { status: COMPLETED, budgetFormatted: '30' },
    ]
    const stats = computeJobStats(jobs)
    expect(stats.total).toBe(5)
    expect(stats.open).toBe(2)
    expect(stats.funded).toBe(1)
    expect(stats.submitted).toBe(1)
    expect(stats.completed).toBe(1)
  })

  it('sums escrow only across funded and submitted jobs', () => {
    const jobs = [
      { status: OPEN, budgetFormatted: '100' }, // excluded: not funded/submitted
      { status: FUNDED, budgetFormatted: '10' },
      { status: SUBMITTED, budgetFormatted: '20' },
      { status: COMPLETED, budgetFormatted: '999' }, // excluded: already settled
    ]
    expect(computeJobStats(jobs).totalEscrow).toBe(30)
  })

  it('averages budget only across jobs with a budget greater than zero', () => {
    const jobs = [
      { status: OPEN, budgetFormatted: '0' }, // excluded: no budget set yet
      { status: FUNDED, budgetFormatted: '10' },
      { status: SUBMITTED, budgetFormatted: '30' },
    ]
    expect(computeJobStats(jobs).averageBudget).toBe(20)
  })

  it('returns an averageBudget of 0 when no job has a budget set', () => {
    const jobs = [
      { status: OPEN, budgetFormatted: '0' },
      { status: OPEN, budgetFormatted: '0' },
    ]
    expect(computeJobStats(jobs).averageBudget).toBe(0)
  })
})
