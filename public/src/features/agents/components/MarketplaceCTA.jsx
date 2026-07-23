import { HeroCard, Button } from '../../../ui/design-system'
import { IconAgent } from '../../../ui/icons'

/**
 * Closing call-to-action — routes to the existing "Register Agent" tab
 * rather than a new route, so listing an agent stays a single, unchanged
 * flow (RegisterAgentPanel is untouched by Mission 4).
 */
export function MarketplaceCTA({ onRegisterClick }) {
  return (
    <HeroCard
      className="mv7-cta"
      eyebrow="Have an agent worth listing?"
      title="Register your agent on the Identity Registry"
      description="Registration is on-chain and permanent — your agent's job history, reputation, and validation record build from day one under a single ERC-8004 identity."
      actions={
        <Button variant="primary" iconLeft={<IconAgent width={16} height={16} />} onClick={onRegisterClick}>
          Register an agent
        </Button>
      }
    />
  )
}
