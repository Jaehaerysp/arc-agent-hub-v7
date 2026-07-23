import { useNavigate } from 'react-router-dom'
import { GlassCard, Button, Badge } from '../../../ui/design-system'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { AvailabilityBadge } from '../../../ui/AvailabilityBadge'
import { isAtCapacity } from '../../../lib/agentAvailability'
import { shortAddr } from '../../../lib/format'
import { TrustSnapshot } from './TrustSnapshot'
import { SkillList } from './SkillList'

/**
 * Marketplace v7 tile — a premium "hiring profile," not a product
 * listing. Identity + specialty lead; reputation (as a trust bar, not
 * stars) comes before the rate; the rate itself is deliberately the
 * smallest fact on the card (UI Blueprint §2.10). Rebuilt on the v7
 * design system (GlassCard/Button/Badge) for Mission 4, same props and
 * the same two actions as before.
 *
 * Accessibility note: the card is a static container, not itself a click
 * target — "View Profile" and "Hire" are real <button> elements and the
 * only interactive controls here (nesting the whole card as a link with
 * further interactive descendants would be invalid ARIA).
 */
export function AgentCard({ agent }) {
  const navigate = useNavigate()
  const atCapacity = isAtCapacity(agent.availability)

  const handleHire = () => {
    if (atCapacity) return
    navigate('/jobs/create', { state: { provider: agent.wallet, agentName: agent.name } })
  }

  const goToProfile = () => navigate(`/agents/${agent.wallet}`)

  return (
    <GlassCard
      as="article"
      interactive
      padding="md"
      className={`mv7-agent-card ${atCapacity ? 'is-at-capacity' : ''}`}
    >
      <div className="mv7-agent-card-header">
        <AgentIdentityMark seed={agent.wallet} size={44} />
        <div className="mv7-agent-card-heading">
          <div className="mv7-agent-card-name-row">
            <span className="mv7-agent-card-name">{agent.name}</span>
            <AvailabilityBadge availability={agent.availability} />
          </div>
          <div className="mv7-agent-card-badges">
            <Badge variant="accent" size="sm">{agent.category}</Badge>
            {agent.registered && <Badge variant="confirmed" size="sm">✓ Verified</Badge>}
          </div>
        </div>
      </div>

      <SkillList specialty={agent.specialty} skills={agent.skills} limit={2} />

      <TrustSnapshot agent={agent} compact />

      <div className="mv7-agent-card-rate">
        <span>{agent.averageBudget} USDC / job</span>
        <span className="mono mv7-agent-card-wallet">{shortAddr(agent.wallet)}</span>
      </div>

      <div className="mv7-agent-card-actions">
        <Button variant="ghost" size="sm" block onClick={goToProfile} aria-label={`View profile for ${agent.name}`}>
          View Profile
        </Button>
        {atCapacity ? (
          <Button variant="ghost" size="sm" block disabled aria-label={`${agent.name} is at capacity`}>
            At capacity
          </Button>
        ) : (
          <Button variant="primary" size="sm" block onClick={handleHire} aria-label={`Hire ${agent.name}`}>
            Hire →
          </Button>
        )}
      </div>
    </GlassCard>
  )
}
