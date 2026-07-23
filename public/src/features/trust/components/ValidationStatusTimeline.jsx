import { Panel, EmptyState, Badge } from '../../../ui/design-system'
import { formatDate, shortHash, shortAddr } from '../../../lib/format'
import { IconShield } from '../../../ui/icons'

/**
 * Validation Status — a timeline of `validationRequest` activity.
 * Statuses are limited to what's actually knowable from this browser's
 * activity log: "Requested" (tx confirmed, awaiting the validator off-
 * chain) or "Failed" (tx reverted). There is deliberately no "Validated"
 * / "Expired" state here — the Validation Registry ABI has no getter to
 * read a validator's decision back, so this page never claims a
 * validation outcome it can't verify.
 */
export function ValidationStatusTimeline({ events, arcExplorer }) {
  return (
    <Panel title="Validation Status" subtitle="Requests submitted to validators, most recent first" className="tv7-validation-panel">
      {events.length === 0 ? (
        <EmptyState
          icon={<IconShield width={20} height={20} />}
          title="No validation requests yet"
          description="Requests submitted via the Validation Registry will appear here."
        />
      ) : (
        <ol className="tv7-validation-list" aria-live="polite">
          {events.map((e) => (
            <li key={e.id} className="tv7-validation-item">
              <span className={`tv7-validation-dot ${e.status === 'success' ? 'is-success' : 'is-error'}`} aria-hidden="true" />
              <div className="tv7-validation-body">
                <div className="tv7-validation-title">
                  {e.label}
                  <Badge variant={e.status === 'success' ? 'pending' : 'error'} size="sm" dot={false}>
                    {e.status === 'success' ? 'Pending validator review' : 'Request failed'}
                  </Badge>
                </div>
                <div className="tv7-validation-meta">
                  {e.validator && <span>Validator {shortAddr(e.validator)}</span>}
                  {e.detail && <span>{e.detail}</span>}
                </div>
              </div>
              <div className="tv7-validation-side">
                {e.txHash && (
                  <a href={`${arcExplorer}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="tv7-validation-tx mono">
                    {shortHash(e.txHash)}
                  </a>
                )}
                <time className="tv7-validation-date">{formatDate(e.timestamp)}</time>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
