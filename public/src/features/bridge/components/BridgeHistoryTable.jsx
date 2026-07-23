import { Panel, Badge, EmptyState } from '../../../ui/design-system'
import { CopyButton } from '../../../ui/CopyButton'
import { shortHash, formatDate, formatTime } from '../../../lib/format'
import { IconBridge, IconExternal } from '../../../ui/icons'
import { bridgeStatusLabel } from '../services/bridgeHistoryService'

function statusBadge(status) {
  if (status === 'completed') return <Badge variant="success" size="sm">{bridgeStatusLabel(status)}</Badge>
  if (status === 'failed') return <Badge variant="error" size="sm">{bridgeStatusLabel(status)}</Badge>
  return (
    <Badge variant="pending" size="sm">
      {bridgeStatusLabel(status)}
    </Badge>
  )
}

/** Bridge History — same `wv7-table*` visual language as Payments/Wallet, plus a route column. */
export function BridgeHistoryTable({ bridges, arcExplorer }) {
  return (
    <Panel title="Bridge History" subtitle="Bridge transfers initiated from this wallet" className="wv7-tx-panel">
      {bridges.length === 0 ? (
        <EmptyState
          icon={<IconBridge width={22} height={22} />}
          title="No bridges yet"
          description="Bridges you initiate will appear here."
        />
      ) : (
        <div className="wv7-table-wrap">
          <table className="wv7-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Route</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {bridges.map((item) => (
                <tr key={item.id} className="wv7-table-row">
                  <td className="mono">
                    {item.hash ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {shortHash(item.hash)}
                        <CopyButton value={item.hash} label="Copy" />
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="brg-history-route">
                    {item.sourceNetwork} <span className="brg-route-arrow" aria-hidden="true">→</span> {item.destinationNetwork}
                  </td>
                  <td className="mono">
                    {item.amount} {item.tokenSymbol}
                  </td>
                  <td>{statusBadge(item.status)}</td>
                  <td>
                    {formatDate(item.timestamp)} <span className="text-muted">{formatTime(item.timestamp)}</span>
                  </td>
                  <td>
                    {item.hash ? (
                      <a href={`${arcExplorer}/tx/${item.hash}`} target="_blank" rel="noopener noreferrer" className="wv7-table-link" aria-label="View on explorer">
                        <IconExternal width={14} height={14} />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
