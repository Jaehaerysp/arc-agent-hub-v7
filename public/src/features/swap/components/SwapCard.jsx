import { Panel, FieldGroup, Input, Button, Badge, IconButton } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { formatTokenAmount } from '../../../lib/format'
import { IconSwap } from '../../../ui/icons'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'
import { TokenSelector } from './TokenSelector'
import { classifySwapError, SWAP_ERROR_LABEL, SWAP_ERROR_DESCRIPTION } from '../services/swapErrors'

/**
 * Swap Card — the Universal Token Swap form: Token In, Amount + Max,
 * Switch Tokens, Token Out, live estimated output, network badge, and the
 * Swap button. Mirrors PaymentForm's/BridgeForm's shape and classes
 * (`wv7-transfer-*`) so Swap reads as part of the same Treasury surface
 * Wallet/Payments/Bridge already share, not a new visual language.
 */
export function SwapCard({
  tokens,
  tokenIn,
  tokenOut,
  amountIn,
  balance,
  quote,
  quoteLoading,
  quoteError,
  signer,
  isArcNetwork,
  loading,
  submitted,
  formError,
  swapError,
  onTokenInChange,
  onTokenOutChange,
  onSwitchTokens,
  onAmountChange,
  onMax,
  onSubmit,
}) {
  const classified = swapError ? classifySwapError(swapError) : null

  const estimatedOutput = quoteLoading
    ? 'Estimating…'
    : quoteError
    ? 'Unavailable'
    : quote?.estimatedOutput
    ? `${formatTokenAmount(Number(quote.estimatedOutput.amount), 6)} ${quote.estimatedOutput.token}`
    : '—'

  return (
    <Panel
      icon={<IconSwap width={18} height={18} />}
      title="Swap Form"
      subtitle="Exchange USDC and EURC on Arc Testnet"
      className="wv7-transfer-form-panel"
      actions={
        <Badge variant={isArcNetwork === false ? 'warning' : 'muted'} size="sm" dot={false}>
          {isArcNetwork === false ? 'Wrong network' : NETWORK_LABEL}
        </Badge>
      }
    >
      <div className="wv7-transfer-balance-row">
        <span className="wv7-transfer-balance-label">Available balance</span>
        <span className="wv7-transfer-balance-value mono">
          {formatTokenAmount(balance, 4)} {tokenIn?.symbol}
        </span>
      </div>

      <TokenSelector
        label="Token In"
        tokens={tokens}
        selectedKey={tokenIn?.key}
        excludeKey={tokenOut?.key}
        disabled={loading}
        onChange={onTokenInChange}
      />

      <FieldGroup label="Amount">
        <div className="swap-amount-row">
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="0.00"
            value={amountIn}
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={loading}
            aria-label="Swap amount"
          />
          <Button variant="secondary" size="sm" onClick={onMax} disabled={loading || balance === null}>
            Max
          </Button>
        </div>
      </FieldGroup>

      <div className="swap-switch-row">
        <IconButton label="Switch tokens" onClick={onSwitchTokens} disabled={loading} className="swap-switch-btn">
          <IconSwap width={16} height={16} />
        </IconButton>
      </div>

      <TokenSelector
        label="Token Out"
        tokens={tokens}
        selectedKey={tokenOut?.key}
        excludeKey={tokenIn?.key}
        disabled={loading}
        onChange={onTokenOutChange}
      />

      {amountIn && Number(amountIn) > 0 && tokenIn && tokenOut && (
        <div className="wv7-transfer-preview swap-preview" aria-label="Swap preview">
          <div className="wv7-transfer-preview-title">Swap Preview</div>
          <div className="wv7-transfer-preview-row">
            <span>Swapping</span>
            <span className="mono">
              {amountIn} {tokenIn.symbol}
            </span>
          </div>
          <div className="wv7-transfer-preview-row">
            <span>Estimated output</span>
            <span className="mono">{estimatedOutput}</span>
          </div>
          {quote?.minimumReceived && (
            <div className="wv7-transfer-preview-row">
              <span>Minimum received</span>
              <span className="mono">
                {formatTokenAmount(Number(quote.minimumReceived.amount), 6)} {quote.minimumReceived.token}
              </span>
            </div>
          )}
          {quote?.fees?.length > 0 && (
            <div className="wv7-transfer-preview-row">
              <span>Fees</span>
              <span className="mono">
                {quote.fees
                  .map((f) => (f.amount != null ? `${formatTokenAmount(Number(f.amount), 6)} ${f.token}` : null))
                  .filter(Boolean)
                  .join(' + ') || '—'}
              </span>
            </div>
          )}
          {quote?.estimatedGas?.amount != null && (
            <div className="wv7-transfer-preview-row">
              <span>Est. gas</span>
              <span className="mono">
                {formatTokenAmount(Number(quote.estimatedGas.amount), 6)} {quote.estimatedGas.token}
              </span>
            </div>
          )}
          <div className="wv7-transfer-preview-row">
            <span>Network</span>
            <span>{NETWORK_LABEL}</span>
          </div>
        </div>
      )}

      {formError && (
        <Alert variant="error" title="Check your details">
          {formError}
        </Alert>
      )}

      {!formError && swapError && (
        <Alert variant="error" title={classified ? SWAP_ERROR_LABEL[classified.kind] : 'Swap failed'}>
          {classified?.kind ? SWAP_ERROR_DESCRIPTION[classified.kind] : swapError}
          <details className="brg-error-details">
            <summary>Technical details</summary>
            <span className="mono">{swapError}</span>
          </details>
        </Alert>
      )}

      <div className="wv7-transfer-progress" aria-live="polite">
        <Button
          variant="primary"
          block
          loading={loading}
          onClick={onSubmit}
          disabled={loading || !signer || submitted}
        >
          {submitted ? '✓ Swapped' : loading ? 'Swapping…' : `Swap ${tokenIn?.symbol || ''}`}
        </Button>
        {!signer && (
          <p className="field-hint" style={{ marginTop: 10, textAlign: 'center' }}>
            Connect your wallet to swap tokens
          </p>
        )}
      </div>
    </Panel>
  )
}
