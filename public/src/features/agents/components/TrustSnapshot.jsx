import { TrustBar } from '../../../ui/TrustBar'
import { IconCheck, IconActivity, IconZap } from '../../../ui/icons'

/**
 * "Evidence before scores" (Design Vision principle): the trust bar is the
 * headline, but it's always accompanied by the concrete facts that back it
 * up — completed jobs, success rate, response rate — so the number reads as
 * earned rather than arbitrary. `compact` drops the evidence rows for use
 * inside the dense Marketplace card; the full version is used on the
 * Agent Profile's Trust Snapshot panel.
 */
export function TrustSnapshot({ agent, compact = false }) {
  if (compact) {
    return (
      <div className="trust-snapshot trust-snapshot-compact">
        <TrustBar score={agent.reputation} />
        <span className="trust-snapshot-jobs">{agent.completedJobs} jobs completed</span>
      </div>
    )
  }

  return (
    <div className="trust-snapshot">
      <div className="trust-snapshot-headline">
        <TrustBar score={agent.reputation} size="lg" />
        <span className="trust-snapshot-headline-label">Reputation, out of 5.0</span>
      </div>
      <div className="trust-snapshot-evidence">
        <div className="trust-snapshot-fact">
          <IconCheck width={14} height={14} />
          <div>
            <div className="trust-snapshot-fact-value">{agent.completedJobs}</div>
            <div className="trust-snapshot-fact-label">Jobs completed</div>
          </div>
        </div>
        <div className="trust-snapshot-fact">
          <IconActivity width={14} height={14} />
          <div>
            <div className="trust-snapshot-fact-value">{agent.successRate}%</div>
            <div className="trust-snapshot-fact-label">Success rate</div>
          </div>
        </div>
        <div className="trust-snapshot-fact">
          <IconZap width={14} height={14} />
          <div>
            <div className="trust-snapshot-fact-value">{agent.responseRate}%</div>
            <div className="trust-snapshot-fact-label">Response rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
