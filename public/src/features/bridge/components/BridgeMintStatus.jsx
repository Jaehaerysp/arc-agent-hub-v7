import { Badge } from '../../../ui/design-system'

const POLL_INTERVAL_SECONDS = 5
const MAX_TIMEOUT_SECONDS = 5 * 60

/**
 * Sub-status shown inside BridgeStatusDialog while this app polls Circle's
 * Iris service (`waiting_attestation`) and while the mint transaction is
 * in flight (`minting`). Purely presentational — all the actual polling
 * state (`attempt`, `phase`) comes from `useAttestation.js` by way of
 * `useBridge.js`; this component just renders it.
 */
export function BridgeMintStatus({ status, attestationPhase, attestationAttempt }) {
  if (status !== 'switching_network' && status !== 'waiting_attestation' && status !== 'minting') {
    return null
  }

  const elapsedSeconds = attestationAttempt > 0 ? (attestationAttempt - 1) * POLL_INTERVAL_SECONDS : 0
  const remainingSeconds = Math.max(MAX_TIMEOUT_SECONDS - elapsedSeconds, 0)
  const remainingLabel = remainingSeconds >= 60 ? `~${Math.ceil(remainingSeconds / 60)} min` : `~${remainingSeconds}s`

  const label =
    status === 'switching_network'
      ? 'Waiting for your wallet to switch networks…'
      : status === 'minting'
        ? 'Submitting the mint transaction on the destination chain…'
        : attestationPhase === 'timeout'
          ? "Circle's attestation is taking longer than expected"
          : 'Waiting for Circle to attest the burn…'

  const isTimeout = attestationPhase === 'timeout'

  return (
    <div className={`brg-mint-status ${isTimeout ? 'is-timeout' : ''}`} role="status" aria-live="polite">
      <div className="brg-mint-status-row">
        {!isTimeout && <span className="brg-pulse-dot" aria-hidden="true" />}
        <span className="brg-mint-status-label">{label}</span>
      </div>

      {status === 'waiting_attestation' && attestationPhase === 'polling' && (
        <div className="brg-mint-status-poll">
          <Badge variant="muted" size="sm">
            Poll #{attestationAttempt}
          </Badge>
          <span className="brg-mint-status-remaining">Estimated remaining: {remainingLabel}</span>
        </div>
      )}
    </div>
  )
}
