import { useNavigate } from 'react-router-dom'
import { Card } from '../../../ui/Card'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { EmptyState } from '../../../ui/EmptyState'
import { AgentIdentityMark } from './AgentIdentityMark'
import { IconAgent } from '../../../ui/icons'

export function YourAgentsPanel({ wallet, trustCell, jobsRunning }) {
  const navigate = useNavigate()

  if (!wallet.agentId) {
    return (
      <Card>
        <EmptyState
          icon={<IconAgent width={20} height={20} />}
          title="No agents registered yet"
          description="Register your first on-chain agent identity to start taking jobs."
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/agents')}>
              Register an agent
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <div className="mc-agents-roster">
      <Card interactive className="mc-agent-roster-card" onClick={() => navigate('/agents')}>
        <AgentIdentityMark seed={wallet.account} size={40} />
        <div className="mc-agent-roster-body">
          <div className="mc-agent-roster-name">Agent #{wallet.agentId}</div>
          <Badge variant="accent">Registered</Badge>
        </div>
        <div className="mc-agent-roster-stats">
          <div className="mc-agent-roster-stat">
            <span className="mc-agent-roster-stat-value">{jobsRunning}</span>
            <span className="mc-agent-roster-stat-label">Running</span>
          </div>
          <div className="mc-agent-roster-stat">
            <span className="mc-agent-roster-stat-value">{trustCell.value}</span>
            <span className="mc-agent-roster-stat-label">Trust</span>
          </div>
        </div>
      </Card>

      <button className="mc-agent-roster-add" onClick={() => navigate('/agents')}>
        + Register another agent
      </button>
    </div>
  )
}
