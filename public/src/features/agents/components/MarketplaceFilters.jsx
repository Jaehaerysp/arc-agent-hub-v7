import { useEffect } from 'react'
import { SearchInput, Chip, Select } from '../../../ui/design-system'

const SEARCH_INPUT_ID = 'mv7-marketplace-search'

const SORT_OPTIONS = [
  { id: 'reputation', label: 'Reputation' },
  { id: 'jobs', label: 'Most jobs completed' },
  { id: 'rate-asc', label: 'Rate: low to high' },
]

/**
 * Marketplace v7 sticky search bar — search + category filter chips +
 * sort, rebuilt on the v7 design system (SearchInput/Chip/Select).
 * Chips remain a proper toggle group (role="group", aria-pressed) per UI
 * Blueprint §2.9. The "/" key still focuses search from anywhere on the
 * page. Props and filtering behavior are unchanged from the previous
 * Marketplace — only presentation moved to the design system.
 */
export function MarketplaceFilters({ search, onSearchChange, categories, category, onCategoryChange, sort, onSortChange }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== '/') return
      const active = document.activeElement
      const isTyping = active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)
      if (isTyping) return
      e.preventDefault()
      document.getElementById(SEARCH_INPUT_ID)?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="mv7-filters">
      <div className="mv7-filters-search-row">
        <SearchInput
          id={SEARCH_INPUT_ID}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search by name, skill, or wallet…"
          shortcut="/"
          className="mv7-filters-search"
        />

        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort agents" className="mv7-filters-sort">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>Sort: {opt.label}</option>
          ))}
        </Select>
      </div>

      <div className="mv7-filters-chip-row" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <Chip key={c} selected={category === c} onClick={() => onCategoryChange(c)}>
            {c}
          </Chip>
        ))}
      </div>
    </div>
  )
}
