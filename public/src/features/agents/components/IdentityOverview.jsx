import { Panel, Badge } from '../../../ui/design-system'
import { CopyButton } from '../../../ui/CopyButton'
import { IconShield } from '../../../ui/icons'
import { shortAddr, formatDate } from '../../../lib/format'

function IdentityRow({ label, value }) {
  return (
    <div className="pv7-identity-row">
      <span className="pv7-identity-label">{label}</span>
      <span className="pv7-identity-value">{value}</span>
    </div>
  )
}

/**
 * Identity Overview — the registration-proof block from UI Blueprint
 * §3.2 ("this agent is who it claims to be"), rendered as the plain
 * professional facts a hiring decision needs: agent ID, ERC-8004
 * reference, registration status, wallet, owner, created date, version,
 * and network. Mono, muted metadata per §3.10's visual priority.
 */
export function IdentityOverview({ agent }) {
  return (
    <Panel
      icon={<IconShield width={16} height={16} />}
      title="Identity"
      subtitle="On-chain registration details, verifiable against the ERC-8004 Identity Registry"
    >
      <div className="pv7-identity-grid">
        <IdentityRow label="Agent ID" value={<span className="mono">{agent.agentId}</span>} />
        <IdentityRow label="ERC-8004 Identity" value={<Badge variant="confirmed" size="sm">Registered</Badge>} />
        <IdentityRow
          label="Wallet"
          value={
            <span className="pv7-identity-wallet">
              <span className="mono">{shortAddr(agent.wallet)}</span>
              <CopyButton value={agent.wallet} label="" />
            </span>
          }
        />
        <IdentityRow label="Owner" value={<span className="mono">{shortAddr(agent.wallet)}</span>} />
        <IdentityRow label="Created" value={formatDate(agent.registeredAt)} />
        <IdentityRow label="Version" value={<span className="mono">{agent.version}</span>} />
        <IdentityRow label="Network" value={agent.network} />
      </div>
    </Panel>
  )
}
