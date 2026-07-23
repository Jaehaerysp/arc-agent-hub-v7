import { Panel, Grid } from '../../../ui/design-system'
import { CONTRACTS } from '../../../contracts/registry'
import { shortAddr, shortHash, formatDate } from '../../../lib/format'
import { CopyButton } from '../../../ui/CopyButton'

/**
 * On-Chain Evidence — wallet, agent ID, registry addresses (from
 * `src/contracts/registry.js`, unchanged), the most recent feedback and
 * validation transaction hashes from this wallet's activity, and direct
 * explorer links. No new contract reads — every value is either static
 * config already imported elsewhere (Reputation/Validation pages) or a
 * txHash already logged locally.
 */
export function OnChainEvidencePanel({ account, agentId, latestReputationTx, latestValidationTx, arcExplorer }) {
  const rows = [
    { label: 'Wallet', value: account ? shortAddr(account) : 'Not connected', full: account },
    { label: 'Agent ID', value: agentId ? `#${agentId}` : 'Unregistered' },
    { label: 'Identity Registry', value: shortAddr(CONTRACTS.IDENTITY_REGISTRY.address), full: CONTRACTS.IDENTITY_REGISTRY.address, link: `${arcExplorer}/address/${CONTRACTS.IDENTITY_REGISTRY.address}` },
    { label: 'Reputation Registry', value: shortAddr(CONTRACTS.REPUTATION_REGISTRY.address), full: CONTRACTS.REPUTATION_REGISTRY.address, link: `${arcExplorer}/address/${CONTRACTS.REPUTATION_REGISTRY.address}` },
    { label: 'Validation Registry', value: shortAddr(CONTRACTS.VALIDATION_REGISTRY.address), full: CONTRACTS.VALIDATION_REGISTRY.address, link: `${arcExplorer}/address/${CONTRACTS.VALIDATION_REGISTRY.address}` },
    {
      label: 'Latest Reputation TX',
      value: latestReputationTx ? `${shortHash(latestReputationTx.txHash)} · ${formatDate(latestReputationTx.timestamp)}` : 'None yet',
      link: latestReputationTx ? `${arcExplorer}/tx/${latestReputationTx.txHash}` : null,
    },
    {
      label: 'Latest Validation TX',
      value: latestValidationTx ? `${shortHash(latestValidationTx.txHash)} · ${formatDate(latestValidationTx.timestamp)}` : 'None yet',
      link: latestValidationTx ? `${arcExplorer}/tx/${latestValidationTx.txHash}` : null,
    },
  ]

  return (
    <Panel title="On-Chain Evidence" subtitle="Registry addresses and the latest recorded transactions" className="tv7-evidence-panel">
      <Grid columns={2} minColWidth="280px" gap="md">
        {rows.map((row) => (
          <div className="tv7-evidence-row" key={row.label}>
            <span className="tv7-evidence-label">{row.label}</span>
            <span className="tv7-evidence-value">
              {row.link ? (
                <a href={row.link} target="_blank" rel="noopener noreferrer" className="mono">
                  {row.value} ↗
                </a>
              ) : (
                <span className="mono">{row.value}</span>
              )}
              {row.full && <CopyButton value={row.full} />}
            </span>
          </div>
        ))}
      </Grid>
    </Panel>
  )
}
