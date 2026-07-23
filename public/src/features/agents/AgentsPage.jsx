import { useMemo, useState } from 'react'
import { Tabs } from '../../ui/Tabs'
import { Container, Section } from '../../ui/design-system'
import { AGENTS } from '../../data/agents'
import { MarketplaceHero } from './components/MarketplaceHero'
import { FeaturedAgent } from './components/FeaturedAgent'
import { AgentStats } from './components/AgentStats'
import { CategoryExplorer } from './components/CategoryExplorer'
import { MarketplaceFilters } from './components/MarketplaceFilters'
import { TrendingAgents } from './components/TrendingAgents'
import { VerifiedAgents } from './components/VerifiedAgents'
import { AgentGrid } from './components/AgentGrid'
import { MarketplaceCTA } from './components/MarketplaceCTA'
import { RegisterAgentPanel } from './components/RegisterAgentPanel'
import { computeMarketplaceStats } from './marketplaceLogic'

const TABS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'register', label: 'Register Agent' },
]

const CATEGORIES = ['All', ...new Set(AGENTS.map((a) => a.category))]

function sortAgents(agents, sort) {
  const sorted = [...agents]
  if (sort === 'jobs') return sorted.sort((a, b) => b.completedJobs - a.completedJobs)
  if (sort === 'rate-asc') return sorted.sort((a, b) => a.averageBudget - b.averageBudget)
  return sorted.sort((a, b) => b.reputation - a.reputation)
}

/**
 * Marketplace v7 — "AI Agent Marketplace" (Mission 4). Page order per the
 * brief: Hero -> Featured -> Stats -> Category Explorer -> Search/Filters
 * -> Trending -> Verified -> All Agents Grid -> CTA. Every existing
 * action (Hire, View Profile, Search, Filters, Sorting) and the
 * Register Agent tab are unchanged; this milestone only changes
 * presentation and adds read-only derived sections on top of the same
 * AGENTS catalog and the same lifted search/category/sort state.
 */
export default function AgentsPage() {
  const [tab, setTab] = useState('marketplace')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('reputation')

  const marketplaceStats = useMemo(() => computeMarketplaceStats(AGENTS), [])

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = AGENTS.filter((a) => {
      if (category !== 'All' && a.category !== category) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.wallet.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.specialty?.toLowerCase().includes(q) ||
        a.skills?.some((s) => s.toLowerCase().includes(q))
      )
    })
    return sortAgents(filtered, sort)
  }, [search, category, sort])

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
  }

  return (
    <div className="dashboard">
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'marketplace' ? (
        <Container size="wide" className="mv7-marketplace">
          <Section spacing="md">
            <MarketplaceHero
              search={search}
              onSearchChange={setSearch}
              categories={CATEGORIES}
              category={category}
              onCategoryChange={setCategory}
              stats={marketplaceStats}
            />
          </Section>

          <Section spacing="md">
            <FeaturedAgent agents={AGENTS} limit={3} />
          </Section>

          <Section spacing="md">
            <AgentStats agents={AGENTS} />
          </Section>

          <Section spacing="md">
            <CategoryExplorer
              agents={AGENTS}
              categories={CATEGORIES}
              category={category}
              onCategoryChange={setCategory}
            />
          </Section>

          <Section spacing="md">
            <MarketplaceFilters
              search={search}
              onSearchChange={setSearch}
              categories={CATEGORIES}
              category={category}
              onCategoryChange={setCategory}
              sort={sort}
              onSortChange={setSort}
            />
          </Section>

          <Section spacing="md">
            <TrendingAgents agents={AGENTS} limit={4} />
          </Section>

          <Section spacing="md">
            <VerifiedAgents agents={AGENTS} limit={4} />
          </Section>

          <Section spacing="md">
            <div className="mv7-section-heading">
              <h2>All Agents</h2>
              <span>{filteredAgents.length} listed</span>
            </div>
            <AgentGrid
              agents={filteredAgents}
              search={search}
              category={category}
              onClearFilters={clearFilters}
            />
          </Section>

          <Section spacing="md">
            <MarketplaceCTA onRegisterClick={() => setTab('register')} />
          </Section>
        </Container>
      ) : (
        <div style={{ marginTop: 18 }}>
          <RegisterAgentPanel />
        </div>
      )}
    </div>
  )
}
