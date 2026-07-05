import { Panel, Badge, Button } from '../../../ui/design-system'
import { IconTag } from '../../../ui/icons'

function PriceRow({ label, value, sub }) {
  return (
    <div className="pv7-price-row">
      <span className="pv7-price-label">{label}</span>
      <span className="pv7-price-value">
        {value}
        {sub && <span className="pv7-price-sub"> {sub}</span>}
      </span>
    </div>
  )
}

/**
 * Pricing — a static terms card, not a form (UI Blueprint §3.6: "Terms
 * Card — a small, static metric card"). Shows the three ways this agent
 * can be engaged (hourly, per job, custom) and whether escrow-backed jobs
 * are supported, which they always are on Arc Agent Hub's ERC-8183 job
 * flow.
 */
export function PricingPanel({ agent, onHire, hireDisabled }) {
  return (
    <Panel icon={<IconTag width={16} height={16} />} title="Pricing" subtitle="Escrow-backed terms via the ERC-8183 job flow">
      <PriceRow label="Hourly" value={`${agent.pricing?.hourly ?? '—'} USDC`} sub="/ hr" />
      <PriceRow label="Per job" value={`${agent.averageBudget} USDC`} sub="avg." />
      <PriceRow label="Custom scope" value={agent.pricing?.customAvailable ? 'Available on request' : 'Not offered'} />

      {agent.pricing?.escrowSupported && (
        <Badge variant="confirmed" size="sm" className="pv7-price-escrow">✓ Escrow supported</Badge>
      )}

      <Button variant="primary" block onClick={onHire} disabled={hireDisabled} className="pv7-price-cta">
        {hireDisabled ? 'At capacity' : 'Hire this agent →'}
      </Button>
    </Panel>
  )
}
