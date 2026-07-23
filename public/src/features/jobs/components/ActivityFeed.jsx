import { Card } from '../../../ui/Card'
import { EmptyState } from '../../../ui/EmptyState'
import { formatTime, shortHash } from '../../../lib/format'
import { IconActivity } from '../../../ui/icons'

/**
 * Reusable recent-activity list, driven by the same wallet.activity /
 * addActivity feed useWallet() already tracks (localStorage-backed, entries
 * shaped { id, type, label, agentId?, detail?, txHash?, status, timestamp }).
 * DashboardPage shows every entry; JobsPage passes only type === 'job' ones
 * so the two pages don't duplicate this markup.
 */
export function ActivityFeed({ activity, arcExplorer, limit = 8, emptyTitle = 'No activity yet', emptyDescription }) {
  const items = activity.slice(0, limit)

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<IconActivity width={20} height={20} />}
          title={emptyTitle}
          description={emptyDescription}
        />
      </Card>
    )
  }

  return (
    <div className="activity-list">
      {items.map((item) => (
        <div key={item.id} className={`activity-item ${item.status}`}>
          <div className="activity-main">
            <div className="activity-title">{item.label}</div>
            {item.agentId && <div className="activity-agent">Agent #{item.agentId}</div>}
            {item.detail && <div className="activity-detail">{item.detail}</div>}
          </div>
          <div className="activity-meta">
            {item.txHash && (
              <a
                href={`${arcExplorer}/tx/${item.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                {shortHash(item.txHash)}
              </a>
            )}
            <div className="activity-time">{formatTime(item.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
