import { formatTokenAmount, shortAddr } from '../../../lib/format'

/** Bridge transaction preview — same `wv7-transfer-preview*` shape Transfer/Payments already use. */
export function BridgeSummary({ amount, token, sourceLabel, destLabel, recipient, fee, feeLoading, feeError, arrival }) {
  const feeText = feeLoading
    ? 'Estimating…'
    : feeError
    ? 'Unavailable'
    : fee?.feeFormatted != null
    ? `${formatTokenAmount(fee.feeFormatted, 6)} (network gas)`
    : '—'

  return (
    <div className="wv7-transfer-preview" aria-label="Bridge preview">
      <div className="wv7-transfer-preview-title">Bridge Preview</div>
      <div className="wv7-transfer-preview-row">
        <span>Bridging</span>
        <span className="mono">
          {amount} {token.symbol}
        </span>
      </div>
      <div className="wv7-transfer-preview-row">
        <span>Route</span>
        <span className="mono">
          {sourceLabel} → {destLabel}
        </span>
      </div>
      {recipient && (
        <div className="wv7-transfer-preview-row">
          <span>Recipient</span>
          <span className="mono">{shortAddr(recipient)}</span>
        </div>
      )}
      <div className="wv7-transfer-preview-row">
        <span>Estimated Fee</span>
        <span className="mono">{feeText}</span>
      </div>
      <div className="wv7-transfer-preview-row">
        <span>Estimated Time</span>
        <span className="mono">{arrival ? `${arrival.fast} – ${arrival.standard}` : '—'}</span>
      </div>
    </div>
  )
}
