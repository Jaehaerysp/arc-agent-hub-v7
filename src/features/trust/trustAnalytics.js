/**
 * Trust Center (Mission 7) — pure, dependency-free selectors derived
 * entirely from data the app already has: `wallet.activity` (the same
 * locally-persisted feed Jobs v7 and Dashboard v7 already build on) and
 * `wallet.agentId`. Nothing here performs a new RPC call.
 *
 * Known limitation (same shape as `features/agents/data/agents.js`'s
 * documented stand-in): the Reputation and Validation Registry ABIs
 * (`src/contracts/abis/reputation.js`, `.../validation.js`) only expose
 * `giveFeedback()` and `validationRequest()` — there is no `getFeedback`,
 * `getReputationScore`, or `getValidationStatus` getter to read back from
 * chain. So "Trust Score", tiers, and every chart below are computed from
 * this browser's own activity log of feedback given and validations
 * requested, not from an on-chain read of a global reputation state. This
 * mirrors exactly how Jobs v7's `computeAverageCompletionTime` is scoped
 * to "this browser's activity log" rather than a fabricated global
 * figure — no number here is invented, but every number is local-scope.
 */

const FEEDBACK_TYPE_LABELS = { 1: 'Peer', 2: 'Validator', 3: 'Community' }

/** Every feedback/validation activity entry, most recent first (activity is already prepended-desc by useWallet's addActivity). */
export function computeTrustEvents(activity) {
  return activity.filter((a) => a.type === 'feedback' || a.type === 'validation')
}

/** Reputation (giveFeedback) events only. */
export function computeReputationEvents(activity) {
  return activity.filter((a) => a.type === 'feedback')
}

/** Validation (validationRequest) events only. */
export function computeValidationEvents(activity) {
  return activity.filter((a) => a.type === 'validation')
}

/**
 * Reputation summary: count of successful `giveFeedback` calls logged
 * locally, and the average score across them (score is only present on
 * successful entries — see FeedbackFormPanel's activityMeta).
 */
export function computeReputationStats(activity) {
  const events = computeReputationEvents(activity)
  const successful = events.filter((e) => e.status === 'success')
  const scored = successful.filter((e) => typeof e.score === 'number')
  const averageScore = scored.length ? scored.reduce((sum, e) => sum + e.score, 0) / scored.length : null

  return {
    total: events.length,
    successful: successful.length,
    failed: events.filter((e) => e.status === 'error').length,
    averageScore,
  }
}

/**
 * Validation summary. A "success" activity entry means the
 * `validationRequest` transaction confirmed on-chain — i.e. the request
 * was submitted, not that a validator has approved it (there is no
 * getter to read validator approval back). Labeled as "Requested" below
 * rather than "Validated" to keep that distinction honest.
 */
export function computeValidationStats(activity) {
  const events = computeValidationEvents(activity)
  const requested = events.filter((e) => e.status === 'success')
  const failed = events.filter((e) => e.status === 'error')

  return {
    total: events.length,
    requested: requested.length,
    failed: failed.length,
  }
}

const TIERS = [
  { min: 90, label: 'Elite' },
  { min: 75, label: 'Trusted' },
  { min: 60, label: 'Verified' },
  { min: 1, label: 'Building' },
  { min: 0, label: 'New' },
]

/**
 * Composite 0–100 score from the same local activity this page already
 * shows elsewhere: a base of 50 once an agent is registered, shifted by
 * average feedback score (scaled 1–10 -> -25..+25) and a flat bonus per
 * successful validation request (capped). Deterministic and explained
 * inline, not a black box — every input is visible on this same page.
 */
export function computeTrustScore(agentId, reputationStats, validationStats) {
  if (!agentId) return { score: null, tier: 'Unregistered' }

  let score = 50
  if (reputationStats.averageScore !== null) {
    score += (reputationStats.averageScore - 5.5) * (25 / 4.5)
  }
  score += Math.min(validationStats.requested, 5) * 4
  score = Math.max(0, Math.min(100, Math.round(score)))

  const tier = TIERS.find((t) => score >= t.min)?.label || 'New'
  return { score, tier }
}

