import { isExpired } from '../../lib/format'

// Severity ranking used to roll the six Mission Status cells up into one
// overall reading. 'neutral' never escalates the overall status on its own —
// it just means "informational, no judgment" (e.g. an escrow balance).
const SEVERITY_RANK = { healthy: 0, neutral: 0, warning: 1, attention: 2 }

const OVERALL_COPY = {
  healthy: { label: 'All systems nominal', tone: 'healthy' },
  warning: { label: 'Needs attention', tone: 'warning' },
  attention: { label: 'Action required', tone: 'attention' },
}

/** Good morning / afternoon / evening, based on the viewer's local clock. */
export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning.'
  if (hour < 18) return 'Good afternoon.'
  return 'Good evening.'
}

/**
 * Splits every job the connected account is party to into the two roles it
 * can hold — client (hired someone) and provider (is the agent doing the
 * work) — since Mission Status and the attention list need to reason about
 * each role differently.
 */
export function splitJobsByRole(jobs, account) {
  const acct = (account || '').toLowerCase()
  const asClient = jobs.filter((j) => j.client?.toLowerCase() === acct)
  const asProvider = jobs.filter((j) => j.provider?.toLowerCase() === acct)
  return { asClient, asProvider }
}

/**
 * Trust is deliberately NOT a fabricated live read from the Reputation
 * Registry (this dashboard never invents on-chain data it hasn't fetched).
 * Instead it's an honest, derived signal from the jobs this account has
 * already delivered as a provider: of the jobs that reached a final
 * outcome, what share were Completed rather than Rejected.
 */
export function computeTrust(asProviderJobs) {
  const completed = asProviderJobs.filter((j) => j.status === 3).length
  const rejected = asProviderJobs.filter((j) => j.status === 4).length
  const settled = completed + rejected
  const rate = settled ? Math.round((completed / settled) * 100) : null
  return { rate, completed, rejected, settled }
}

/** True if a job is stuck past its expiry and nobody has resolved it yet. */
function isUnresolvedExpired(job) {
  return isExpired(job.expiredAt) && job.status !== 3
}

/**
 * The six Mission Status instrument cells: Agent Health, Jobs Running,
 * Trust, Escrow, Network, System. Each gets a status ('healthy' | 'warning'
 * | 'attention' | 'neutral') so the strip communicates health at a glance
 * without a single pie chart, gauge, or generic KPI card.
 */
export function computeMissionCells({ wallet, jobs, jobsError, jobStats }) {
  const { asProvider } = splitJobsByRole(jobs, wallet.account)
  const trust = computeTrust(asProvider)
  const expiredUnresolved = jobs.filter(isUnresolvedExpired).length
  const runningCount = jobStats.funded + jobStats.submitted

  return [
    {
      key: 'agentHealth',
      label: 'Agent Health',
      icon: 'agent',
      status: wallet.agentId ? 'healthy' : 'warning',
      value: wallet.agentId ? `Agent #${wallet.agentId}` : 'Not registered',
      sub: wallet.agentId ? 'Registered · ERC-8004' : 'Register to get started',
    },
    {
      key: 'jobsRunning',
      label: 'Jobs Running',
      icon: 'job',
      status: expiredUnresolved > 0 ? 'attention' : runningCount > 0 ? 'healthy' : 'neutral',
      value: runningCount,
      sub: expiredUnresolved > 0 ? `${expiredUnresolved} expired, unresolved` : runningCount > 0 ? 'In progress' : 'Nothing running',
    },
    {
      key: 'trust',
      label: 'Trust',
      icon: 'star',
      status: trust.rate === null ? 'neutral' : trust.rate >= 90 ? 'healthy' : trust.rate >= 70 ? 'warning' : 'attention',
      value: trust.rate === null ? '—' : `${trust.rate}%`,
      sub: trust.rate === null ? 'No completed jobs yet' : `${trust.completed} completed · ${trust.rejected} rejected`,
      percent: trust.rate,
    },
    {
      key: 'escrow',
      label: 'Escrow',
      icon: 'wallet',
      status: 'neutral',
      value: `${jobStats.totalEscrow.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC`,
      sub: 'Funded + submitted jobs',
    },
    {
      key: 'network',
      label: 'Network',
      icon: 'layers',
      status: wallet.isArcNetwork ? 'healthy' : 'attention',
      value: wallet.isArcNetwork ? 'Arc Testnet' : 'Wrong network',
      sub: wallet.isArcNetwork ? 'Connected & verified' : 'Switch to continue',
    },
    {
      key: 'system',
      label: 'System',
      icon: 'activity',
      status: jobsError ? 'warning' : 'healthy',
      value: jobsError ? 'Degraded' : 'Operational',
      sub: jobsError ? 'Jobs feed retrying…' : 'All feeds live',
    },
  ]
}

