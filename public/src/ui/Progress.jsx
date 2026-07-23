/**
 * Progress indicator. Pass `value` (0–100) for a determinate bar, or
 * omit it for an indeterminate one — used for on-chain writes where
 * exact progress isn't knowable but the user should still feel informed
 * rather than anxious (see Design Vision > Loading).
 */
export function Progress({ value, label, className = '' }) {
  const determinate = typeof value === 'number'
  const pct = determinate ? Math.max(0, Math.min(100, value)) : undefined
  return (
    <div
      className={['progress-track', className].filter(Boolean).join(' ')}
      role="progressbar"
      aria-valuenow={determinate ? pct : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={['progress-fill', determinate ? '' : 'indeterminate'].filter(Boolean).join(' ')}
        style={determinate ? { width: `${pct}%` } : undefined}
      />
    </div>
  )
}
