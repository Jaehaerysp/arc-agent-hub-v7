import { Panel, Grid, GlassCard, Badge, EmptyState } from '../../../ui/design-system'
import { formatTime, formatDate } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

const RISK_VARIANT = { Low: 'success', Medium: 'warning', Elevated: 'error' }

/**
 * Security Insights — four health cards (Identity, Validation,
 * Contracts, Wallet) from `computeSecurityInsights`, plus recent
 * network-switch events and an overall risk level derived from the same
 * booleans. Nothing here is a live security scan; it's a plain-language
 * summary of state already visible elsewhere on this page.
 */
export function SecurityInsightsPanel({ insights, recentEvents, riskLevel }) {
  return (
    <Panel
      title="Security Insights"
      subtitle="Identity, validation, contract, and wallet health"
      className="tv7-security-panel"
      actions={<Badge variant={RISK_VARIANT[riskLevel] || 'muted'} size="sm">{riskLevel} risk</Badge>}
    >
      <Grid columns={2} minColWidth="220px" gap="md">
        {insights.map((insight) => (
          <GlassCard key={insight.key} className="tv7-insight-card" padding="md">
            <div className="tv7-insight-head">
              <span className="tv7-insight-label">{insight.label}</span>
              <Badge variant={insight.status === 'healthy' ? 'success' : 'warning'} size="sm" dot={false}>
                {insight.status === 'healthy' ? 'Healthy' : 'Attention'}
              </Badge>
            </div>
            <p className="tv7-insight-detail">{insight.detail}</p>
          </GlassCard>
        ))}
      </Grid>

      <div className="tv7-security-events">
        <div className="tv7-analytics-block-title">Recent Security Events</div>
        {recentEvents.length === 0 ? (
          <EmptyState size="sm" icon={<IconActivity width={18} height={18} />} title="No security events" description="Network switches will be logged here." />
        ) : (
          <ul className="tv7-security-event-list">
            {recentEvents.map((e) => (
              <li key={e.id}>
                <span>{e.detail || e.label}</span>
                <time>{formatDate(e.timestamp)} · {formatTime(e.timestamp)}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  )
}
