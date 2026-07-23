import { Link, useLocation, useParams } from 'react-router-dom'
import { NAV_ITEMS, ROUTE_LABELS } from '../nav'
import { shortAddr } from '../../lib/format'

/**
 * Reusable breadcrumb trail derived from the current route.
 * Presentational only — reads existing router state, never
 * changes navigation behavior. Integrates automatically with
 * any future page as long as it appears in NAV_ITEMS or its
 * dynamic segment has a human label available here.
 */
export default function Breadcrumbs() {
  const location = useLocation()
  const params = useParams()

  const segments = buildSegments(location.pathname, params)
  if (segments.length <= 1) return null

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          return (
            <li key={seg.path} className="breadcrumb-item">
              {isLast || !seg.path ? (
                <span className="breadcrumb-current" aria-current="page">
                  {seg.label}
                </span>
              ) : (
                <Link to={seg.path} className="breadcrumb-link">
                  {seg.label}
                </Link>
              )}
              {!isLast && <span className="breadcrumb-sep">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function buildSegments(pathname, params) {
  const navMatch = NAV_ITEMS.find((i) => pathname === i.path || pathname.startsWith(`${i.path}/`))
  const segments = [{ path: '/dashboard', label: 'Home' }]

  if (!navMatch) return segments

  segments.push({ path: navMatch.path, label: navMatch.label })

  const rest = pathname.slice(navMatch.path.length).split('/').filter(Boolean)
  let cursor = navMatch.path

  for (const part of rest) {
    cursor = `${cursor}/${part}`
    segments.push({ path: cursor, label: labelForSegment(part, params) })
  }

  return segments
}

function labelForSegment(part, params) {
  if (ROUTE_LABELS[part]) return ROUTE_LABELS[part]
  // Ethereum-style address route params (agent wallet)
  if (params?.wallet === part && part.startsWith('0x')) return shortAddr(part)
  // Numeric or hash-like job id
  if (params?.id === part) return `Job #${part}`
  return part
}
