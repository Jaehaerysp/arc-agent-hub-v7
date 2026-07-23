import { Panel, Grid } from '../../../ui/design-system'

/** Same dependency-free animated-in bar chart pattern as Jobs v7's JobsAnalyticsPanel — no chart library, pure SVG-free CSS bars. */
function BarChart({ data, valueKey = 'value', labelKey = 'label', suffix = '' }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]))

  return (
    <div className="tv7-bar-chart" role="img" aria-label={data.map((d) => `${d[labelKey]}: ${d[valueKey]}${suffix}`).join(', ')}>
      {data.map((d, i) => (
        <div className="tv7-bar-row" key={d.key || d[labelKey]}>
          <span className="tv7-bar-label">{d[labelKey]}</span>
          <div className="tv7-bar-track">
            <div className="tv7-bar-fill" style={{ width: `${Math.max(3, (d[valueKey] / max) * 100)}%`, transitionDelay: `${i * 60}ms` }} />
          </div>
          <span className="tv7-bar-value">
            {d[valueKey]}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Dual-series bar chart (Jobs vs Trust events per month), pure SVG. */
function DualBarChart({ jobs, trust }) {
  const width = 320
  const height = 140
  const pad = 20
  const months = jobs.length
  const max = Math.max(1, ...jobs.map((j) => j.value), ...trust.map((t) => t.value))
  const groupWidth = (width - pad * 2) / months
  const barWidth = groupWidth / 3

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="tv7-dual-bar-chart"
      role="img"
      aria-label="Jobs versus trust events per month"
    >
      {jobs.map((j, i) => {
        const t = trust[i]
        const x = pad + i * groupWidth
        const jobHeight = (j.value / max) * (height - 30)
        const trustHeight = (t.value / max) * (height - 30)
        return (
          <g key={j.key}>
            <rect x={x} y={height - 20 - jobHeight} width={barWidth} height={jobHeight} className="tv7-dual-bar-jobs" rx="2" />
            <rect x={x + barWidth + 2} y={height - 20 - trustHeight} width={barWidth} height={trustHeight} className="tv7-dual-bar-trust" rx="2" />
            <text x={x + barWidth} y={height - 6} textAnchor="middle" className="tv7-dual-bar-label">
              {j.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Donut chart for feedback-type network distribution — pure SVG, no library. */
function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const size = 120
  const stroke = 18
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  let offsetAcc = 0

  const colorClasses = ['tv7-donut-slice-1', 'tv7-donut-slice-2', 'tv7-donut-slice-3']

  return (
    <div className="tv7-donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
        {total === 0 ? (
          <circle cx={size / 2} cy={size / 2} r={r} className="tv7-ring-track" strokeWidth={stroke} fill="none" />
        ) : (
          data.map((d, i) => {
            const fraction = d.value / total
            const dash = circumference * fraction
            const gap = circumference - dash
            const rotation = (offsetAcc / total) * 360
            offsetAcc += d.value
            return (
              <circle
                key={d.key}
                cx={size / 2}
                cy={size / 2}
                r={r}
                className={colorClasses[i % colorClasses.length]}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(${rotation - 90} ${size / 2} ${size / 2})`}
              />
            )
          })
        )}
      </svg>
      <ul className="tv7-donut-legend">
        {data.map((d, i) => (
          <li key={d.key} className={colorClasses[i % colorClasses.length]}>
            <span className="tv7-donut-swatch" /> {d.label} ({d.value})
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Trust Analytics — five SVG-only blocks: Trust Growth, Validation
 * Success, Monthly Reputation, Jobs vs Trust, Network Distribution.
 * Every block is fed data already computed once in TrustCenterPage; no
 * chart library is used anywhere in this file, per the Mission 7 brief.
 */
export function TrustAnalyticsPanel({ monthlyTrust, monthlyJobs, successRing, networkDistribution }) {
  return (
    <Panel title="Trust Analytics" subtitle="Growth, validation, and reputation trends over time" className="tv7-analytics-panel">
      <Grid columns={2} minColWidth="320px" gap="lg">
        <div className="tv7-analytics-block">
          <div className="tv7-analytics-block-title">Trust Growth</div>
          {monthlyTrust.every((m) => m.value === 0) ? (
            <p className="tv7-analytics-empty">No trust activity recorded yet this period.</p>
          ) : (
            <BarChart data={monthlyTrust} />
          )}
        </div>

        <div className="tv7-analytics-block tv7-analytics-block-rings">
          <div className="tv7-analytics-block-title">Validation Success</div>
          <div className="tv7-ring-chart">
            <svg width={96} height={96} viewBox="0 0 96 96" role="img" aria-label={`Validation success: ${successRing === null ? 'no data yet' : successRing + '%'}`}>
              <circle cx="48" cy="48" r="40" className="tv7-ring-track" strokeWidth="8" fill="none" />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="tv7-ring-fill"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={successRing === null ? 2 * Math.PI * 40 : 2 * Math.PI * 40 * (1 - successRing / 100)}
                transform="rotate(-90 48 48)"
              />
              <text x="50%" y="55%" textAnchor="middle" className="tv7-ring-value">
                {successRing === null ? '—' : `${successRing}%`}
              </text>
            </svg>
            <div className="tv7-ring-caption">
              <div className="tv7-ring-label">Requests succeeding</div>
            </div>
          </div>
        </div>

        <div className="tv7-analytics-block">
          <div className="tv7-analytics-block-title">Monthly Reputation</div>
          {monthlyTrust.every((m) => m.value === 0) ? (
            <p className="tv7-analytics-empty">No feedback or validation activity yet.</p>
          ) : (
            <BarChart data={monthlyTrust} suffix=" events" />
          )}
        </div>

        <div className="tv7-analytics-block">
          <div className="tv7-analytics-block-title">Jobs vs Trust</div>
          {monthlyJobs.every((m) => m.value === 0) && monthlyTrust.every((m) => m.value === 0) ? (
            <p className="tv7-analytics-empty">No job or trust activity recorded yet.</p>
          ) : (
            <>
              <DualBarChart jobs={monthlyJobs} trust={monthlyTrust} />
              <div className="tv7-dual-bar-legend">
                <span className="tv7-dual-bar-legend-item"><span className="tv7-dual-bar-swatch tv7-dual-bar-jobs" /> Jobs</span>
                <span className="tv7-dual-bar-legend-item"><span className="tv7-dual-bar-swatch tv7-dual-bar-trust" /> Trust events</span>
              </div>
            </>
          )}
        </div>

        <div className="tv7-analytics-block tv7-analytics-block-rings">
          <div className="tv7-analytics-block-title">Network Distribution</div>
          {networkDistribution.every((d) => d.value === 0) ? (
            <p className="tv7-analytics-empty">No feedback submitted yet.</p>
          ) : (
            <DonutChart data={networkDistribution} />
          )}
        </div>
      </Grid>
    </Panel>
  )
}
