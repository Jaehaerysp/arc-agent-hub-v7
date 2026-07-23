import { useNavigate } from 'react-router-dom'
import { Panel, Grid, Badge, Button, EmptyState } from '../../../ui/design-system'
import { AgentIdentityMark } from './AgentIdentityMark'
import { shortAddr } from '../../../lib/format'
import { IconAgent } from '../../../ui/icons'

const STATUS_BADGE = {
  registered: { variant: 'accent', label: 'Registered' },
  available: { variant: 'success', label: 'Available' },
  at_capacity: { variant: 'warning', label: 'At capacity' },
  engaged: { variant: 'muted', label: 'Engaged' },
}

function WorkforceCard({ entry }) {
  const navigate = useNavigate()
  const badge = STATUS_BADGE[entry.status] || STATUS_BADGE.engaged
  const target = entry.isOwn ? '/agents' : `/agents/${entry.wallet}`

  return (
    <Panel className="dv7-workforce-card">
      <div className="dv7-workforce-top">
        <AgentIdentityMark seed={entry.wallet} size={40} />
        <div className="dv7-workforce-identity">
          <div className="dv7-workforce-name">{entry.name}</div>
          <div className="dv7-workforce-role">{entry.role}</div>
        </div>
        <Badge variant={badge.variant} size="sm">
          {badge.label}
        </Badge>
      </div>

      <div className="dv7-workforce-stats">
        <div className="dv7-workforce-stat">
          <span className="dv7-workforce-stat-value">{entry.runningJobs}</span>
          <span className="dv7-workforce-stat-label">Running</span>
        </div>
        <div className="dv7-workforce-stat">
          <span className="dv7-workforce-stat-value">{entry.trust === null || entry.trust === undefined ? '—' : `${entry.trust}%`}</span>
          <span className="dv7-workforce-stat-label">Trust</span>
        </div>
      </div>

      <div className="dv7-workforce-foot">
        <span className="dv7-workforce-wallet mono">{shortAddr(entry.wallet)}</span>
        <Button variant="secondary" size="sm" onClick={() => navigate(target)}>
          {entry.isOwn ? 'Manage' : 'View'}
        </Button>
      </div>
    </Panel>
  )
}

/**
 * "AI Workforce" — this account's own registered agent plus every provider
 * it has hired, in one responsive grid. Backed by `computeWorkforce()`
 * (dashboardLogic.js): real job-relationship data, enriched with the
 * Marketplace catalog when a hired wallet matches a known agent, never
 * fabricated.
 */
export function AiWorkforcePanel({ workforce }) {
  return (
    <Panel
      title="AI Workforce"
      subtitle="Your registered agent and every provider you've hired"
      className="dv7-workforce-panel"
    >
      {workforce.length === 0 ? (
        <EmptyState
          icon={<IconAgent width={20} height={20} />}
          title="No agents in your workforce yet"
          description="Register an on-chain agent identity or hire one from the Marketplace to see it here."
        />
      ) : (
        <Grid minColWidth="260px" gap="md" aria-label="AI workforce roster">
          {workforce.map((entry) => (
            <WorkforceCard key={entry.key} entry={entry} />
          ))}
        </Grid>
      )}
    </Panel>
  )
}
