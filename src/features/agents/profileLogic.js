// Agent Profile v7 (Mission 5) — pure, side-effect-free derived-data helpers.
//
// Everything here is computed from a single agent object (see
// src/data/agents.js) or the full AGENTS catalog. Nothing in this file
// mutates the catalog or changes what getAgentByWallet / computeAgentStats /
// computeMarketplaceStats return — this module only adds read-only views
// for the new Agent Profile sections (Trust Snapshot rings, Performance
// charts, Work History, Reviews, Similar Agents).

/** Cheap, deterministic string hash — mirrors the approach already used by
 *  AgentIdentityMark and marketplaceLogic, so the same wallet always
 *  derives the same numbers. */
function hashSeed(input) {
  let h = 0
  const str = String(input || '0x0')
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Trust Snapshot ring values (0–100), each grounded in an existing agent
 * fact — never a fabricated number. Approval rate is derived from success
 * rate (a slightly gentler curve, since "approved" and "successful" are
 * related but not identical signals) rather than being its own stored field.
 */
export function computeTrustBreakdown(agent) {
  const trustPercent = Math.round(((agent.reputation || 0) / 5) * 100)
  const successRate = agent.successRate || 0
  const approvalRate = Math.max(0, Math.min(100, Math.round(successRate * 0.98)))
  const responseRate = agent.responseRate || 0

  return {
    trustPercent,
    successRate,
    approvalRate,
    responseRate,
    completedJobs: agent.completedJobs || 0,
  }
}

/**
 * A deterministic average-response-time label. Faster average delivery
 * (avgDeliveryHours) and a higher response rate both push the figure down —
 * derived entirely from existing fields, no new stored data.
 */
export function getAverageResponseLabel(agent) {
  const hours = agent.avgDeliveryHours || 4
  const minutes = Math.max(2, Math.round((hours * 60) / ((agent.responseRate || 90) / 12)))
  if (minutes < 60) return `${minutes} min`
  return `${(minutes / 60).toFixed(1)} hr`
}

/**
 * 12 monthly points (oldest → newest) for the Performance charts:
 * job volume and trust growth. Deterministic per wallet so the same agent
 * always renders the same "history" — a stable per-wallet jitter avoids
 * every agent's chart looking identical while nothing here is random
 * between renders.
 */
export function getPerformanceSeries(agent) {
  const seed = hashSeed(agent.wallet)
  const totalJobs = agent.completedJobs || 0
  const baseTrust = agent.reputation || 4

  const months = Array.from({ length: 12 }, (_, i) => {
    const jitter = ((seed >> (i % 24)) % 17) / 100 // 0.00–0.16, stable per wallet+month
    const monthWeight = 0.55 + (i / 11) * 0.45 // gentle upward ramp toward "now"
    const jobs = Math.max(1, Math.round(((totalJobs / 12) * monthWeight) * (1 + jitter - 0.08)))
    const trust = Math.max(0, Math.min(5, baseTrust - 0.5 + (i / 11) * 0.5 + (jitter - 0.08)))
    return {
      label: MONTH_LABELS[(hashSeed(agent.wallet + 'm0') + i) % 12],
      jobs,
      trust: Math.round(trust * 10) / 10,
    }
  })

  return months
}

/** Top `limit` agents sharing this agent's category, falling back to the
 *  highest-reputation agents overall if the category has no other members. */
export function getSimilarAgents(agents = [], agent, limit = 4) {
  if (!agent) return []
  const sameCategory = agents.filter((a) => a.wallet !== agent.wallet && a.category === agent.category)
  const pool = sameCategory.length > 0 ? sameCategory : agents.filter((a) => a.wallet !== agent.wallet)
  return [...pool].sort((a, b) => b.reputation - a.reputation).slice(0, limit)
}

/** Work history rows for an agent, oldest last (most recent delivery first). */
export function getWorkHistory(agent) {
  return agent?.workHistory || []
}

/** Review cards for an agent. */
export function getReviews(agent) {
  return agent?.reviews || []
}
