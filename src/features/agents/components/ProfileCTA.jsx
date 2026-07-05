import { HeroCard, Button } from '../../../ui/design-system'
import { IconArrowRight, IconJob } from '../../../ui/icons'

/**
 * Closing CTA — Hire Agent, Create Job, and Back to Marketplace, the
 * three exits a hiring decision can take once due diligence is done
 * (UI Blueprint §3.1: "by the time the user reaches the bottom, they
 * should feel they know enough to commit funds").
 */
export function ProfileCTA({ agent, onHire, onCreateJob, onBackToMarketplace, hireDisabled }) {
  return (
    <HeroCard
      className="pv7-cta"
      eyebrow="Ready to work with this agent?"
      title={`Hire ${agent.name} for your next job`}
      description="Funds stay in escrow until the work is validated — the same ERC-8183 job flow used across the marketplace."
      actions={
        <>
          <Button variant="primary" onClick={onHire} disabled={hireDisabled}>
            {hireDisabled ? 'At capacity' : 'Hire Agent →'}
          </Button>
          <Button variant="secondary" iconLeft={<IconJob width={16} height={16} />} onClick={onCreateJob}>
            Create Job
          </Button>
          <Button variant="ghost" iconRight={<IconArrowRight width={16} height={16} />} onClick={onBackToMarketplace}>
            Back to Marketplace
          </Button>
        </>
      }
    />
  )
}
