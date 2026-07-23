import { Card } from '../../../ui/Card'
import { Skeleton } from '../../../ui/Skeleton'
import { IconAgent, IconJob, IconStar, IconWallet, IconLayers, IconActivity } from '../../../ui/icons'
import { computeOverallStatus } from '../dashboardLogic'

// These cells are derived from the jobs feed — skeleton them on first load
// rather than flashing a misleading "0" / "Nothing running" before data arrives.
const JOBS_DERIVED_CELLS = new Set(['jobsRunning', 'trust', 'escrow', 'system'])

const ICONS = {
  agent: IconAgent,
  job: IconJob,
  star: IconStar,
  wallet: IconWallet,
  layers: IconLayers,
  activity: IconActivity,
}

function StatusCell({ cell, loading }) {
  const Icon = ICONS[cell.icon]
  const skeletonize = loading && JOBS_DERIVED_CELLS.has(cell.key)

  return (
    <div className="mc-status-cell" data-tone={cell.status}>
      <div className="mc-status-cell-top">
        <span className="mc-status-cell-icon">
          <Icon width={14} height={14} />
        </span>
        <span className="mc-status-cell-label">{cell.label}</span>
      </div>

      {skeletonize ? (
        <Skeleton width={54} height={20} />
      ) : (
        <div className="mc-status-cell-value">{cell.value}</div>
      )}

      <div className="mc-status-cell-footer">
        <span className="mc-status-dot" data-tone={cell.status} />
        {skeletonize ? <Skeleton width={80} height={12} /> : <span className="mc-status-cell-sub">{cell.sub}</span>}
      </div>

      {!skeletonize && typeof cell.percent === 'number' && (
        <div className="mc-status-cell-bar">
          <div className="mc-status-cell-bar-fill" data-tone={cell.status} style={{ width: `${Math.max(4, Math.min(100, cell.percent))}%` }} />
        </div>
      )}
    </div>
  )
}

export function MissionStatusStrip({ cells, loading = false }) {
  const overall = computeOverallStatus(cells)

  return (
    <Card variant="hero" className="mc-status-strip" data-tone={overall.tone}>
      <div className="mc-status-strip-header">
        <div className="mc-status-strip-heading">
          <span className="mc-status-dot mc-status-dot-lg" data-tone={overall.tone} />
          <h2>Mission Status</h2>
        </div>
        <span className={`mc-status-overall-label mc-status-overall-${overall.tone}`}>{overall.label}</span>
      </div>

      <div className="mc-status-cells">
        {cells.map((cell) => (
          <StatusCell key={cell.key} cell={cell} loading={loading} />
        ))}
      </div>
    </Card>
  )
}
