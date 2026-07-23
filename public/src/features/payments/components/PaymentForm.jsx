import { Panel, FieldGroup, Input, Select, Button } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { formatTokenAmount, shortAddr } from '../../../lib/format'
import { formatFeeEstimate } from '../paymentsAnalytics'
import { IconZap } from '../../../ui/icons'

/**
 * Payment Form — recipient, amount, token selector, live fee estimate,
 * and a transaction preview, mirroring Transfer's form/preview shape
 * (`wv7-transfer-*` classes, same Panel/FieldGroup/Input primitives) so
 * Payments reads as part of the same Treasury surface rather than a new
 * visual language.
 *
 * Sprint 2 (Universal Payment Support): the token selector is now a real
 * dropdown over every entry in `PAYMENT_TOKENS` (Native/Custom/AI
 * Agent/DeFi — the same registry the Wallet page reads), instead of a
 * disabled USDC-only field. Any token added to that registry in the
 * future shows up here automatically.
 */
export function PaymentForm({
  to,
  amount,
  tokens,
  selectedToken,
  balance,
  signer,
  loading,
  submitted,
  formError,
  sendError,
  fee,
  feeLoading,
  feeError,
  onToChange,
  onAmountChange,
  onTokenChange,
  onMax,
  onSubmit,
}) {
  const toTrimmed = to.trim()

  return (
    <Panel
      icon={<IconZap width={18} height={18} />}
      title="Payment Form"
      subtitle="Send any tracked asset on Arc Testnet"
      className="wv7-transfer-form-panel"
    >
      <div className="wv7-transfer-balance-row">
        <span className="wv7-transfer-balance-label">Available balance</span>
        <span className="wv7-transfer-balance-value mono">
          {formatTokenAmount(balance, 4)} {selectedToken.symbol}
        </span>
      </div>

      <FieldGroup label="Recipient address">
        <Input
          type="text"
          placeholder="0x..."
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          disabled={loading}
        />
      </FieldGroup>

      <FieldGroup label="Token">
        <Select
          value={selectedToken.key}
          onChange={(e) => onTokenChange(e.target.value)}
          disabled={loading}
          aria-label="Token"
        >
          {tokens.map((token) => (
            <option key={token.key} value={token.key}>
              {token.symbol} — {token.name}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <FieldGroup label="Amount">
        <div style={{ display: 'flex', gap: 8 }}>
          <Input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} disabled={loading} />
          <Button variant="secondary" size="sm" onClick={onMax} disabled={loading || balance === null}>
            Max
          </Button>
        </div>
      </FieldGroup>

      {toTrimmed && amount && Number(amount) > 0 && (
        <div className="wv7-transfer-preview" aria-label="Transaction preview">
          <div className="wv7-transfer-preview-title">Transaction Preview</div>
          <div className="wv7-transfer-preview-row">
            <span>Sending</span>
            <span className="mono">
              {amount} {selectedToken.symbol}
            </span>
          </div>
          <div className="wv7-transfer-preview-row">
            <span>To</span>
            <span className="mono">{shortAddr(toTrimmed)}</span>
          </div>
          <div className="wv7-transfer-preview-row">
            <span>Estimated fee</span>
            <span className="mono">{formatFeeEstimate(fee, feeLoading, feeError)}</span>
          </div>
          <div className="wv7-transfer-preview-row">
            <span>Network</span>
            <span>Arc Testnet</span>
          </div>
        </div>
      )}

      {(formError || sendError) && (
        <Alert variant="error" title="Payment failed">
          {formError || sendError}
        </Alert>
      )}

      <div className="wv7-transfer-progress" aria-live="polite">
        <Button variant="primary" block loading={loading} onClick={onSubmit} disabled={loading || !signer || submitted}>
          {submitted ? '✓ Sent' : `Send ${selectedToken.symbol}`}
        </Button>
        {!signer && (
          <p className="field-hint" style={{ marginTop: 10, textAlign: 'center' }}>
            Connect your wallet to send a payment
          </p>
        )}
      </div>
    </Panel>
  )
}
