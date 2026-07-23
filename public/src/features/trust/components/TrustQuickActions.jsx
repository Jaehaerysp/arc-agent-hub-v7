import { useNavigate } from 'react-router-dom'
import { Panel, Grid, GlassCard } from '../../../ui/design-system'
import { IconShield, IconLayers, IconDashboard, IconJob, IconTools } from '../../../ui/icons'

const ACTIONS = [
  { key: 'validate', label: 'Validate Identity', desc: 'Jump to the validation request form', icon: IconShield, action: 'scroll:tv7-validation-form' },
  { key: 'marketplace', label: 'View Marketplace', desc: 'Explore every listed agent', icon: IconLayers, path: '/agents' },
  { key: 'dashboard', label: 'Open Dashboard', desc: 'Mission Control overview', icon: IconDashboard, path: '/dashboard' },
  { key: 'create-job', label: 'Create Job', desc: 'Post a new ERC-8183 job', icon: IconJob, path: '/jobs/create' },
  { key: 'developer-tools', label: 'Developer Tools', desc: 'Call contracts directly', icon: IconTools, path: '/developer-tools' },
]

/**
 * Quick Actions — same large GlassCard grid language as Jobs v7's
 * JobsQuickActions. "Validate Identity" scrolls to the on-page request
 * form (preserved from ValidationPage) instead of navigating away, since
 * that form now lives on this same page.
 */
export function TrustQuickActions() {
  const navigate = useNavigate()

  const handleClick = (action) => {
    if (action.path) {
      navigate(action.path)
      return
    }
    if (action.action?.startsWith('scroll:')) {
      const id = action.action.slice('scroll:'.length)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Panel title="Quick Actions" subtitle="The next step, one tap away" className="tv7-quick-actions-panel">
      <Grid minColWidth="200px" gap="md" aria-label="Trust Center quick actions">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon
          return (
            <GlassCard
              key={action.key}
              as="button"
              type="button"
              interactive
              className="tv7-quick-action"
              onClick={() => handleClick(action)}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="tv7-quick-action-icon" aria-hidden="true">
                <Icon width={18} height={18} />
              </div>
              <div className="tv7-quick-action-label">{action.label}</div>
              <div className="tv7-quick-action-desc">{action.desc}</div>
            </GlassCard>
          )
        })}
      </Grid>
    </Panel>
  )
}