/** Buckets feedback+validation activity by calendar month for the last `months` months (default 6). Mirrors jobsAnalytics.computeMonthlyActivity. */
export function computeMonthlyTrustActivity(activity, months = 6) {
  const now = new Date()
  const buckets = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString([], { month: 'short' }),
      value: 0,
    })
  }

  const indexByKey = new Map(buckets.map((b, i) => [b.key, i]))

  computeTrustEvents(activity).forEach((a) => {
    const d = new Date(a.timestamp)
    if (Number.isNaN(d.getTime())) return
    const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}`)
    if (idx !== undefined) buckets[idx].value += 1
  })

  return buckets
}

/** Same monthly buckets, but for job activity — powers the "Jobs vs Trust" comparison chart with no new data source. */
export function computeMonthlyJobActivity(activity, months = 6) {
  const now = new Date()
  const buckets = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString([], { month: 'short' }), value: 0 })
  }

  const indexByKey = new Map(buckets.map((b, i) => [b.key, i]))

  activity
    .filter((a) => a.type === 'job')
    .forEach((a) => {
      const d = new Date(a.timestamp)
      if (Number.isNaN(d.getTime())) return
      const idx = indexByKey.get(`${d.getFullYear()}-${d.getMonth()}`)
      if (idx !== undefined) buckets[idx].value += 1
    })

  return buckets
}

/** Validation success ring: requested vs failed, as a percent of attempts (null when there's no attempt yet). */
export function computeValidationSuccessRing(validationStats) {
  const attempts = validationStats.requested + validationStats.failed
  return attempts === 0 ? null : Math.round((validationStats.requested / attempts) * 100)
}

/**
 * Feedback-type distribution (Peer / Validator / Community), from the
 * `feedbackType` field FeedbackFormPanel now logs alongside each
 * activity entry (an additive metadata field only — the on-chain
 * `giveFeedback()` call args are unchanged).
 */
export function computeNetworkDistribution(activity) {
  const events = computeReputationEvents(activity).filter((e) => e.status === 'success')
  return Object.entries(FEEDBACK_TYPE_LABELS).map(([key, label]) => ({
    key,
    label,
    value: events.filter((e) => e.feedbackType === label).length,
  }))
}

/**
 * Milestone timeline — real events only, no synthetic filler. "Agent
 * Registered" appears once if an agentId is set locally; every other
 * entry is a real activity item (job creation, feedback given,
 * validation requested), re-labeled for the trust narrative.
 */
export function computeReputationTimeline(activity, agentId) {
  const milestones = []

  if (agentId) {
    milestones.push({
      id: 'agent-registered',
      label: 'Agent Registered',
      detail: `Agent #${agentId} linked to this wallet`,
      timestamp: null,
      status: 'success',
    })
  }

  const firstJob = [...activity].reverse().find((a) => a.type === 'job' && /created/i.test(a.label || ''))
  if (firstJob) {
    milestones.push({ id: 'first-job', label: 'First Job', detail: firstJob.label, timestamp: firstJob.timestamp, status: firstJob.status, txHash: firstJob.txHash })
  }

  computeTrustEvents(activity).forEach((a) => {
    if (a.type === 'validation' && a.status === 'success') {
      milestones.push({ id: `val-${a.id}`, label: 'Validation Requested', detail: a.detail, timestamp: a.timestamp, status: a.status, txHash: a.txHash })
    }
    if (a.type === 'feedback' && a.status === 'success') {
      const high = typeof a.score === 'number' && a.score >= 7
      milestones.push({
        id: `fb-${a.id}`,
        label: high ? 'Reputation Increased' : 'Feedback Submitted',
        detail: a.detail || (typeof a.score === 'number' ? `Score ${a.score}/10` : undefined),
        timestamp: a.timestamp,
        status: a.status,
        txHash: a.txHash,
      })
    }
  })

  return milestones
    .filter((m) => m.id === 'agent-registered' || m.timestamp)
    .sort((a, b) => {
      if (!a.timestamp) return -1
      if (!b.timestamp) return 1
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
}

/**
 * Achievement badges — every unlock condition is a real, visible number
 * elsewhere on this page (agentId, reputationStats, validationStats,
 * tier), not a hidden or fabricated threshold.
 */
export function computeBadges(agentId, reputationStats, validationStats, tier) {
  return [
    { key: 'verified', label: 'Verified', desc: 'Agent identity registered', unlocked: Boolean(agentId) },
    { key: 'trusted', label: 'Trusted', desc: 'At least one validation requested', unlocked: validationStats.requested >= 1 },
    { key: 'elite', label: 'Elite', desc: 'Reached Elite trust tier', unlocked: tier === 'Elite' },
    { key: 'contributor', label: 'Contributor', desc: 'Submitted feedback at least once', unlocked: reputationStats.successful >= 1 },
    { key: 'builder', label: 'Builder', desc: 'Submitted feedback 5+ times', unlocked: reputationStats.successful >= 5 },
    { key: 'top-provider', label: 'Top Provider', desc: 'Requested validation 3+ times', unlocked: validationStats.requested >= 3 },
  ]
}

/**
 * Certificates — each maps to a concrete, checkable local condition.
 * "ERC-8004 Identity" and "Registration" both key off `agentId` (two
 * facets of the same on-chain registration, per the Mission 7 brief's
 * separate line items); "Trust Passport" requires all three of
 * identity + a validation request + feedback given.
 */
export function computeCertificates(agentId, reputationStats, validationStats, hasSigner) {
  const hasFeedback = reputationStats.successful >= 1
  const hasValidation = validationStats.requested >= 1

  return [
    { key: 'erc8004', label: 'ERC-8004 Identity', desc: 'Identity Registry registration', unlocked: Boolean(agentId) },
    { key: 'registration', label: 'Registration', desc: 'Agent ID linked to this wallet', unlocked: Boolean(agentId) },
    { key: 'identity', label: 'Identity', desc: 'Wallet connected to Arc Testnet', unlocked: hasSigner },
    { key: 'validation', label: 'Validation Certificate', desc: 'Validation request confirmed on-chain', unlocked: hasValidation },
    { key: 'verification', label: 'Verification', desc: 'Feedback submitted on-chain', unlocked: hasFeedback },
    { key: 'passport', label: 'Trust Passport', desc: 'Identity + validation + feedback, all three', unlocked: Boolean(agentId) && hasValidation && hasFeedback },
  ]
}

/**
 * Security insight health cards. Each check is a boolean already visible
 * elsewhere on the page (agentId, validation attempts, wallet
 * connection) — "Contracts" is informational, confirming the registry
 * addresses this page reads from (see `src/contracts/registry.js`), not
 * a live health probe.
 */
export function computeSecurityInsights(agentId, validationStats, hasSigner) {
  return [
    { key: 'identity', label: 'Identity', status: agentId ? 'healthy' : 'attention', detail: agentId ? `Agent #${agentId} registered` : 'No agent registered to this wallet yet' },
    { key: 'validation', label: 'Validation', status: validationStats.requested > 0 ? 'healthy' : 'attention', detail: validationStats.requested > 0 ? `${validationStats.requested} validation request${validationStats.requested === 1 ? '' : 's'} confirmed` : 'No validation requested yet' },
    { key: 'contracts', label: 'Contracts', status: 'healthy', detail: 'Identity, Reputation & Validation registries configured' },
    { key: 'wallet', label: 'Wallet', status: hasSigner ? 'healthy' : 'attention', detail: hasSigner ? 'Connected to Arc Testnet' : 'Wallet not connected' },
  ]
}

/** Recent security-relevant events — network switches logged by useWallet, most recent first. */
export function computeRecentSecurityEvents(activity, limit = 5) {
  return activity.filter((a) => a.type === 'network').slice(0, limit)
}

/** Overall risk level from the same booleans as computeSecurityInsights — never a fabricated score. */
export function computeRiskLevel(insights) {
  const attentionCount = insights.filter((i) => i.status === 'attention').length
  if (attentionCount === 0) return 'Low'
  if (attentionCount === 1) return 'Medium'
  return 'Elevated'
}

/** The single sentence under the Trust Hero title. */
export function computeTrustSummary(agentId, score, reputationStats, validationStats) {
  if (!agentId) return 'Register an agent to start building trust.'
  if (score === null) return `Agent #${agentId} is registered — no trust activity yet.`
  return `Agent #${agentId} · ${reputationStats.successful} feedback submitted · ${validationStats.requested} validation${validationStats.requested === 1 ? '' : 's'} requested.`
}
