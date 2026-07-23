import { Panel, EmptyState, Badge } from '../../../ui/design-system'
import { formatTime, formatDate, shortHash } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

/**
 * Recent Events — a flat activity feed of the same trust events shown
 * in the Reputation Timeline / Verification History, in simple
 * newest-first list form for a quick scan (distinct presentation, same
 * underlying data — no separate source).
 */
export function RecentEventsFeed({ events, arcExplorer, limit = 8 }) {
  const items = events.slice(0, limit)

  return (
    <Panel title="Recent Events" subtitle="Feedback and validation activity, most recent first" className="tv7-recent-events-panel">
      {items.length === 0 ? (
        <EmptyState icon={<IconActivity width={20} height={20} />} title="No recent events" description="Trust-related activity will show up here." />
      ) : (
        <ul className="tv7-recent-events">
          {items.map((e) => (
            <li key={e.id} className="tv7-recent-event">
              <div className="tv7-recent-event-main">
                <span className="tv7-recent-event-label">{e.label}</span>
                <Badge variant={e.status === 'success' ? 'success' : 'error'} size="sm" dot={false}>
                  {e.status === 'success' ? 'Confirmed' : 'Failed'}
                </Badge>
              </div>
              <div className="tv7-recent-event-meta">
                {e.txHash && (
                  <a href={`${arcExplorer}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="mono">
                    {shortHash(e.txHash)}
                  </a>
                )}
                <time>{formatDate(e.timestamp)} · {formatTime(e.timestamp)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