/** Rolls the six cells up into one headline reading for the hero + strip header. */
export function computeOverallStatus(cells) {
  const rank = cells.reduce((max, c) => Math.max(max, SEVERITY_RANK[c.status] ?? 0), 0)
  const tone = rank === 2 ? 'attention' : rank === 1 ? 'warning' : 'healthy'
  return OVERALL_COPY[tone]
}

/**
 * "Needs your attention" — concrete action items, never a generic activity
 * feed. Ordered most-severe first, capped so the section stays scannable.
 */
export function computeAttentionItems({ wallet, jobs, jobsError }, maxItems = 5) {
  const items = []
  const { asClient } = splitJobsByRole(jobs, wallet.account)

  if (!wallet.isArcNetwork) {
    items.push({
      id: 'network',
      tone: 'attention',
      title: 'Wrong network connected',
      description: 'Switch to Arc Testnet to register, fund, or transfer.',
      cta: { label: 'Switch network', action: 'switchNetwork' },
    })
  }

  if (!wallet.agentId) {
    items.push({
      id: 'register',
      tone: 'warning',
      title: 'Register your agent',
      description: 'Create an on-chain identity before taking on jobs.',
      cta: { label: 'Register agent', to: '/agents' },
    })
  }

  jobs
    .filter(isUnresolvedExpired)
    .forEach((job) => {
      items.push({
        id: `expired-${job.id}`,
        tone: 'attention',
        title: `Job #${job.id} expired`,
        description: 'This job passed its expiry without being resolved.',
        cta: { label: 'Review job', to: `/jobs/${job.id}` },
      })
    })

  asClient
    .filter((job) => job.status === 2)
    .forEach((job) => {
      items.push({
        id: `validate-${job.id}`,
        tone: 'warning',
        title: `Job #${job.id} delivered`,
        description: 'Validate the work to release escrow to the agent.',
        cta: { label: 'Validate now', to: `/jobs/${job.id}` },
      })
    })

  if (jobsError) {
    items.push({
      id: 'jobs-error',
      tone: 'attention',
      title: "Couldn't load jobs",
      description: jobsError,
      cta: { label: 'Retry', action: 'refreshJobs' },
    })
  }

  return items.sort((a, b) => SEVERITY_RANK[b.tone] - SEVERITY_RANK[a.tone]).slice(0, maxItems)
}

/** The single sentence under the greeting — the "why you're here today" line. */
export function computeMissionSummary({ jobStats, attentionItems }) {
  const running = jobStats.funded + jobStats.submitted
  const jobsClause = running === 0 ? 'No jobs in progress' : `${running} job${running === 1 ? '' : 's'} in progress`

  if (attentionItems.length === 0) {
    return `${jobsClause}. Nothing needs you right now.`
  }
  return `${jobsClause}, ${attentionItems.length} need${attentionItems.length === 1 ? 's' : ''} your attention.`
}

/* ------------------------------------------------------------------ */
/* Mission 3 additions — Dashboard v7 "AI Mission Control" redesign.  */
/* Everything below is purely additive: new selectors derived from    */
/* data the page already fetches (wallet, jobs, activity). Nothing    */
/* above this line was changed, and no new on-chain reads are added.  */
/* ------------------------------------------------------------------ */

