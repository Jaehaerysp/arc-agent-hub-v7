import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from '../../../ui/Card'
import { Badge } from '../../../ui/Badge'
import { Button } from '../../../ui/Button'
import { CopyButton } from '../../../ui/CopyButton'
import { EmptyState } from '../../../ui/EmptyState'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { AvailabilityBadge } from '../../../ui/AvailabilityBadge'
import { isAtCapacity } from '../../../lib/agentAvailability'
import { IconActivity } from '../../../ui/icons'
import { TrustSnapshot } from './TrustSnapshot'
import { SkillList } from './SkillList'

/**
 * The résumé — where a hiring decision gets confirmed (UI Blueprint §3).
 * Information hierarchy: identity + registration proof first, reputation
 * evidence second, job history third, terms + Hire action last — the
 * commercial decision is made only once trust is established.
 */
export function AgentProfileCard({ agent }) {
  const navigate = useNavigate()
  const atCapacity = isAtCapacity(agent.availability)

  const handleHire = () => {
    if (atCapacity) return
    navigate('/jobs/create', { state: { provider: agent.wallet, agentName: agent.name } })
  }

  return (
    <div className="agent-profile">
      <Card>
        <CardBody>
          <div className="agent-profile-header">
            <AgentIdentityMark seed={agent.wallet} size={56} />
            <div className="agent-profile-identity">
              <div className="agent-profile-name-row">
                <h2 className="agent-profile-name">{agent.name}</h2>
                {agent.registered && <Badge variant="confirmed">✓ Registered · ERC-8004</Badge>}
                <AvailabilityBadge availability={agent.availability} />
              </div>
              <Badge variant="accent">{agent.category}</Badge>
              <div className="agent-card-wallet" style={{ marginTop: 10 }}>
                <span className="mono">{agent.wallet}</span>
                <CopyButton value={agent.wallet} label="" />
              </div>
            </div>
            <Button variant="primary" onClick={handleHire} disabled={atCapacity} className="agent-profile-hire-btn">
              {atCapacity ? 'At capacity' : 'Hire →'}
            </Button>
          </div>

          <SkillList specialty={agent.specialty} skills={agent.skills} />
          <p className="panel-desc">{agent.description}</p>
        </CardBody>
      </Card>

      <div className="two-col" style={{ marginTop: 20 }}>
        <Card>
          <CardBody>
            <div className="dashboard-section-title" style={{ margin: 0 }}>Trust Snapshot</div>
            <TrustSnapshot agent={agent} />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="dashboard-section-title" style={{ margin: 0 }}>Terms</div>
            <div className="kv-grid">
              <div className="kv-row">
                <span className="kv-label">Rate</span>
                <span className="kv-value">{agent.averageBudget} USDC / job</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Avg. delivery</span>
                <span className="kv-value">{agent.avgDeliveryHours}h</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Response rate</span>
                <span className="kv-value">{agent.responseRate}%</span>
              </div>
            </div>
            <p className="panel-desc" style={{ marginBottom: 8 }}>
              Starts a new ERC-8183 job with {agent.name} pre-filled as the provider — post the work, the
              agent accepts, funds stay in escrow until the work is validated.
            </p>
            <Button variant="primary" className="btn-block" onClick={handleHire} disabled={atCapacity}>
              {atCapacity ? 'At capacity' : 'Hire this agent →'}
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card style={{ marginTop: 20 }}>
        <CardBody>
          <div className="dashboard-section-title" style={{ margin: 0 }}>Job History</div>
          <EmptyState
            icon={<IconActivity width={20} height={20} />}
            title="No completed jobs yet"
            description="Reputation builds after the first delivery — on-chain job history for this agent will appear here in a future sprint."
          />
        </CardBody>
      </Card>
    </div>
  )
}
