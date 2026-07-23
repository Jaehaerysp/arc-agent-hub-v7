import { Panel, Grid, GlassCard } from '../../../ui/design-system'
import { Tooltip } from '../../../ui/Tooltip'
import { IconStar, IconShield, IconCheck, IconZap, IconLayers, IconActivity } from '../../../ui/icons'

const BADGE_ICONS = {
  verified: IconCheck,
  trusted: IconShield,
  elite: IconStar,
  contributor: IconActivity,
  builder: IconLayers,
  'top-provider': IconZap,
}

/**
 * Achievement Badges — same GlassCard grid language as Jobs v7's
 * JobsQuickActions, each badge wrapped in the shared `Tooltip` primitive
 * describing its unlock condition. `unlocked` comes straight from
 * `computeBadges`, so every badge here reflects a real threshold shown
 * elsewhere on the page (agentId, feedback count, validation count, tier).
 */
export function AchievementBadges({ badges }) {
  return (
    <Panel title="Achievement Badges" subtitle="Earned through real reputation and validation activity" className="tv7-badges-panel">
      <Grid minColWidth="160px" gap="md" aria-label="Achievement badges">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.key] || IconStar
          return (
            <Tooltip key={badge.key} label={badge.unlocked ? badge.desc : `Locked — ${badge.desc}`}>
              <GlassCard className={`tv7-badge-card ${badge.unlocked ? 'is-unlocked' : 'is-locked'}`} padding="md">
                <div className="tv7-badge-icon" aria-hidden="true">
                  <Icon width={20} height={20} />
                </div>
                <div className="tv7-badge-label">{badge.label}</div>
              </GlassCard>
            </Tooltip>
          )
        })}
      </Grid>
    </Panel>
  )
}
