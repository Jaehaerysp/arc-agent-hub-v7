import { Panel, Grid } from '../../../ui/design-system'

/** Simple, dependency-free animated-in bar chart. Draws in once (Blueprint Motion System: charts never re-animate on re-render). */
function BarChart({ data, valueKey = 'value', labelKey = 'label', suffix = '' }) {
  const max = Math.max(1, ...data.map((d) => d[valueKey]))

  return (
    <div className="dv7-bar-chart" role="img" aria-label={data.map((d) => `${d[labelKey]}: ${d[valueKey]}${suffix}`).join(', ')}>
      {data.map((d, i) => (
        <div className="dv7-bar-row" key={d.key || d[labelKey]}>
          <span className="dv7-bar-label">{d[labelKey]}</span>
          <div className="dv7-bar-track">
            <div
              className="dv7-bar-fill"
              style={{ width: `${Math.max(3, (d[valueKey] / max) * 100)}%`, transitionDelay: `${i * 60}ms` }}
            />
          </div>
          <span className="dv7-bar-value">
            {d[valueKey]}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Bounded-completion ring — only ever used for a genuine percentage-of-a-whole, per the Blueprint's Charts table. */
function RingChart({ percent, label, sub }) {
  const size = 96
  const stroke = 8
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = percent === null ? 0 : Math.max(0, Math.min(100, percent))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className="dv7-ring-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${percent === null ? 'no data yet' : percent + '%'}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="dv7-ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="dv7-ring-fill"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={percent === null ? circumference : offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="47%" textAnchor="middle" className="dv7-ring-value">
          {percent === null ? '—' : `${percent}%`}
        </text>
      </svg>
      <div className="dv7-ring-caption">
        <div className="dv7-ring-label">{label}</div>
        <div className="dv7-ring-sub">{sub}</div>
      </div>
    </div>
  )
}

/**
 * Four supporting-context charts — Activity, Jobs, Trust, Validation — all
 * built from data the page already has (no new on-chain reads), following
 * the Blueprint's Bar/Ring rules: bars for counts across categories, rings
 * only for genuine percentages of a whole.
 */
export function MissionAnalytics({ activityBreakdown, jobsBreakdown, trust, validation }) {
  return (
    <Panel title="Analytics" subtitle="Activity, jobs, trust, and validation at a glance" className="dv7-analytics-panel">
      <Grid columns={2} minColWidth="320px" gap="lg">
        <div className="dv7-analytics-block">
          <div className="dv7-analytics-block-title">Activity</div>
          {activityBreakdown.length === 0 ? (
            <p className="dv7-analytics-empty">No activity recorded yet — actions you take will show up here.</p>
          ) : (
            <BarChart data={activityBreakdown} valueKey="count" labelKey="label" />
          )}
        </div>

        <div className="dv7-analytics-block">
          <div className="dv7-analytics-block-title">Jobs</div>
          <BarChart data={jobsBreakdown} valueKey="value" labelKey="label" />
        </div>

        <div className="dv7-analytics-block dv7-analytics-block-rings">
          <div className="dv7-analytics-block-title">Trust</div>
          <RingChart
            percent={trust.rate}
            label="Provider trust"
            sub={trust.rate === null ? 'Deliver a job to start building this' : `${trust.completed} completed · ${trust.rejected} rejected`}
          />
        </div>

        <div className="dv7-analytics-block dv7-analytics-block-rings">
          <div className="dv7-analytics-block-title">Validation</div>
          <RingChart
            percent={validation.rate}
            label="Hire approval rate"
            sub={validation.rate === null ? 'Hire and settle a job to start building this' : `${validation.completed} approved · ${validation.rejected} rejected`}
          />
        </div>
      </Grid>
    </Panel>
  )
}
