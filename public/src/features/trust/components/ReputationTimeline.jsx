import { Panel, EmptyState } from '../../../ui/design-system'
import { formatTime, formatDate, shortHash } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

/**
 * Reputation Timeline — vertical milestone view (Agent Registered, First
 * Job, Validation Requested, Reputation Increased, ...), built from
 * `computeReputationTimeline`. Every entry traces back to a real local
 * activity item or the presence of `agentId`; nothing is synthesized
 * beyond the one-time "Agent Registered" marker.
 */
export function ReputationTimeline({ milestones, arcExplorer }) {
  return (
    <Panel title="Reputation Timeline" subtitle="Milestones in this agent's trust journey" className="tv7-timeline-panel">
      {milestones.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title="No milestones yet"
          description="Register an agent and start submitting feedback or validation requests to build a timeline."
        />
      ) : (
        <ol className="tv7-timeline" aria-live="polite">
          {milestones.map((m) => (
            <li key={m.id} className="tv7-timeline-item" data-status={m.status}>
              <span className="tv7-timeline-dot" data-status={m.status} aria-hidden="true" />
              <div className="tv7-timeline-body">
                <div className="tv7-timeline-title">{m.label}</div>
                {m.detail && <div className="tv7-timeline-detail">{m.detail}</div>}
              </div>
              <div className="tv7-timeline-meta">
                {m.txHash && (
                  <a href={`${arcExplorer}/tx/${m.txHash}`} target="_blank" rel="noopener noreferrer" className="tv7-timeline-tx mono">
                    {shortHash(m.txHash)}
                  </a>
                )}
                <time className="tv7-timeline-time">{m.timestamp ? `${formatDate(m.timestamp)} · ${formatTime(m.timestamp)}` : 'Ongoing'}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
