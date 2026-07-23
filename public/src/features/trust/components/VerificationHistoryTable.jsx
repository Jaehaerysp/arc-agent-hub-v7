import { Panel, EmptyState, Badge } from '../../../ui/design-system'
import { Table, TableWrap } from '../../../ui/Table'
import { formatDate, shortHash, shortAddr } from '../../../lib/format'
import { IconLayers } from '../../../ui/icons'

/**
 * Verification History — a dense table of every feedback + validation
 * event logged locally, columns: Type / Validator / Transaction / Date /
 * Status / Chain. "Validator" shows the validator address for
 * validation events, or the feedback type (Peer/Validator/Community)
 * for feedback events, since feedback has no counterpart address.
 */
export function VerificationHistoryTable({ events, arcExplorer, chainLabel = 'Arc Testnet' }) {
  return (
    <Panel title="Verification History" subtitle="Every feedback and validation event recorded for this wallet" className="tv7-history-panel">
      {events.length === 0 ? (
        <EmptyState
          icon={<IconLayers width={20} height={20} />}
          title="No verification history yet"
          description="Feedback and validation events will be listed here as they happen."
        />
      ) : (
        <TableWrap>
          <Table density="dense">
            <thead>
              <tr>
                <th>Type</th>
                <th>Validator</th>
                <th>Transaction</th>
                <th>Date</th>
                <th>Status</th>
                <th>Chain</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.type === 'validation' ? 'Validation' : 'Reputation'}</td>
                  <td className="mono">{e.type === 'validation' ? shortAddr(e.validator) : e.feedbackType || '—'}</td>
                  <td>
                    {e.txHash ? (
                      <a href={`${arcExplorer}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer" className="mono">
                        {shortHash(e.txHash)}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{formatDate(e.timestamp)}</td>
                  <td>
                    <Badge variant={e.status === 'success' ? 'success' : 'error'} size="sm">
                      {e.status === 'success' ? 'Confirmed' : 'Failed'}
                    </Badge>
                  </td>
                  <td>{chainLabel}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </Panel>
  )
}
