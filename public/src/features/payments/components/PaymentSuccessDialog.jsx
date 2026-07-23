import { Dialog } from '../../../ui/Dialog'
import { Badge, Button } from '../../../ui/design-system'
import { shortHash } from '../../../lib/format'
import { IconCheck } from '../../../ui/icons'

/**
 * Success dialog shown after a payment confirms on-chain. Same
 * confirmation language as Transfer's inline banner (Badge + explorer
 * link), just in a modal — the acceptance criteria for Payments calls
 * for a dedicated success dialog rather than an inline confirmation.
 * Sprint 2: shows whichever token symbol was actually sent.
 */
export function PaymentSuccessDialog({ open, txHash, amount, tokenSymbol, to, arcExplorer, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Payment sent"
      footer={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Badge variant="success" size="sm">
          <IconCheck width={12} height={12} /> Confirmed on-chain
        </Badge>

        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Sent <span className="mono">{amount} {tokenSymbol}</span> to <span className="mono">{to}</span>
        </div>

        {txHash && (
          <a href={`${arcExplorer}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
            View transaction ({shortHash(txHash)}) ↗
          </a>
        )}
      </div>
    </Dialog>
  )
}
