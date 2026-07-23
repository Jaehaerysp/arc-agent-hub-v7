import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../nav'
import { IconSearch, IconArrowRight } from '../../ui/icons'

/**
 * Global command palette. UI only — no search backend, no fuzzy
 * indexing of app data. It filters the static navigation list
 * client-side and hands off to the existing router for movement.
 * Opens with ⌘K / Ctrl+K from anywhere, or via the Topbar trigger.
 */
export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return NAV_ITEMS
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const go = (path) => {
    navigate(path)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      go(results[activeIndex].path)
    }
  }

  if (!open) return null

  return (
    <div className="command-overlay" onClick={onClose}>
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-input-row">
          <IconSearch width={16} height={16} className="command-input-icon" />
          <input
            ref={inputRef}
            className="command-input"
            placeholder="Jump to a page…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search navigation"
          />
          <kbd className="command-kbd">Esc</kbd>
        </div>

        <div className="command-results" role="listbox">
          {results.length === 0 && <div className="command-empty">No matching pages</div>}
          {results.map((item, i) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                className={`command-result ${i === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => go(item.path)}
              >
                <span className="command-result-icon">
                  <Icon width={15} height={15} />
                </span>
                <span className="command-result-label">{item.label}</span>
                <IconArrowRight width={13} height={13} className="command-result-go" />
              </button>
            )
          })}
        </div>

        <div className="command-footer">
          <span><kbd className="command-kbd">↑</kbd><kbd className="command-kbd">↓</kbd> Navigate</span>
          <span><kbd className="command-kbd">↵</kbd> Select</span>
        </div>
      </div>
    </div>
  )
}
