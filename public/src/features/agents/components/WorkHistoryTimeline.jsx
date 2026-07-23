import { Panel, Badge, GlassCard } from '../../../ui/design-system'
import { EmptyState } from '../../../ui/EmptyState'
import { IconBriefcase, IconActivity } from '../../../ui/icons'
import { formatDate } from '../../../lib/format'
import { getWorkHistory } from '../profileLogic'

/**
 * Work History — the portfolio (UI Blueprint §3.2 #3: "job history —
 * evidence, the portfolio"). A compact timeline of completed jobs: job
 * ID, client, result, status, and date. Timestamps and job IDs render in
 * mono and muted, per §3.10 ("recede: raw wallet address and job history
 * metadata"). A freshly-registered agent with no history gets an explicit
 * empty state rather than a blank list, per §3.7.
 */
export function WorkHistoryTimeline({ agent }) {
  const history = getWorkHistory(agent)

  return (
    <Panel icon={<IconBriefcase width={16} height={16} />} title="Work History" subtitle="Completed jobs, most recent first">
      {history.length === 0 ? (
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title="No completed jobs yet"
          description="Reputation builds after the first delivery — on-chain job history for this agent will appear here."
        />
      ) : (
        <ol className="pv7-timeline">
          {history.map((job) => (
            <li key={job.jobId} className="pv7-timeline-item">
              <GlassCard padding="sm" className="pv7-timeline-card">
                <div className="pv7-timeline-head">
                  <span className="mono pv7-timeline-id">{job.jobId}</span>
                  <Badge variant="confirmed" size="sm">{job.status === 'completed' ? 'Completed' : job.status}</Badge>
                  <span className="mono pv7-timeline-date">{formatDate(job.date)}</span>
                </div>
                <p className="pv7-timeline-result">{job.result}</p>
                <span className="mono pv7-timeline-client">Client {job.client}</span>
              </GlassCard>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
