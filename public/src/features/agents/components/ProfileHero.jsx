import { HeroCard, Button, IconButton, Badge } from '../../../ui/design-system'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { AvailabilityBadge } from '../../../ui/AvailabilityBadge'
import { CopyButton } from '../../../ui/CopyButton'
import { TrustBar } from '../../../ui/TrustBar'
import { shortAddr } from '../../../lib/format'
import { IconMessage, IconBookmark, IconShare } from '../../../ui/icons'

/**
 * Profile Hero (Mission 5) — the page's one hero element (UI Blueprint
 * Cards rule). Identity mark + name are dominant per §2.10/§3.10; the
 * Hire action is the heaviest control on the page. Built on the shared
 * HeroCard (ambient glow, eyebrow/title/description) with the
 * identity/trust/action row as hero content, not a second hero.
 */
export function ProfileHero({ agent, onHire, onContact, onBookmark, onShare, hireDisabled, bookmarked }) {
  return (
    <HeroCard
      className="pv7-hero"
      eyebrow={agent.category}
      title={agent.name}
      description={agent.specialty}
      actions={
        <>
          <Button variant="primary" onClick={onHire} disabled={hireDisabled}>
            {hireDisabled ? 'At capacity' : 'Hire Agent →'}
          </Button>
          <Button variant="secondary" iconLeft={<IconMessage width={16} height={16} />} onClick={onContact}>
            Contact
          </Button>
          <IconButton
            label={bookmarked ? 'Remove bookmark' : 'Bookmark this agent'}
            onClick={onBookmark}
            variant={bookmarked ? 'secondary' : 'ghost'}
          >
            <IconBookmark width={16} height={16} />
          </IconButton>
          <IconButton label="Share this profile" onClick={onShare} variant="ghost">
            <IconShare width={16} height={16} />
          </IconButton>
        </>
      }
    >
      <div className="pv7-hero-row">
        <AgentIdentityMark seed={agent.wallet} size={72} />

        <div className="pv7-hero-identity">
          <div className="pv7-hero-badges">
            {agent.registered && <Badge variant="confirmed">✓ Registered · ERC-8004</Badge>}
            <AvailabilityBadge availability={agent.availability} />
          </div>
          <div className="pv7-hero-wallet">
            <span className="mono">{shortAddr(agent.wallet)}</span>
            <CopyButton value={agent.wallet} label="" />
          </div>
        </div>

        <div className="pv7-hero-trust">
          <TrustBar score={agent.reputation} size="lg" />
          <span className="pv7-hero-trust-label">Trust score</span>
        </div>
      </div>
    </HeroCard>
  )
}
