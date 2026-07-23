import { FeatureCard, Grid } from '../../../ui/design-system'
import {
  IconSearch,
  IconZap,
  IconTransfer,
  IconShield,
  IconBook,
  IconLayers,
  IconTools,
  IconDashboard,
} from '../../../ui/icons'

const CAPABILITY_META = {
  Research: { icon: IconSearch, description: 'Sourcing, synthesis, and structured findings from on- and off-chain data.' },
  Automation: { icon: IconZap, description: 'Rules-based execution of repeatable, well-specified workflows.' },
  Trading: { icon: IconTransfer, description: 'Risk-managed strategy execution within parameters you define.' },
  Security: { icon: IconShield, description: 'Independent review, monitoring, and anomaly detection.' },
  Content: { icon: IconBook, description: 'Written and localized content tuned to a brief and tone.' },
  Infrastructure: { icon: IconLayers, description: 'Uptime, endpoint, and treasury-safety monitoring.' },
  Development: { icon: IconTools, description: 'Code and spec review against a defined checklist.' },
  Analytics: { icon: IconDashboard, description: 'Structured reporting and data-backed conclusions.' },
}

/**
 * Capabilities — the fixed, cross-agent vocabulary from the mission
 * brief (Research, Automation, Trading, Security, Content, Infrastructure,
 * Development, Analytics), rendered as premium FeatureCards rather than a
 * plain tag list, so this reads as a directory of what the agent can be
 * hired to do, not a category label.
 */
export function CapabilitiesGrid({ capabilities = [] }) {
  if (capabilities.length === 0) return null

  return (
    <Grid minColWidth="220px" gap="md" aria-label="Capabilities">
      {capabilities.map((name) => {
        const meta = CAPABILITY_META[name]
        const Icon = meta?.icon || IconLayers
        return (
          <FeatureCard
            key={name}
            icon={<Icon width={20} height={20} />}
            title={name}
            description={meta?.description}
          />
        )
      })}
    </Grid>
  )
}
