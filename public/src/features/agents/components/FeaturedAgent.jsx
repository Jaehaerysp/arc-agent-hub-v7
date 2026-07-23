import { useNavigate } from 'react-router-dom'
import { GlassCard, Button, Badge, Chip } from '../../../ui/design-system'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { AvailabilityBadge } from '../../../ui/AvailabilityBadge'
import { isAtCapacity } from '../../../lib/agentAvailability'
import { shortAddr } from '../../../lib/format'
import { TrustSnapshot } from './TrustSnapshot'
import { getFeaturedAgents } from '../marketplaceLogic'

/**
 * A single large, premium horizontal card for one featured agent — full
 * identity, trust evidence, skills, availability, price, and both
 * actions in one glance (UI Blueprint Part C: the Marketplace's "hero
 * card" treatment, larger and richer than the dense grid tile).
 */
function FeaturedAgentCard({ agent }) {
  const navigate = useNavigate()
  const atCapacity = isAtCapacity(agent.availability)

  const handleHire = () => {
    if (atCapacity) return
    navigate('/jobs/create', { state: { provider: agent.wallet, agentName: agent.name } })
  }

  return (
    <GlassCard className="mv7-featured-card" padding="lg" interactive glow>
      <div className="mv7-featured-identity">
        <AgentIdentityMark seed={agent.wallet} size={64} />
        <div className="mv7-featured-heading">
          <div className="mv7-featured-name-row">
            <h3 className="mv7-featured-name">{agent.name}</h3>
            <AvailabilityBadge availability={agent.availability} />
          </div>
          <Badge variant="accent">{agent.category}</Badge>
        </div>
        <div className="mv7-featured-price">
          <span className="mv7-featured-price-value">{agent.averageBudget} USDC</span>
          <span className="mv7-featured-price-label">per job</span>
        </div>
      </div>

      <p className="mv7-featured-desc">{agent.description}</p>

      {agent.skills?.length > 0 && (
        <div className="mv7-featured-skills">
          {agent.skills.slice(0, 4).map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
      )}

      <TrustSnapshot agent={agent} compact />

      <div className="mv7-featured-footer">
        <span className="mv7-featured-wallet mono">{shortAddr(agent.wallet)}</span>
        <div className="mv7-featured-actions">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/agents/${agent.wallet}`)}>
            View Profile
          </Button>
          <Button variant="primary" size="sm" onClick={handleHire} disabled={atCapacity}>
            {atCapacity ? 'At capacity' : 'Hire →'}
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

/**
 * "Featured AI Agents" — the top agents by reputation this cycle,
 * rendered as large horizontal premium cards (UI Blueprint §"one hero
 * per section" applied at the section level, not per-card: several
 * cards share the same rich treatment because this section itself is
 * the page's featured moment, not the whole page's single hero).
 */
export function FeaturedAgent({ agents = [], limit = 3 }) {
  const featured = getFeaturedAgents(agents, limit)
  if (featured.length === 0) return null

  return (
    <div className="mv7-featured-row" role="list" aria-label="Featured agents">
      {featured.map((agent) => (
        <div role="listitem" key={agent.id}>
          <FeaturedAgentCard agent={agent} />
        </div>
      ))}
    </div>
  )
}
