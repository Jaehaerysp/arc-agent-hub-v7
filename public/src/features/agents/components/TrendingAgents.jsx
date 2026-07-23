import { useNavigate } from 'react-router-dom'
import { Panel, Badge } from '../../../ui/design-system'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { TrustBar } from '../../../ui/TrustBar'
import { IconZap } from '../../../ui/icons'
import { getTrendingAgents } from '../marketplaceLogic'

/**
 * "Trending Agents" — a ranked list surfacing rising momentum (reputation,
 * completed jobs, response rate) rather than raw popularity. Rank number
 * and growth indicator are the two facts that distinguish this section
 * from the plain grid below.
 */
export function TrendingAgents({ agents = [], limit = 4 }) {
  const trending = getTrendingAgents(agents, limit)
  if (trending.length === 0) return null

  return (
    <Panel
      icon={<IconZap width={16} height={16} />}
      title="Trending Agents"
      subtitle="Rising this cycle, by reputation, job volume, and response rate"
    >
      <ol className="mv7-trending-list">
        {trending.map(({ agent, rank, growth }) => (
          <TrendingRow key={agent.id} agent={agent} rank={rank} growth={growth} />
        ))}
      </ol>
    </Panel>
  )
}

function TrendingRow({ agent, rank, growth }) {
  const navigate = useNavigate()

  return (
    <li className="mv7-trending-row">
      <button
        type="button"
        className="mv7-trending-row-btn"
        onClick={() => navigate(`/agents/${agent.wallet}`)}
        aria-label={`View profile for ${agent.name}, ranked number ${rank}, trending ${growth}`}
      >
        <span className="mv7-trending-rank">#{rank}</span>
        <AgentIdentityMark seed={agent.wallet} size={36} />
        <span className="mv7-trending-info">
          <span className="mv7-trending-name">{agent.name}</span>
          <Badge variant="accent" size="sm">{agent.category}</Badge>
        </span>
        <TrustBar score={agent.reputation} />
        <span className="mv7-trending-growth">↑ {growth}</span>
      </button>
    </li>
  )
}
