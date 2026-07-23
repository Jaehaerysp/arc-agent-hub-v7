import { Panel, Chip, FieldGroup, Input } from '../../../ui/design-system'
import { IconSettings } from '../../../ui/icons'

// Presets in basis points (1 bps = 0.01%) — matches Circle App Kit's own
// `SwapConfig.slippageBps` unit exactly, so the value picked here is
// passed straight through to `kit.swap()`/`kit.estimateSwap()` with no
// conversion. App Kit's own default is 300 (3%) when `slippageBps` is
// omitted — kept as the middle preset here for the same "reasonable
// default" reason.
const PRESETS_BPS = [50, 100, 300]

/**
 * Swap Settings — slippage tolerance, same `Panel` + `Chip` shape as
 * other secondary controls in this design system. Presets are common
 * DEX slippage tolerances (0.5% / 1% / 3%); "Custom" accepts any value
 * in basis points for finer control.
 */
export function SwapSettings({ slippageBps, disabled, onChange }) {
  const isPreset = PRESETS_BPS.includes(slippageBps)

  return (
    <Panel
      icon={<IconSettings width={18} height={18} />}
      title="Swap Settings"
      subtitle="Slippage tolerance for this swap"
      className="wv7-transfer-form-panel swap-settings-panel"
      padding="sm"
    >
      <div className="swap-slippage-row" role="group" aria-label="Slippage tolerance">
        {PRESETS_BPS.map((bps) => (
          <Chip key={bps} selected={slippageBps === bps} disabled={disabled} onClick={() => onChange(bps)}>
            {(bps / 100).toFixed(bps % 100 === 0 ? 0 : 1)}%
          </Chip>
        ))}
        <FieldGroup label="Custom" className="swap-slippage-custom">
          <Input
            type="number"
            inputMode="decimal"
            min="0.01"
            max="100"
            step="0.01"
            placeholder="Custom %"
            value={isPreset ? '' : (slippageBps / 100).toString()}
            onChange={(e) => {
              const pct = Number(e.target.value)
              if (!Number.isFinite(pct) || pct <= 0) return
              onChange(Math.round(pct * 100))
            }}
            disabled={disabled}
            aria-label="Custom slippage tolerance percent"
          />
        </FieldGroup>
      </div>
      <p className="field-hint">
        Current tolerance: <span className="mono">{(slippageBps / 100).toFixed(2)}%</span>. Your swap fails rather
        than executing beyond this if the price moves.
      </p>
    </Panel>
  )
}
