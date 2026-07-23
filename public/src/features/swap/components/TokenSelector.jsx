import { FieldGroup, Select } from '../../../ui/design-system'

/**
 * Token Selector — dropdown over `SWAP_TOKENS` (USDC/EURC on Arc Testnet),
 * same shape as Bridge's `AssetSelector`/Payments' inline token `Select`.
 * `excludeKey` (the token currently selected on the *other* side of the
 * pair) is shown disabled rather than removed, so the list never
 * reflows as the person picks — same pattern Bridge's `NetworkSelector`
 * uses for `n.kind !== 'evm'` options.
 */
export function TokenSelector({ label, tokens, selectedKey, excludeKey, disabled, onChange }) {
  return (
    <FieldGroup label={label}>
      <Select value={selectedKey} onChange={(e) => onChange(e.target.value)} disabled={disabled} aria-label={label}>
        {tokens.map((token) => (
          <option key={token.key} value={token.key} disabled={token.key === excludeKey}>
            {token.symbol} — {token.name}
          </option>
        ))}
      </Select>
    </FieldGroup>
  )
}
