import { FieldGroup, Select, IconButton, Badge, Button } from '../../../ui/design-system'
import { IconTransfer } from '../../../ui/icons'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'
import { BRIDGE_NETWORKS, getBridgeNetwork } from '../../../chains/bridgeNetworks'

// Deterministic per-network monogram + hue, purely presentational -- lets
// each destination chain read at a glance in the selector without shipping
// external brand logo assets. Never touches BRIDGE_NETWORKS itself.
function networkGlyph(name) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360
  return { initials, hue: hash }
}

function NetworkGlyph({ name }) {
  const { initials, hue } = networkGlyph(name)
  return (
    <span
      className="brg-network-glyph"
      style={{ '--brg-glyph-hue': hue }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

/**
 * Source / Destination chain picker. Arc Testnet is always one side of
 * the pair (this app only ever holds an Arc-connected signer) — `direction`
 * flips which side it's on, matching the two directions the reference
 * scripts actually implement (`bridge-usdc.ts` is Base→Arc,
 * `Bridge-usdc-arc-base.ts` is the reverse).
 *
 * `isArcNetwork`/`onSwitchToArc` are optional -- when the connected wallet
 * isn't actually on Arc Testnet, the Arc side of the pair shows a "Wrong
 * network" badge and a Switch Network action (wired to the existing
 * `switchToArc` from useWallet.js -- no new switching logic added here).
 */
export function NetworkSelector({
  direction,
  destinationId,
  disabled,
  isArcNetwork,
  onSwitchToArc,
  onDirectionToggle,
  onDestinationChange,
}) {
  const isOutbound = direction === 'outbound'
  const sourceLabel = isOutbound ? NETWORK_LABEL : null
  const destLabel = isOutbound ? null : NETWORK_LABEL
  const destinationNetwork = getBridgeNetwork(destinationId)
  const showWrongNetwork = isArcNetwork === false

  const arcFieldLabel = (
    <span className="brg-network-field-label">
      {isOutbound ? 'Source Chain' : 'Destination Chain'}
      {showWrongNetwork && (
        <Badge variant="warning" size="sm" dot={false}>
          Wrong network
        </Badge>
      )}
    </span>
  )

  return (
    <div className="brg-network-row">
      <FieldGroup label={isOutbound ? arcFieldLabel : 'Source Chain'} className="brg-network-field">
        {isOutbound ? (
          <Select value="arc" disabled aria-label="Source chain">
            <option value="arc">{sourceLabel}</option>
          </Select>
        ) : (
          <Select
            value={destinationId}
            onChange={(e) => onDestinationChange(e.target.value)}
            disabled={disabled}
            aria-label="Source chain"
          >
            {BRIDGE_NETWORKS.map((n) => (
              <option key={n.id} value={n.id} disabled={n.kind !== 'evm'}>
                {n.name}
                {n.kind !== 'evm' ? ' (no wallet support yet)' : ''}
              </option>
            ))}
          </Select>
        )}
        {!isOutbound && destinationNetwork && <NetworkGlyph name={destinationNetwork.name} />}
      </FieldGroup>

      <IconButton
        label="Swap direction"
        onClick={onDirectionToggle}
        disabled={disabled}
        className="brg-network-swap"
      >
        <IconTransfer width={16} height={16} />
      </IconButton>

      <FieldGroup label={isOutbound ? 'Destination Chain' : arcFieldLabel} className="brg-network-field">
        {isOutbound ? (
          <Select
            value={destinationId}
            onChange={(e) => onDestinationChange(e.target.value)}
            disabled={disabled}
            aria-label="Destination chain"
          >
            {BRIDGE_NETWORKS.map((n) => (
              <option key={n.id} value={n.id} disabled={n.kind !== 'evm'}>
                {n.name}
                {n.kind !== 'evm' ? ' (no wallet support yet)' : ''}
              </option>
            ))}
          </Select>
        ) : (
          <Select value="arc" disabled aria-label="Destination chain">
            <option value="arc">{destLabel}</option>
          </Select>
        )}
        {isOutbound && destinationNetwork && <NetworkGlyph name={destinationNetwork.name} />}
      </FieldGroup>

      {showWrongNetwork && onSwitchToArc && (
        <div className="brg-network-switch-row">
          <span className="field-hint">Switch your wallet to {NETWORK_LABEL} to continue bridging.</span>
          <Button variant="secondary" size="sm" onClick={onSwitchToArc}>
            Switch Network
          </Button>
        </div>
      )}
    </div>
  )
}
