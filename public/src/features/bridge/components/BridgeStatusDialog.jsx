import { useEffect, useRef } from 'react'
import { Dialog } from '../../../ui/Dialog'
import { Badge, Button } from '../../../ui/design-system'
import { CopyButton } from '../../../ui/CopyButton'
import { shortHash } from '../../../lib/format'
import { IconCheck, IconAlertTriangle, IconExternal } from '../../../ui/icons'
import { BRIDGE_STATUS, bridgeStatusLabel } from '../services/bridgeHistoryService'
import { classifyBridgeError, BRIDGE_ERROR_LABEL, BRIDGE_ERROR_DESCRIPTION } from '../services/bridgeErrors'
import { bridgeNetworkExplorerTxUrl } from '../../../chains/bridgeNetworks'
import { BridgeMintStatus } from './BridgeMintStatus'

const STEP_STATUSES = BRIDGE_STATUS.filter((s) => s !== 'failed')

/**
 * Bridge status dialog -- shows the full Sprint 3.2 pipeline as a stepper
 * (Pending through Completed, burn *and* mint), both the burn tx (Arc
 * explorer) and mint tx (destination explorer) once each exists, and a
 * live "waiting for Iris" sub-status (BridgeMintStatus) while polling.
 *
 * `destinationNetwork` is the full BridgeNetwork object (chains/
 * bridgeNetworks.js) -- needed for its `explorerUrl` to link the mint tx,
 * since that's a different chain than the burn's.
 *
 * Purely presentational component -- none of the status transitions,
 * polling, or transaction logic here changed; this only reshapes how an
 * existing `status`/`error`/`mintTx` are rendered.
 */
export function BridgeStatusDialog({
  open,
  status,
  txHash,
  mintTx,
  amount,
  tokenSymbol,
  sourceLabel,
  destLabel,
  arcExplorer,
  destinationNetwork,
  attestationPhase,
  attestationAttempt,
  error,
  onClose,
}) {
  const failed = status === 'failed'
  const completed = status === 'completed'
  const currentIndex = STEP_STATUSES.indexOf(status)
  const errorInfo = failed && error ? classifyBridgeError(error) : null
  const mintExplorerUrl = destinationNetwork && mintTx ? bridgeNetworkExplorerTxUrl(destinationNetwork, mintTx) : null
  const bodyRef = useRef(null)

  // Escape-to-close + initial focus, scoped to this dialog only -- Dialog.jsx
  // itself is a shared primitive used across the app and is left untouched.
  useEffect(() => {
    if (!open) return
    bodyRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={failed ? 'Bridge failed' : completed ? 'Bridge complete' : 'Bridge in progress'}
      footer={
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="brg-dialog-body" ref={bodyRef} tabIndex={-1}>
        {!failed && (
          <ol className="brg-stepper" aria-label="Bridge status">
            {STEP_STATUSES.map((step, i) => {
              const isDone = i < currentIndex || completed
              const isCurrent = i === currentIndex && !completed
              return (
                <li
                  key={step}
                  className={`brg-step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="brg-step-dot" aria-hidden="true">
                    {isDone ? <IconCheck width={11} height={11} /> : i + 1}
                  </span>
                  <span className="brg-step-label">{bridgeStatusLabel(step)}</span>
                </li>
              )
            })}
          </ol>
        )}

        <div className="brg-status-row">
          <Badge variant={failed ? 'error' : completed ? 'success' : 'muted'} size="sm" dot={!failed}>
            {failed ? (
              <>
                <IconAlertTriangle width={12} height={12} /> Failed
              </>
            ) : (
              bridgeStatusLabel(status)
            )}
          </Badge>
          <span className="brg-route-summary">
            <span className="mono">
              {amount} {tokenSymbol}
            </span>{' '}
            <span className="brg-route-arrow" aria-hidden="true">→</span> <span className="mono">{sourceLabel}</span>{' '}
            <span className="brg-route-arrow" aria-hidden="true">→</span> <span className="mono">{destLabel}</span>
          </span>
        </div>

        {(txHash || mintTx) && (
          <div className="brg-tx-list">
            {txHash && (
              <div className="brg-tx-row">
                <a href={`${arcExplorer}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
                  Burn transaction ({shortHash(txHash)}) <IconExternal width={11} height={11} />
                </a>
                <CopyButton value={txHash} label="Copy hash" />
              </div>
            )}

            {mintTx && (
              <div className="brg-tx-row">
                {mintExplorerUrl ? (
                  <a href={mintExplorerUrl} target="_blank" rel="noopener noreferrer" className="tx-link">
                    Mint transaction ({shortHash(mintTx)}) <IconExternal width={11} height={11} />
                  </a>
                ) : (
                  <span className="mono brg-tx-static">Mint transaction: {shortHash(mintTx)}</span>
                )}
                <CopyButton value={mintTx} label="Copy hash" />
              </div>
            )}
          </div>
        )}

        <BridgeMintStatus status={status} attestationPhase={attestationPhase} attestationAttempt={attestationAttempt} />

        {failed && error && (
          <div className="brg-result-panel brg-result-panel-error" role="alert">
            <IconAlertTriangle width={18} height={18} />
            <div>
              <p className="brg-result-title">{errorInfo?.kind ? BRIDGE_ERROR_LABEL[errorInfo.kind] : 'Bridge failed'}</p>
              <p className="brg-result-desc">{errorInfo?.kind ? BRIDGE_ERROR_DESCRIPTION[errorInfo.kind] : error}</p>
              <details className="brg-error-details">
                <summary>Technical details</summary>
                <span className="mono">{error}</span>
              </details>
            </div>
          </div>
        )}

        {completed && (
          <div className="brg-result-panel brg-result-panel-success">
            <IconCheck width={18} height={18} />
            <p className="brg-result-desc">
              Funds have landed on {destLabel} -- the mint transaction above is confirmed on the destination chain.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  )
}
