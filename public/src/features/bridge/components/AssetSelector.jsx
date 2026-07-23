import { FieldGroup, Select } from '../../../ui/design-system'

/** Asset Selector — dropdown over `BRIDGE_ASSETS` (USDC/EURC today, grows automatically — see bridgeAssets.js). */
export function AssetSelector({ assets, selectedKey, disabled, onChange }) {
  return (
    <FieldGroup label="Asset">
      <Select value={selectedKey} onChange={(e) => onChange(e.target.value)} disabled={disabled} aria-label="Asset">
        {assets.map((asset) => (
          <option key={asset.key} value={asset.key}>
            {asset.symbol} — {asset.name}
          </option>
        ))}
      </Select>
    </FieldGroup>
  )
}