const ACTIVITY_TYPE_LABELS = {
  agent: 'Agent',
  job: 'Jobs',
  validation: 'Validation',
  transfer: 'Transfer',
  network: 'Network',
  other: 'Other',
}

/**
 * "Validation" is the client-side mirror of Trust: of the jobs this account
 * hired a provider for that reached a final outcome, what share were
 * approved (Completed) rather than Rejected. Trust answers "how good is my
 * agent's delivered work"; Validation answers "how good are the deliveries
 * I've approved as a client" — two honest, distinct, already-available
 * signals, never a fabricated on-chain read.
 */
export function computeValidationRate(asClientJobs) {
  const completed = asClientJobs.filter((j) => j.status === 3).length
  const rejected = asClientJobs.filter((j) => j.status === 4).length
  const settled = completed + rejected
  const rate = settled ? Math.round((completed / settled) * 100) : null
  return { rate, completed, rejected, settled }
}

/**
 * Buckets the wallet's local activity feed by entry `type` — the input for
 * the Analytics "Activity" chart. Ordered by count, descending, so the most
 * common activity type reads first.
 */
export function computeActivityBreakdown(activity) {
  const counts = new Map()
  activity.forEach((item) => {
    const key = item.type || 'other'
    counts.set(key, (counts.get(key) || 0) + 1)
  })
  return [...counts.entries()]
    .map(([type, count]) => ({ type, label: ACTIVITY_TYPE_LABELS[type] || type, count }))
    .sort((a, b) => b.count - a.count)
}

/** The four job-status counts, in pipeline order, for the Analytics "Jobs" chart. */
export function computeJobsBreakdown(jobStats) {
  return [
    { key: 'open', label: 'Open', value: jobStats.open },
    { key: 'funded', label: 'Funded', value: jobStats.funded },
    { key: 'submitted', label: 'Submitted', value: jobStats.submitted },
    { key: 'completed', label: 'Completed', value: jobStats.completed },
  ]
}

/** Local, dependency-free short-address formatter (avoids importing lib/format into this pure-logic module for one helper). */
function shortAddrLocal(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

/**
 * The "AI Workforce" roster: this account's own registered agent (if any),
 * plus every provider it has hired as a client, deduplicated by wallet.
 * Enriches a hired provider with its Marketplace catalog entry when the
 * wallet matches a known agent — never invents a name/category otherwise,
 * it just falls back to a short address.
 */
export function computeWorkforce({ wallet, jobs, getAgentByWallet, maxItems = 6 }) {
  const { asProvider, asClient } = splitJobsByRole(jobs, wallet.account)
  const entries = []

  if (wallet.agentId) {
    const runningJobs = asProvider.filter((j) => j.status === 1 || j.status === 2).length
    const trust = computeTrust(asProvider)
    entries.push({
      key: 'own',
      wallet: wallet.account,
      name: `Agent #${wallet.agentId}`,
      role: 'Your agent',
      isOwn: true,
      status: 'registered',
      runningJobs,
      trust: trust.rate,
    })
  }

  const seen = new Set()
  asClient.forEach((job) => {
    const addr = (job.provider || '').toLowerCase()
    if (!addr || seen.has(addr)) return
    seen.add(addr)

    const catalogAgent = getAgentByWallet?.(job.provider) || null
    const providerJobs = asClient.filter((j) => (j.provider || '').toLowerCase() === addr)
    const runningJobs = providerJobs.filter((j) => j.status === 1 || j.status === 2).length

    entries.push({
      key: addr,
      wallet: job.provider,
      name: catalogAgent?.name || `Agent ${shortAddrLocal(job.provider)}`,
      role: catalogAgent?.category || 'Hired provider',
      isOwn: false,
      status: catalogAgent?.availability || 'engaged',
      runningJobs,
      trust: catalogAgent ? catalogAgent.successRate : null,
    })
  })

  return entries
    .sort((a, b) => (b.isOwn - a.isOwn) || b.runningJobs - a.runningJobs)
    .slice(0, maxItems)
}
