import { Panel, Grid, SearchInput, Chip, EmptyState } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { WALLET_CATEGORIES } from '../services/tokenRegistry'
import { IconSearch } from '../../../ui/icons'
import { AssetCard } from './AssetCard'

const CATEGORY_LABELS = Object.fromEntries(WALLET_CATEGORIES.map((c) => [c.id, c.label]))

/**
 * Premium asset cards — one per token this app tracks (native + ANV,
 * plus the full Custom / AI Agent / DeFi registry read live by
 * `useTokenBalances`). Sprint 1 (v8 Wallet Module) adds: category tabs,
 * name/symbol/address search, per-card copy address + ArcScan link +
 * single-token refresh, and disabled Send/Receive/Swap/Bridge
 * placeholders. See walletAnalytics.js for why "USD Value" is
 * intentionally omitted rather than fabricated, and for how per-token
 * read errors are surfaced instead of silently shown as a zero balance.
 *
 * Sprint 2 (Wallet Performance Optimization): each card is now
 * `AssetCard`, a `React.memo`'d component, so a background balance poll
 * only re-renders the cards whose values actually changed instead of
 * recreating the whole grid.
 */
export function AssetBalances({ assets, allAssetsCount, loading, error, search, onSearchChange, category, onCategoryChange, onRefreshToken }) {
  return (
    <Panel title="Asset Balances" subtitle="Tokens held on Arc Testnet" className="wv7-assets-panel">
      {error && (
        <Alert variant="warning" title="Some token balances could not be loaded">
          {error}
        </Alert>
      )}

      <div className="wv7-assets-filters">
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search assets…"
          className="wv7-assets-search"
        />

        <div className="wv7-assets-category-row" role="group" aria-label="Filter by category">
          {WALLET_CATEGORIES.map((c) => (
            <Chip key={c.id} selected={category === c.id} onClick={() => onCategoryChange(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={<IconSearch width={20} height={20} />}
          title="No matching assets"
          description={`Nothing in ${allAssetsCount} tracked tokens matches this search or category.`}
        />
      ) : (
        <Grid minColWidth="260px" gap="md" aria-label="Asset balances">
          {assets.map((asset) => (
            <AssetCard
              key={asset.key}
              asset={asset}
              loading={loading}
              categoryLabel={CATEGORY_LABELS[asset.category] || asset.category}
              onRefreshToken={onRefreshToken}
            />
          ))}
        </Grid>
      )}
    </Panel>
  )
}
