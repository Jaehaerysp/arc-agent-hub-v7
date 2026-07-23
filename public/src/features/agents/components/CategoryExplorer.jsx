import { Panel, Chip } from '../../../ui/design-system'
import { IconTools, IconActivity, IconShield, IconZap, IconLayers, IconBook, IconAgent } from '../../../ui/icons'

// Icons are cosmetic per-category signposts, not a source of truth — any
// category not listed here (including ones added later to AGENTS) falls
// back to the generic agent glyph, so this never needs to be kept in sync.
const CATEGORY_ICONS = {
  Development: IconTools,
  Research: IconActivity,
  Security: IconShield,
  Trading: IconZap,
  Finance: IconZap,
  Infrastructure: IconLayers,
  Automation: IconTools,
  Content: IconBook,
  Analytics: IconActivity,
  Language: IconBook,
  'Quality Assurance': IconShield,
}

/**
 * Beautiful chip navigation over the same categories used to filter the
 * grid below — this is a second, more visual entry point into the exact
 * same `category` state AgentsPage already owns (no parallel filtering).
 */
export function CategoryExplorer({ agents = [], categories = [], category, onCategoryChange }) {
  const counts = agents.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})

  const explorable = categories.filter((c) => c !== 'All')
  if (explorable.length === 0) return null

  return (
    <Panel title="Browse by category" subtitle="Every agent is tagged with one primary specialization">
      <div className="mv7-category-row" role="group" aria-label="Browse agent categories">
        <Chip selected={category === 'All'} onClick={() => onCategoryChange('All')}>
          All agents
          <span className="mv7-category-count">{agents.length}</span>
        </Chip>
        {explorable.map((c) => {
          const Icon = CATEGORY_ICONS[c] || IconAgent
          return (
            <Chip key={c} selected={category === c} onClick={() => onCategoryChange(c)} icon={<Icon width={14} height={14} />}>
              {c}
              <span className="mv7-category-count">{counts[c] || 0}</span>
            </Chip>
          )
        })}
      </div>
    </Panel>
  )
}
