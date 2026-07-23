import { Grid, MetricCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { formatTokenAmount } from '../../../lib/format'
import { IconAgent, IconJob, IconCheck, IconStar, IconShield, IconWallet } from '../../../ui/icons'

/**
 * The six premium metric tiles — Active Agents, Running Jobs, Completed
 * Jobs, Trust Score, Validation Rate, ANV Balance. Only the single most
 * abnormal-this-session metric (or Trust, by default) carries the
 * gradient-text `accent` treatment, per the Blueprint's "one hero element"
 * and "gradient in at most three places" rules — the hero card above
 * already used the gradient once, so exactly one metric tile uses it here.
 */
export function MissionMetrics({ agentCount, jobsRunning, jobsCompleted, trust, validation, anvBalance, loading }) {
  const skeleton = <Skeleton width={48} height={28} />

  return (
    <Grid columns={3} minColWidth="200px" gap="md" as="div" className="dv7-metrics" aria-label="Mission metrics">
      <MetricCard
        icon={<IconAgent width={16} height={16} />}
        label="Active Agents"
        value={<AnimatedCounter value={agentCount} duration={900} />}
        sub={agentCount > 0 ? 'Registered · ERC-8004' : 'None registered yet'}
      />

      <MetricCard
        icon={<IconJob width={16} height={16} />}
        label="Running Jobs"
        value={loading ? skeleton : <AnimatedCounter value={jobsRunning} duration={1000} />}
        sub="Funded + submitted"
      />

      <MetricCard
        icon={<IconCheck width={16} height={16} />}
        label="Completed Jobs"
        value={loading ? skeleton : <AnimatedCounter value={jobsCompleted} duration={1100} />}
        sub="Fully settled on-chain"
      />

      <MetricCard
        icon={<IconStar width={16} height={16} />}
        label="Trust Score"
        accent
        value={loading ? skeleton : trust.rate === null ? '—' : <AnimatedCounter value={trust.rate} suffix="%" duration={1200} />}
        sub={trust.rate === null ? 'No completed jobs yet' : `${trust.completed} completed · ${trust.rejected} rejected`}
      />

      <MetricCard
        icon={<IconShield width={16} height={16} />}
        label="Validation Rate"
        value={loading ? skeleton : validation.rate === null ? '—' : <AnimatedCounter value={validation.rate} suffix="%" duration={1200} />}
        sub={validation.rate === null ? 'No hires settled yet' : `${validation.completed} approved · ${validation.rejected} rejected`}
      />

      <MetricCard
        icon={<IconWallet width={16} height={16} />}
        label="ANV Balance"
        value={loading && anvBalance === null ? skeleton : formatTokenAmount(anvBalance, 2)}
        sub="Arc Testnet"
      />
    </Grid>
  )
}
