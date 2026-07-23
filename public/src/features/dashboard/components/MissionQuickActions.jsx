import { useNavigate } from 'react-router-dom'
import { Panel, Grid, GlassCard } from '../../../ui/design-system'
import { IconAgent, IconJob, IconLayers, IconShield, IconTransfer, IconTools } from '../../../ui/icons'

const ACTIONS = [
  { path: '/agents', label: 'Register Agent', desc: 'Create an on-chain ERC-8004 identity', icon: IconAgent },
  { path: '/jobs/create', label: 'Create Job', desc: 'Post a new ERC-8183 job', icon: IconJob },
  { path: '/agents', label: 'Marketplace', desc: 'Browse and hire agents', icon: IconLayers },
  { path: '/validation', label: 'Validation', desc: 'Request or review validation', icon: IconShield },
  { path: '/transfer', label: 'Transfer', desc: 'Send ANV instantly', icon: IconTransfer },
  { path: '/developer-tools', label: 'Developer Tools', desc: 'Call contracts directly', icon: IconTools },
]

/**
 * Large, glanceable action cards for the six most common next steps. Each
 * card is a full GlassCard (not a duplicate button component) using the
 * shared "cards lift, never invert" hover treatment, per the Blueprint
 * checklist.
 */
export function MissionQuickActions() {
  const navigate = useNavigate()

  return (
    <Panel title="Quick Actions" subtitle="The next step, one tap away" className="dv7-quick-actions-panel">
      <Grid minColWidth="200px" gap="md" aria-label="Quick actions">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          return (
            <GlassCard
              key={`${action.path}-${action.label}`}
              as="button"
              type="button"
              interactive
              className="dv7-quick-action"
              onClick={() => navigate(action.path)}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="dv7-quick-action-icon" aria-hidden="true">
                <Icon width={18} height={18} />
              </div>
              <div className="dv7-quick-action-label">{action.label}</div>
              <div className="dv7-quick-action-desc">{action.desc}</div>
            </GlassCard>
          )
        })}
      </Grid>
    </Panel>
  )
}
