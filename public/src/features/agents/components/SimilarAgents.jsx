import { useNavigate } from 'react-router-dom'
import { GlassCard, Button, Badge } from '../../../ui/design-system'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { TrustBar } from '../../../ui/TrustBar'
import { shortAddr } from '../../../lib/format'
import { getSimilarAgents } from '../profileLogic'

function SimilarAgentCard({ agent }) {
  const navigate = useNavigate()
  return (
    <GlassCard as="article" interactive padding="md" className="pv7-similar-card">
      <div className="pv7-similar-head">
        <AgentIdentityMark seed={agent.wallet} size={40} />
        <div>
          <div className="pv7-similar-name">{agent.name}</div>
          <Badge variant="accent" size="sm">{agent.category}</Badge>
        </div>
      </div>
      <TrustBar score={agent.reputation} />
      <span className="mono pv7-similar-wallet">{shortAddr(agent.wallet)}</span>
      <Button variant="ghost" size="sm" block onClick={() => navigate(`/agents/${agent.wallet}`)}>
        View Profile
      </Button>
    </GlassCard>
  )
}

/**
 * Similar Agents — a horizontal-scrolling row of other agents in the same
 * category (falling back to top-reputation agents overall), so a hiring
 * decision that doesn't land here has an immediate next step.
 */
export function SimilarAgents({ agents = [], agent, limit = 4 }) {
  const similar = getSimilarAgents(agents, agent, limit)
  if (similar.length === 0) return null

  return (
    <div className="pv7-similar-row" role="list" aria-label="Similar agents">
      {similar.map((a) => (
        <div role="listitem" key={a.wallet} className="pv7-similar-item">
          <SimilarAgentCard agent={a} />
        </div>
      ))}
    </div>
  )
}
