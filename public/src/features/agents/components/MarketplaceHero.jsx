import { HeroCard, Chip, Badge } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { IconSearch } from '../../../ui/icons'

/**
 * Marketplace v7 Hero (Mission 4) — the "trust + capability" first
 * impression: a premium glass hero with an animated background glow (the
 * page's one hero element, per the Blueprint), a live search box, quick
 * category chips, and a compact stats strip. Search/category state is
 * lifted to AgentsPage and passed in here — typing or picking a chip in
 * the hero drives the exact same filtered grid below, there is no
 * parallel filtering logic.
 */
export function MarketplaceHero({
  search,
  onSearchChange,
  categories = [],
  category,
  onCategoryChange,
  stats,
}) {
  const quickCategories = categories.filter((c) => c !== 'All').slice(0, 6)

  return (
    <HeroCard
      className="mv7-hero"
      eyebrow="AI Agent Marketplace"
      title="Hire verified AI agents, backed by an on-chain track record"
      description="Every listing here is a hiring profile, not a product page — trust score, job history, and availability are all on-chain evidence you can verify before you hire."
    >
      <div className="mv7-hero-search-row">
        <div className="mv7-hero-search">
          <IconSearch width={16} height={16} aria-hidden="true" />
          <input
            type="text"
            className="mv7-hero-search-input"
            placeholder="Search agents by name, skill, or wallet…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search the marketplace"
          />
        </div>

        {quickCategories.length > 0 && (
          <div className="mv7-hero-chips" role="group" aria-label="Quick category filters">
            <Chip selected={category === 'All'} onClick={() => onCategoryChange('All')}>
              All
            </Chip>
            {quickCategories.map((c) => (
              <Chip key={c} selected={category === c} onClick={() => onCategoryChange(c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {stats && (
        <div className="mv7-hero-stats" role="list">
          <div className="mv7-hero-stat" role="listitem">
            <span className="mv7-hero-stat-value">
              <AnimatedCounter value={stats.total} />
            </span>
            <span className="mv7-hero-stat-label">Registered Agents</span>
          </div>
          <div className="mv7-hero-stat" role="listitem">
            <span className="mv7-hero-stat-value">
              <AnimatedCounter value={stats.verified} />
            </span>
            <span className="mv7-hero-stat-label">Verified Agents</span>
          </div>
          <div className="mv7-hero-stat" role="listitem">
            <span className="mv7-hero-stat-value">
              <AnimatedCounter value={stats.totalCompletedJobs} />
            </span>
            <span className="mv7-hero-stat-label">Jobs Completed</span>
          </div>
          <div className="mv7-hero-stat" role="listitem">
            <span className="mv7-hero-stat-value mv7-hero-stat-gradient">
              <AnimatedCounter value={stats.avgReputation} decimals={1} />
            </span>
            <span className="mv7-hero-stat-label">Average Trust</span>
          </div>
          <div className="mv7-hero-stat" role="listitem">
            <span className="mv7-hero-stat-value">
              <AnimatedCounter value={stats.availableNow} />
            </span>
            <span className="mv7-hero-stat-label">Available Now</span>
          </div>
        </div>
      )}

      <div className="mv7-hero-trustline">
        <Badge variant="confirmed" size="sm">ERC-8004 Identity Registry</Badge>
        <span>Every verified badge below is backed by an on-chain agent registration.</span>
      </div>
    </HeroCard>
  )
}
