import { Panel, Badge, EmptyState } from '../../../ui/design-system'
import { shortHash, formatDate, formatTime } from '../../../lib/format'
import { IconZap, IconExternal } from '../../../ui/icons'

function statusBadge(status) {
  if (status === 'success') return <Badge variant="success" size="sm">Success</Badge>
  if (status === 'error') return <Badge variant="error" size="sm">Failed</Badge>
  return <Badge variant="muted" size="sm">Pending</Badge>
}

/**
 * Payment History — same `wv7-table*` visual language as Wallet's Recent
 * Transactions and Transfer's History table. Data comes from
 * `paymentsAnalytics.computePaymentHistory`, which filters
 * `wallet.activity` down to `type: 'payment'` entries only.
 */
export function PaymentHistoryTable({ payments, arcExplorer }) {
  return (
    <Panel title="Payment History" subtitle="Payments sent from this wallet" className="wv7-tx-panel">
      {payments.length === 0 ? (
        <EmptyState
          icon={<IconZap width={22} height={22} />}
          title="No payments yet"
          description="Payments you send will appear here."
        />
      ) : (
        <div className="wv7-table-wrap">
          <table className="wv7-table">
            <thead>
              <tr>
                <th>Hash</th>
                <th>Detail</th>
                <th>Status</th>
                <th>Date</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item.id} className="wv7-table-row">
                  <td className="mono">{item.hash ? shortHash(item.hash) : '—'}</td>
                  <td>{item.detail}</td>
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
