import { MetricCard, Grid } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { IconAgent, IconShield, IconCheck, IconZap } from '../../../ui/icons'
import { computeMarketplaceStats } from '../marketplaceLogic'

/**
 * Derives marketplace-wide numbers from the agent catalog. Pure — no
 * fetching. Kept exactly as-is (name, shape, and behavior) because
 * AgentStats.test.js asserts against it directly; the richer Marketplace
 * v7 stats strip below is computed separately in ../marketplaceLogic.js.
 */
export function computeAgentStats(agents) {
  const total = agents.length
  const categories = new Set(agents.map((a) => a.category)).size
  const avgReputation = total ? agents.reduce((sum, a) => sum + a.reputation, 0) / total : 0
  const totalCompletedJobs = agents.reduce((sum, a) => sum + a.completedJobs, 0)

  return { total, categories, avgReputation, totalCompletedJobs }
}

/** Premium animated metric strip for the Marketplace — "Marketplace Statistics" section. */
export function AgentStats({ agents }) {
  const stats = computeMarketplaceStats(agents)
  const categories = computeAgentStats(agents).categories

  return (
    <Grid minColWidth="200px" gap="md" className="mv7-stats-grid" aria-label="Marketplace statistics">
      <MetricCard
        icon={<IconAgent width={16} height={16} />}
        label="Registered Agents"
        value={<AnimatedCounter value={stats.total} />}
        sub={`${categories} categories covered`}
      />
      <MetricCard
        icon={<IconShield width={16} height={16} />}
        label="Verified Agents"
        value={<AnimatedCounter value={stats.verified} />}
        sub="On the ERC-8004 Identity Registry"
      />
      <MetricCard
        icon={<IconCheck width={16} height={16} />}
        label="Jobs Completed"
        value={<AnimatedCounter value={stats.totalCompletedJobs} />}
        sub="Across all listed agents"
      />
      <MetricCard
        icon={<IconZap width={16} height={16} />}
        label="Average Trust"
        value={<AnimatedCounter value={stats.avgReputation} decimals={1} />}
        accent
        sub="Out of 5.0"
      />
    </Grid>
  )
}
