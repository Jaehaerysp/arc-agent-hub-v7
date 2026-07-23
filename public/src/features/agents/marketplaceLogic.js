// Marketplace v7 (Mission 4) — pure, side-effect-free derived-data helpers.
//
// Everything here is computed from the existing AGENTS catalog (see
// src/data/agents.js). Nothing in this file adds new fields to that data
// or changes what `computeAgentStats` in ./components/AgentStats.jsx
// returns — that function and its test stay exactly as they are. This
// module only adds *additional* read-only views over the same catalog for
// the new premium sections (Featured, Stats strip, Trending, Verified).

/** Cheap, deterministic string hash — mirrors the approach already used by
 *  AgentIdentityMark, so the same wallet always derives the same numbers. */
function hashSeed(input) {
  let h = 0
  const str = String(input || '0x0')
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * Marketplace-wide stats for the animated MetricCard strip. A superset of
 * `computeAgentStats` (kept separate on purpose — that function has its
 * own test asserting an exact shape, this one is free to grow).
 */
export function computeMarketplaceStats(agents = []) {
  const total = agents.length
  const verified = agents.filter((a) => a.registered).length
  const totalCompletedJobs = agents.reduce((sum, a) => sum + (a.completedJobs || 0), 0)
  const avgReputation = total ? agents.reduce((sum, a) => sum + (a.reputation || 0), 0) / total : 0
  const availableNow = agents.filter((a) => a.availability === 'available').length

  return {
    total,
    verified,
    totalCompletedJobs,
    avgReputation,
    avgTrustPercent: Math.round((avgReputation / 5) * 1000) / 10,
    availableNow,
  }
}

/** Agents registered on the ERC-8004 Identity Registry — the marketplace's "verified" signal. */
export function getVerifiedAgents(agents = []) {
  return agents.filter((a) => a.registered)
}

/**
 * A deterministic "momentum" score per agent, used only to rank the
 * Trending section and render a growth indicator. Derived entirely from
 * existing fields (reputation, completed jobs, response rate) plus a
 * stable per-wallet jitter so the ranking doesn't tie — no hidden state,
 * no randomness that would change between renders.
 */
export function getAgentMomentum(agent) {
  const jitter = (hashSeed(agent.wallet) % 700) / 100 // 0.00–6.99, stable per wallet
  return agent.reputation * 12 + agent.completedJobs * 0.05 + agent.responseRate * 0.1 + jitter
}

/** A small, deterministic "+N%" growth label for the Trending section — cosmetic, not stored data. */
export function getAgentGrowthLabel(agent) {
  const pct = 4 + (hashSeed(agent.wallet + agent.completedJobs) % 28) // 4%–31%
  return `+${pct}%`
}

/** Top `limit` agents by momentum, each annotated with its rank and growth label. */
export function getTrendingAgents(agents = [], limit = 4) {
  return [...agents]
    .sort((a, b) => getAgentMomentum(b) - getAgentMomentum(a))
    .slice(0, limit)
    .map((agent, index) => ({ agent, rank: index + 1, growth: getAgentGrowthLabel(agent) }))
}

/** Top `limit` agents by reputation — the large horizontal Featured cards. */
export function getFeaturedAgents(agents = [], limit = 3) {
  return [...agents].sort((a, b) => b.reputation - a.reputation).slice(0, limit)
}
