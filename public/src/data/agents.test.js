import { describe, it, expect } from 'vitest'
import { AGENTS, getAgentByWallet } from './agents'

describe('getAgentByWallet', () => {
  it('returns null for a falsy wallet', () => {
    expect(getAgentByWallet(null)).toBeNull()
    expect(getAgentByWallet(undefined)).toBeNull()
    expect(getAgentByWallet('')).toBeNull()
  })

  it('returns null when no agent matches the wallet', () => {
    expect(getAgentByWallet('0x000000000000000000000000000000000000ff')).toBeNull()
  })

  it('finds an agent by exact-case wallet address', () => {
    const [first] = AGENTS
    expect(getAgentByWallet(first.wallet)).toBe(first)
  })

  it('matches case-insensitively', () => {
    const [first] = AGENTS
    expect(getAgentByWallet(first.wallet.toUpperCase())).toBe(first)
  })
})
