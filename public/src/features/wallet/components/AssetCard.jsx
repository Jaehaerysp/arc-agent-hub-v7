import { memo } from 'react'
import { GlassCard, Badge, Skeleton } from '../../../ui/design-system'
import { CopyButton } from '../../../ui/CopyButton'
import { shortAddr } from '../../../lib/format'
import { explorerTokenUrl } from '../../../chains/arc'
import { IconWallet, IconLink, IconLayers, IconZap } from '../../../ui/icons'

const ICONS = { native: IconLink, anv: IconWallet }

const CATEGORY_ICONS = {
  native: IconLink,
  custom: IconWallet,
  ai: IconZap,
  defi: IconLayers,
}

const STATUS_BADGE = {
  connected: { variant: 'success', label: 'Connected' },
  'wrong-network': { variant: 'warning', label: 'Wrong network' },
  error: { variant: 'error', label: 'Read failed' },
}

// Send/Receive/Swap/Bridge are placeholders per the Sprint 1 brief —
// wired up as disabled affordances so the card layout is final, but no
// action is implemented yet.
const PLACEHOLDER_ACTIONS = ['Send', 'Receive', 'Swap', 'Bridge']

/**
 * A single asset card, extracted from AssetBalances (Sprint 2 — Wallet
 * Performance Optimization) and wrapped in `React.memo` so a background
 * balance poll only re-renders the cards whose values actually changed.
 * `useTokenBalances`'s merge step keeps unchanged asset objects
 * referentially stable, so this only re-renders when its own `asset` (or
 * the batch `loading`/`categoryLabel`) prop actually differs — every
 * other card in the grid skips the re-render entirely.
 */
export const AssetCard = memo(function AssetCard({ asset, loading, categoryLabel, onRefreshToken }) {
  const Icon = ICONS[asset.key] || CATEGORY_ICONS[asset.category] || IconWallet
  const badge = STATUS_BADGE[asset.status] || STATUS_BADGE['wrong-network']

  return (
    <GlassCard className="wv7-asset-card" padding="md">
      <div className="wv7-asset-card-top">
        <div className="wv7-asset-icon" aria-hidden="true">
          <Icon width={16} height={16} />
        </div>
        <Badge variant={badge.variant} size="sm" dot>
          {badge.label}
        </Badge>
      </div>

      <div className="wv7-asset-symbol">{asset.symbol}</div>
      <div className="wv7-asset-name">{asset.name}</div>

      {asset.category && (
        <Badge variant="muted" size="sm" dot={false} className="wv7-asset-category-badge">
          {categoryLabel || asset.category}
        </Badge>
      )}

      <div className="wv7-asset-balance">
        {loading && asset.balance === null && !asset.error ? <Skeleton width={90} height={24} /> : asset.balanceFormatted}
      </div>

      <div className="wv7-asset-foot">
        <span className="wv7-asset-network">{asset.network}</span>
        {asset.address && (
          <span className="wv7-asset-address mono" title={asset.address}>
            {shortAddr(asset.address)}
          </span>
        )}
      </div>

      {asset.address && (
        <div className="wv7-asset-onchain-actions">
          <CopyButton value={asset.address} label="Copy Address" />
          <a
            href={explorerTokenUrl(asset.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn ds-btn-ghost ds-btn-sm"
          >
            <span className="ds-btn-label">ArcScan ↗</span>
          </a>
          <button type="button" className="ds-btn ds-btn-ghost ds-btn-sm" onClick={() => onRefreshToken?.(asset.key)}>
            <span className="ds-btn-label">Refresh</span>
          </button>
        </div>
      )}

      <div className="wv7-asset-placeholder-actions" aria-label={`${asset.symbol} actions (coming soon)`}>
        {PLACEHOLDER_ACTIONS.map((action) => (
          <button key={action} type="button" className="ds-btn ds-btn-ghost ds-btn-sm" disabled title="Coming soon">
            <span className="ds-btn-label">{action}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  )
})
