import { Panel, FieldGroup, Input, Button } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { formatTokenAmount } from '../../../lib/format'
import { IconBridge } from '../../../ui/icons'
import { NetworkSelector } from './NetworkSelector'
import { AssetSelector } from './AssetSelector'
import { BridgeSummary } from './BridgeSummary'
import { classifyBridgeError, BRIDGE_ERROR_LABEL, BRIDGE_ERROR_DESCRIPTION } from '../services/bridgeErrors'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'

/**
 * Bridge Form — Source Chain, Destination Chain, Asset Selector, Amount,
 * Estimated Fee/Time, Bridge Button. Mirrors PaymentForm's shape/classes
 * (`wv7-transfer-*`) so Bridge reads as part of the same Treasury surface.
 */
export function BridgeForm({
  direction,
  destinationId,
  destinationNetwork,
  assets,
  selectedAsset,
  balance,
  recipient,
  amount,
  signer,
  isArcNetwork,
  onSwitchToArc,
  loading,
  status,
  submitted,
  formError,
  bridgeError,
  fee,
  feeLoading,
  feeError,
  arrival,
  onDirectionToggle,
  onDestinationChange,
  onAssetChange,
  onRecipientChange,
  onAmountChange,
  onMax,
  onSubmit,
}) {
  const isOutbound = direction === 'outbound'
  const sourceLabel = isOutbound ? NETWORK_LABEL : destinationNetwork?.name || 'Select network'
  const destLabel = isOutbound ? destinationNetwork?.name || 'Select network' : NETWORK_LABEL

  const classified = bridgeError ? classifyBridgeError(bridgeError) : null

  return (
    <Panel
      icon={<IconBridge width={18} height={18} />}
      title="Bridge Form"
      subtitle="Move USDC or EURC between Arc Testnet and supported networks"
      className="wv7-transfer-form-panel"
    >
      <div className="wv7-transfer-balance-row">
        <span className="wv7-transfer-balance-label">Available balance ({sourceLabel})</span>
        <span className="wv7-transfer-balance-value mono">
          {formatTokenAmount(balance, 4)} {selectedAsset.symbol}
        </span>
      </div>

      <NetworkSelector
        direction={direction}
        destinationId={destinationId}
        disabled={loading}
        isArcNetwork={isArcNetwork}
        onSwitchToArc={onSwitchToArc}
        onDirectionToggle={onDirectionToggle}
        onDestinationChange={onDestinationChange}
      />

      <AssetSelector assets={assets} selectedKey={selectedAsset.key} disabled={loading} onChange={onAssetChange} />

      <FieldGroup label="Recipient address" hint="Defaults to your connected wallet address on the destination chain">
        <Input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          disabled={loading}
        />
      </FieldGroup>

      <FieldGroup label="Bridge Amount">
        <div className="brg-amount-row">
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            disabled={loading}
            aria-label="Bridge amount"
          />
          <Button variant="secondary" size="sm" onClick={onMax} disabled={loading || balance === null}>
            Max
          </Button>
        </div>
      </FieldGroup>

      {recipient && amount && Number(amount) > 0 && (
        <BridgeSummary
          amount={amount}
          token={selectedAsset}
          sourceLabel={sourceLabel}
          destLabel={destLabel}
          recipient={recipient}
          fee={fee}
          feeLoading={feeLoading}
          feeError={feeError}
          arrival={arrival}
        />
      )}

      {formError && (
        <Alert variant="error" title="Check your details">
          {formError}
        </Alert>
      )}

      {!formError && bridgeError && (
        <Alert variant="error" title={classified ? BRIDGE_ERROR_LABEL[classified.kind] : 'Bridge failed'}>
          {classified?.kind ? BRIDGE_ERROR_DESCRIPTION[classified.kind] : bridgeError}
          {bridgeError && (
            <details className="brg-error-details">
              <summary>Technical details</summary>
              <span className="mono">{bridgeError}</span>
            </details>
          )}
        </Alert>
      )}

      <div className="wv7-transfer-progress brg-submit-row" aria-live="polite">
        <Button variant="primary" block loading={loading} onClick={onSubmit} disabled={loading || !signer || submitted}>
          {submitted ? '✓ Bridged' : loading ? statusLabel(status) : `Bridge ${selectedAsset.symbol}`}
        </Button>
        {!signer && <p className="field-hint brg-submit-hint">Connect your wallet to bridge assets</p>}
      </div>
    </Panel>
  )
}

function statusLabel(status) {
  if (status === 'pending') return 'Preparing…'
  if (status === 'submitted') return 'Submitted…'
  if (status === 'confirming') return 'Confirming…'
  return 'Bridging…'
}
