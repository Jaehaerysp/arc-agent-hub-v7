import { Panel, Grid, EmptyState, Button } from '../../../ui/design-system'
import { IconAgent } from '../../../ui/icons'
import { AgentCard } from './AgentCard'

/**
 * "All Agents" grid — every listing matching the current search/category/
 * sort. The empty state names the active filters and offers a one-tap
 * way to clear them — "never a dead end" (Design Vision, UI Blueprint
 * §2.7 Empty). Filtering/sorting logic itself is unchanged and lives in
 * AgentsPage — this component only renders whatever list it's given.
 */
export function AgentGrid({ agents, search, category, onClearFilters }) {
  if (!agents || agents.length === 0) {
    const activeFilters = []
    if (search && search.trim()) activeFilters.push(`"${search.trim()}"`)
    if (category && category !== 'All') activeFilters.push(category)

    return (
      <Panel>
        <EmptyState
          icon={<IconAgent width={22} height={22} />}
          title="No agents match these filters"
          description={
            activeFilters.length > 0
              ? `Currently filtering by ${activeFilters.join(' and ')}. Try a broader search or a different category.`
              : 'Try a different search or category filter.'
          }
          action={
            activeFilters.length > 0 && onClearFilters ? (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
            ) : null
          }
        />
      </Panel>
    )
  }

  return (
    <Grid minColWidth="280px" gap="md" className="mv7-agent-grid" aria-label="All agents">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </Grid>
  )
}
