import { HeroCard, Badge, Skeleton } from '../../../ui/design-system'
import { formatTime } from '../../../lib/format'
import { computeTrustSummary } from '../trustAnalytics'

const TIER_BADGE_VARIANT = {
  Elite: 'success',
  Trusted: 'accent',
  Verified: 'accent',
  Building: 'warning',
  New: 'muted',
  Unregistered: 'muted',
}

/**
 * Trust Hero — the one gradient/glow hero element on this page (same
 * ambient treatment as Jobs v7's JobsHero / Dashboard v7's MissionHero,
 * scoped under `.tv7-hero`). Surfaces the composite score, tier,
 * validation status, verified identity, and the most recent trust event
 * — every figure computed once in TrustCenterPage and passed down, no
 * separate reads here.
 */
export function TrustHero({ agentId, score, tier, validationStats, latestEvent, loading }) {
  const summary = computeTrustSummary(agentId, score, { successful: latestEvent ? 1 : 0 }, validationStats)
  const skeleton = <Skeleton width={40} height={20} />

  return (
    <HeroCard
      className="tv7-hero"
      eyebrow="Trust Center"
      title="Trust & Security"
      description={summary}
      actions={
        <div className="tv7-hero-facts" role="list">
          <div className="tv7-hero-fact tv7-hero-fact-hero" role="listitem" aria-label={`Trust score ${score ?? 'not available'}`}>
            <span className="tv7-hero-fact-label">Overall Trust Score</span>
            <span className="tv7-hero-fact-value tv7-hero-gradient">{loading ? skeleton : score === null ? '—' : score}</span>
          </div>

          <div className="tv7-hero-fact" role="listitem">
            <span className="tv7-hero-fact-label">Reputation Tier</span>
            <span className="tv7-hero-fact-value">
              {loading ? skeleton : <Badge variant={TIER_BADGE_VARIANT[tier] || 'muted'} size="sm">{tier}</Badge>}
            </span>
          </div>

          <div className="tv7-hero-fact" role="listitem">
            <span className="tv7-hero-fact-label">Verified Identity</span>
            <span className="tv7-hero-fact-value">
              {loading ? skeleton : <Badge variant={agentId ? 'success' : 'muted'} size="sm">{agentId ? `Agent #${agentId}` : 'Unregistered'}</Badge>}
            </span>
          </div>

          <div className="tv7-hero-fact" role="listitem">
            <span className="tv7-hero-fact-label">Validation Status</span>
            <span className="tv7-hero-fact-value">
              {loading ? skeleton : (
                <Badge variant={validationStats.requested > 0 ? 'success' : 'muted'} size="sm">
                  {validationStats.requested > 0 ? `${validationStats.requested} requested` : 'None yet'}
                </Badge>
              )}
            </span>
          </div>

          <div className="tv7-hero-fact" role="listitem">
            <span className="tv7-hero-fact-label">Latest Activity</span>
            <span className="tv7-hero-fact-value">
              {loading ? skeleton : latestEvent ? `${latestEvent.label} · ${formatTime(latestEvent.timestamp)}` : 'No activity yet'}
            </span>
          </div>
        </div>
      }
    />
  )
}
