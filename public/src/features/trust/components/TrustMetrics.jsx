import { Grid, MetricCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { IconShield, IconCheck, IconStar, IconActivity, IconZap, IconLayers } from '../../../ui/icons'

/**
 * Trust Metrics — six premium tiles: Trust Score, Validation Success,
 * Verified Jobs, Completed Validations, Average Rating, Current
 * Reputation. Only Trust Score carries the gradient `accent` treatment
 * (the Hero above already used the gradient once, so exactly one tile
 * repeats it here, per the Blueprint's "gradient in at most three
 * places" rule — Hero + this tile = two).
 */
export function TrustMetrics({ score, tier, reputationStats, validationStats, successRing, jobCount, loading }) {
  const skeleton = <Skeleton width={48} height={28} />

  return (
    <Grid columns={3} minColWidth="200px" gap="md" aria-label="Trust overview">
      <MetricCard
        icon={<IconShield width={16} height={16} />}
        label="Trust Score"
        accent
        value={loading ? skeleton : score === null ? '—' : <AnimatedCounter value={score} duration={1200} />}
        sub={tier}
      />

      <MetricCard
        icon={<IconCheck width={16} height={16} />}
        label="Validation Success"
        value={loading ? skeleton : successRing === null ? '—' : <AnimatedCounter value={successRing} suffix="%" duration={1000} />}
        sub={`${validationStats.requested} requested · ${validationStats.failed} failed`}
      />

      <MetricCard
        icon={<IconLayers width={16} height={16} />}
        label="Verified Jobs"
        value={loading ? skeleton : <AnimatedCounter value={jobCount} duration={900} />}
        sub="Jobs recorded in this wallet's activity"
      />

      <MetricCard
        icon={<IconZap width={16} height={16} />}
        label="Completed Validations"
        value={loading ? skeleton : <AnimatedCounter value={validationStats.requested} duration={1000} />}
        sub="Validation requests confirmed on-chain"
      />

      <MetricCard
        icon={<IconStar width={16} height={16} />}
        label="Average Rating"
        value={loading ? skeleton : reputationStats.averageScore === null ? '—' : <AnimatedCounter value={reputationStats.averageScore} decimals={1} suffix="/10" duration={1100} />}
        sub={`Across ${reputationStats.successful} feedback submission${reputationStats.successful === 1 ? '' : 's'}`}
      />

      <MetricCard
        icon={<IconActivity width={16} height={16} />}
        label="Current Reputation"
        value={loading ? skeleton : tier}
        sub={score === null ? 'Register an agent to begin' : `${score}/100 composite score`}
      />
    </Grid>
  )
}
