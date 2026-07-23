import { useNavigate } from 'react-router-dom'
import { Card } from '../../../ui/Card'
import { IconJob, IconAgent, IconTransfer, IconTools, IconSettings } from '../../../ui/icons'

const ACTIONS = [
  { path: '/jobs/create', label: 'Create Job', desc: 'Post a new ERC-8183 job', icon: IconJob },
  { path: '/agents', label: 'Hire Agent', desc: 'Browse the marketplace', icon: IconAgent },
  { path: '/transfer', label: 'Transfer', desc: 'Send ANV instantly', icon: IconTransfer },
  { path: '/developer-tools', label: 'Developer Tools', desc: 'Call contracts directly', icon: IconTools },
  { path: '/settings', label: 'Settings', desc: 'Network & preferences', icon: IconSettings },
]

export function QuickActionsPanel() {
  const navigate = useNavigate()

  return (
    <div className="mc-quick-actions">
      {ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <Card key={action.path} interactive className="mc-quick-action" onClick={() => navigate(action.path)}>
            <div className="mc-quick-action-icon">
              <Icon width={18} height={18} />
            </div>
            <div className="mc-quick-action-label">{action.label}</div>
            <div className="mc-quick-action-desc">{action.desc}</div>
          </Card>
        )
      })}
    </div>
  )
}
