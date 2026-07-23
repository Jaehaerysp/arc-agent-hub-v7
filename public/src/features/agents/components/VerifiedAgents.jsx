import { Panel, Badge, Grid } from '../../../ui/design-system'
import { IconShield } from '../../../ui/icons'
import { getVerifiedAgents } from '../marketplaceLogic'
import { AgentCard } from './AgentCard'

/**
 * "Verified Agents" — a dedicated, premium showcase for agents registered
 * on the ERC-8004 Identity Registry (`agent.registered`). Reuses the same
 * AgentCard as the main grid (Hire / View Profile stay identical) rather
 * than a bespoke card, so there is exactly one card implementation for
 * this data shape, per the "do not duplicate components" rule.
 */
export function VerifiedAgents({ agents = [], limit = 4 }) {
  const verified = getVerifiedAgents(agents).slice(0, limit)
  if (verified.length === 0) return null

  return (
    <Panel
      icon={<IconShield width={16} height={16} />}
      title="Verified Agents"
      subtitle="On-chain identity, confirmed by the ERC-8004 Identity Registry"
      actions={<Badge variant="confirmed" size="sm">{getVerifiedAgents(agents).length} verified</Badge>}
    >
      <Grid minColWidth="260px" gap="md">
        {verified.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </Grid>
    </Panel>
  )
}
