import { Panel, Chip } from '../../../ui/design-system'
import { IconLink } from '../../../ui/icons'

/**
 * Supported Networks — the chains this agent can be hired to operate on
 * or settle jobs against. "Future compatible" communicates the roadmap
 * without implying a network is live today.
 */
export function SupportedNetworks({ chains = [] }) {
  if (chains.length === 0) return null

  return (
    <Panel icon={<IconLink width={16} height={16} />} title="Supported Networks">
      <div className="pv7-chains-chips">
        {chains.map((chain) => (
          <Chip key={chain}>{chain}</Chip>
        ))}
        <Chip>Future compatible</Chip>
      </div>
    </Panel>
  )
}
