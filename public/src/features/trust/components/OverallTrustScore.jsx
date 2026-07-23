import { Panel, Badge } from '../../../ui/design-system'

/**
 * Overall Trust — the large circular score reused from the same ring
 * pattern as Jobs v7's `RingChart` (JobsAnalyticsPanel), scaled up as
 * the page's second gradient moment (Hero used the first). Trend and
 * "Confidence Level" are both plain-language reflections of the same
 * `score`/`tier` figures shown in the Hero and Metrics above — nothing
 * new is computed here.
 */
export function OverallTrustScore({ score, tier, monthlyTrend }) {
  const size = 176
  const stroke = 12
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = score === null ? 0 : Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clamped / 100)

  const last = monthlyTrend[monthlyTrend.length - 1]?.value ?? 0
  const prev = monthlyTrend[monthlyTrend.length - 2]?.value ?? 0
  const growing = last > prev
  const flat = last === prev

  const confidence = score === null ? 'No data yet' : score >= 90 ? 'Very high' : score >= 75 ? 'High' : score >= 60 ? 'Moderate' : 'Building'

  return (
    <Panel title="Overall Trust" subtitle="Composite score across reputation and validation activity" className="tv7-overall-trust-panel">
      <div className="tv7-overall-trust">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Overall trust score: ${score === null ? 'no data yet' : score}`}>
          <circle cx={size / 2} cy={size / 2} r={r} className="tv7-score-ring-track" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            className="tv7-score-ring-fill"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={score === null ? circumference : offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          <text x="50%" y="45%" textAnchor="middle" className="tv7-score-ring-value">
            {score === null ? '—' : score}
          </text>
          <text x="50%" y="62%" textAnchor="middle" className="tv7-score-ring-max">
            / 100
          </text>
        </svg>

        <div className="tv7-overall-trust-details">
          <Badge variant={tier === 'Elite' ? 'success' : tier === 'Unregistered' || tier === 'New' ? 'muted' : 'accent'}>{tier}</Badge>

          <div className="tv7-overall-trust-row">
            <span className="tv7-overall-trust-label">Trend</span>
            <span className={`tv7-overall-trust-trend ${growing ? 'is-up' : !flat ? 'is-down' : ''}`}>
              {growing ? '↑ Trust Growth' : flat ? '→ Steady' : '↓ Slowing'}
            </span>
          </div>

          <div className="tv7-overall-trust-row">
            <span className="tv7-overall-trust-label">Confidence Level</span>
            <span className="tv7-overall-trust-value">{confidence}</span>
          </div>
        </div>
      </div>
    </Panel>
  )
}
