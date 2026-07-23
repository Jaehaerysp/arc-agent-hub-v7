import { Panel, EmptyState } from '../../../ui/design-system'
import { formatTime, shortHash } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

/**
 * Modern vertical Activity Timeline — the shared Timeline pattern from the
 * Blueprint (dot-marked entries on a connecting line), driven by the same
 * `wallet.activity` feed the previous Dashboard's ActivityFeed used. New
 * entries append with the same 200ms slide-in used system-wide (`.reveal`
 * / `dv7-timeline-item` transition), never a re-invented loading language.
 */
export function MissionTimeline({ activity, arcExplorer, limit = 8 }) {
  const items = activity.slice(0, limit)

  return (
    <Panel title="Activity Timeline" subtitle="Everything that's happened, most recent first" className="dv7-timeline-panel">
      {items.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title="No activity yet"
          description="Register an agent, submit feedback, or send a transfer to see it show up here."
        />
      ) : (
        <ol className="dv7-timeline" aria-live="polite">
          {items.map((item) => (
            <li key={item.id} className="dv7-timeline-item" data-status={item.status}>
              <span className="dv7-timeline-dot" data-status={item.status} aria-hidden="true" />
              <div className="dv7-timeline-body">
                <div className="dv7-timeline-title">{item.label}</div>
                {item.agentId && <div className="dv7-timeline-detail">Agent #{item.agentId}</div>}
                {item.detail && <div className="dv7-timeline-detail">{item.detail}</div>}
              </div>
              <div className="dv7-timeline-meta">
                {item.txHash && (
                  <a
                    href={`${arcExplorer}/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dv7-timeline-tx mono"
                  >
                    {shortHash(item.txHash)}
                  </a>
                )}
                <time className="dv7-timeline-time">{formatTime(item.timestamp)}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
