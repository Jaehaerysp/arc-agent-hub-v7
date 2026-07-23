import { IconCheck } from '../../../ui/icons'

/**
 * "Budget Set" and "Approved" are not on-chain statuses (the contract's
 * status enum only has Open/Funded/Submitted/Completed/Rejected/Expired) —
 * they're derived client-side from job.budget and the connected account's
 * USDC allowance, purely for this progress display.
 */
export function JobTimeline({ job, allowance, account }) {
  if (!job) return null

  const isTerminalFail = job.status === 4 || job.status === 5 // Rejected / Expired

  const isClient = account && job.client && account.toLowerCase() === job.client.toLowerCase()
  const budgetSet = job.budget > 0n
  const approvedKnown = isClient && budgetSet && allowance !== null && allowance !== undefined
  const approved = approvedKnown && allowance >= job.budget

  const steps = [
    { key: 'created', label: 'Created', done: true },
    { key: 'budget', label: 'Budget Set', done: budgetSet },
    { key: 'approved', label: 'Approved', done: approved, unknown: budgetSet && !approvedKnown },
    { key: 'funded', label: 'Funded', done: job.status >= 1 && !isTerminalFail },
    { key: 'submitted', label: 'Submitted', done: job.status >= 2 && !isTerminalFail },
    { key: 'completed', label: 'Completed', done: job.status === 3 },
  ]

  return (
    <div className="job-timeline">
      {steps.map((step, i) => (
        <div key={step.key} className={`job-timeline-step ${step.done ? 'done' : ''} ${step.unknown ? 'unknown' : ''}`}>
          <div className="job-timeline-marker">
            {step.done ? <IconCheck width={12} height={12} /> : <span className="job-timeline-dot" />}
          </div>
          <span className="job-timeline-label">
            {step.label}
            {step.unknown && <span className="job-timeline-hint"> (client only)</span>}
          </span>
          {i < steps.length - 1 && <span className="job-timeline-connector" />}
        </div>
      ))}

      {isTerminalFail && (
        <div className="job-timeline-terminal">{job.statusLabel === 'Rejected' ? 'This job was rejected.' : 'This job expired before completion.'}</div>
      )}
    </div>
  )
}
