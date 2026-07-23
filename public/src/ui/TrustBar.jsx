const SEGMENTS = 5

/**
 * Reputation, presented as an at-a-glance trust shape rather than a raw
 * number or a star rating (explicitly disallowed — see Design Vision §5:
 * "No star ratings borrowed from consumer e-commerce"). `score` is on a
 * 0–5 scale. The numeric value is always rendered alongside the segments,
 * never conveyed by fill alone (UI Blueprint §2.9).
 */
export function TrustBar({ score, size = 'md' }) {
  const clamped = Math.max(0, Math.min(SEGMENTS, score || 0))
  const filled = Math.round(clamped)

  return (
    <div className={`trust-bar trust-bar-${size}`} role="img" aria-label={`Reputation ${clamped.toFixed(1)} out of 5`}>
      <div className="trust-bar-segments" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={`trust-bar-segment ${i < filled ? 'is-filled' : ''}`} />
        ))}
      </div>
      <span className="trust-bar-value">{clamped.toFixed(1)}</span>
    </div>
  )
}
