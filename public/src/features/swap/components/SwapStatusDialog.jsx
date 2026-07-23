import { Dialog } from '../../../ui/Dialog'
import { Badge, Button } from '../../../ui/design-system'
import { CopyButton } from '../../../ui/CopyButton'
import { shortHash } from '../../../lib/format'
import { IconCheck, IconAlertTriangle } from '../../../ui/icons'
import { classifySwapError, SWAP_ERROR_LABEL, SWAP_ERROR_DESCRIPTION } from '../services/swapErrors'

/**
 * Swap Status Dialog — the Sprint 4 brief's "Success dialog" and "Failure
 * dialog" combined into one component driven by `status`, same shape as
 * Payments' `PaymentSuccessDialog` (Badge + explorer link) extended with
 * Bridge's failure-state pattern (classified error + technical details).
 */
export function SwapStatusDialog({ open, status, txHash, explorerUrl, amountIn, amountOut, tokenIn, tokenOut, error, onClose }) {
  const failed = status === 'error'
  const succeeded = status === 'success'

  const classified = failed && error ? classifySwapError(error) : null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={failed ? 'Swap failed' : 'Swap complete'}
      footer={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Badge variant={failed ? 'error' : 'success'} size="sm" dot={!failed}>
          {failed ? (
            <>
              <IconAlertTriangle width={12} height={12} /> Failed
            </>
          ) : (
            <>
              <IconCheck width={12} height={12} /> Confirmed on-chain
            </>
          )}
        </Badge>

        {succeeded && (
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Swapped <span className="mono">{amountIn} {tokenIn}</span> for{' '}
            <span className="mono">{amountOut ? `${amountOut} ${tokenOut}` : tokenOut}</span>
          </div>
        )}

        {failed && (
          <div className="brg-result-panel brg-result-panel-error" role="alert">
            <IconAlertTriangle width={18} height={18} />
            <div>
              <p className="brg-result-title">{classified?.kind ? SWAP_ERROR_LABEL[classified.kind] : 'Swap failed'}</p>
              <p className="brg-result-desc">
                {classified?.kind ? SWAP_ERROR_DESCRIPTION[classified.kind] : error}
              </p>
              <details className="brg-error-details">
                <summary>Technical details</summary>
                <span className="mono">{error}</span>
              </details>
            </div>
          </div>
        )}

        {txHash && (
          <div className="brg-tx-row">
            <a
              href={explorerUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
              aria-disabled={!explorerUrl}
            >
              View transaction ({shortHash(txHash)}) ↗
            </a>
            <CopyButton value={txHash} label="Copy hash" />
          </div>
        )}
      </div>
    </Dialog>
  )
}
