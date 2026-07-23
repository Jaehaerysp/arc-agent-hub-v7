import { Panel, Badge, EmptyState } from '../../../ui/design-system'
import { shortHash, formatDate, formatTime } from '../../../lib/format'
import { formatSwapAmount, swapStatusLabel } from '../services/swapHistoryService'
import { IconSwap, IconExternal } from '../../../ui/icons'

function statusBadge(status) {
  if (status === 'success') return <Badge variant="success" size="sm">{swapStatusLabel(status)}</Badge>
  if (status === 'error') return <Badge variant="error" size="sm">{swapStatusLabel(status)}</Badge>
  return <Badge variant="muted" size="sm">{swapStatusLabel(status)}</Badge>
}

/**
 * Swap History — same `wv7-table*` visual language as Wallet's Recent
 * Transactions, Payment History, and Bridge History. Data comes from
 * `swapHistoryService.computeSwapHistory`, which filters `wallet.activity`
 * down to `type: 'swap'` entries only — no separate history store.
 */
export function SwapHistory({ swaps, arcExplorer }) {
  return (
    <Panel title="Swap History" subtitle="Swaps executed from this wallet" className="wv7-tx-panel">
      {swaps.length === 0 ? (
        <EmptyState
          icon={<IconSwap width={22} height={22} />}
          title="No swaps yet"
          description="Swaps you execute will appear here."
        />
      ) : (
        <div className="wv7-table-wrap">
          <table className="wv7-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Pair</th>
                <th>Amount In</th>
                <th>Amount Out</th>
                <th>Status</th>
                <th>Date</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {swaps.map((item) => (
                <tr key={item.id} className="wv7-table-row">
                  <td className="mono">{item.hash ? shortHash(item.hash) : '—'}</td>
                  <td>
                    {item.tokenIn} → {item.tokenOut}
                  </td>
                  <td className="mono">{formatSwapAmount(item.amountIn, item.tokenIn)}</td>
                  <td className="mono">{item.amountOut ? formatSwapAmount(item.amountOut, item.tokenOut) : '—'}</td>
                  <td>{statusBadge(item.status)}</td>
                  <td>
                    {formatDate(item.timestamp)} <span className="text-muted">{formatTime(item.timestamp)}</span>
                  </td>
                  <td>
                    {item.hash ? (
                      <a
                        href={`${arcExplorer}/tx/${item.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wv7-table-link"
                        aria-label="View on explorer"
                      >
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
