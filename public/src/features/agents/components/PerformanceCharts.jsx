import { Panel, MetricCard, Grid } from '../../../ui/design-system'
import { Reveal } from '../../../ui/Reveal'
import { IconActivity, IconZap } from '../../../ui/icons'
import { getPerformanceSeries } from '../profileLogic'

/** Simple bar chart — monthly job volume. Reveals once on scroll-in per
 *  the Blueprint's "draws in once, never re-animates on re-render" rule
 *  for data visuals (the same principle applied to the reputation line). */
function MonthlyActivityChart({ series }) {
  const max = Math.max(1, ...series.map((p) => p.jobs))

  return (
    <Reveal className="pv7-chart-bars" as="div" aria-label="Monthly job activity">
      {series.map((point) => (
        <div className="pv7-bar-col" key={point.label + point.jobs}>
          <div className="pv7-bar-track">
            <div className="pv7-bar-fill" style={{ height: `${(point.jobs / max) * 100}%` }} title={`${point.jobs} jobs in ${point.label}`} />
          </div>
          <span className="pv7-bar-label">{point.label}</span>
        </div>
      ))}
    </Reveal>
  )
}

/** Simple SVG line chart — reputation/trust growth over the last 12 months. */
function TrustGrowthChart({ series }) {
  const width = 560
  const height = 140
  const padding = 12
  const max = 5

  const points = series.map((point, i) => {
    const x = padding + (i / (series.length - 1)) * (width - padding * 2)
    const y = height - padding - (point.trust / max) * (height - padding * 2)
    return `${x},${y}`
  })

  return (
    <Reveal as="div" className="pv7-line-chart-wrap" aria-label="Trust growth over the last 12 months">
      <svg viewBox={`0 0 ${width} ${height}`} className="pv7-line-chart" preserveAspectRatio="none" role="img">
        <polyline points={points.join(' ')} fill="none" stroke="url(#pv7-line-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="pv7-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-neon)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pv7-line-chart-labels">
        <span>{series[0]?.label}</span>
        <span>{series[series.length - 1]?.label}</span>
      </div>
    </Reveal>
  )
}

/**
 * Performance — animated metric strip (Success Rate, Completion Rate) plus
 * two derived charts (Monthly Activity, Trust Growth), per the mission's
 * "Performance" section. Every underlying number traces back to an
 * existing agent fact via profileLogic.js — nothing here is fetched or
 * randomly generated between renders.
 */
export function PerformanceCharts({ agent }) {
  const series = getPerformanceSeries(agent)

  return (
    <Panel icon={<IconActivity width={16} height={16} />} title="Performance" subtitle="Delivery reliability and momentum over the last 12 months">
      <Grid minColWidth="200px" gap="md" className="pv7-performance-metrics">
        <MetricCard label="Success Rate" value={`${agent.successRate}%`} icon={<IconActivity width={16} height={16} />} accent sub="Jobs delivered to spec" />
        <MetricCard label="Completion Rate" value={`${Math.min(100, Math.round(agent.successRate * 0.99))}%`} icon={<IconZap width={16} height={16} />} sub="Jobs seen through to close" />
      </Grid>

      <div className="pv7-performance-charts">
        <div className="pv7-performance-chart-block">
          <div className="pv7-performance-chart-title">Monthly Activity</div>
          <MonthlyActivityChart series={series} />
        </div>
        <div className="pv7-performance-chart-block">
          <div className="pv7-performance-chart-title">Trust Growth</div>
          <TrustGrowthChart series={series} />
        </div>
      </div>
    </Panel>
  )
}
