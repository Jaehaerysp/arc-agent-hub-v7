import { Panel, Grid, MetricCard, Button, Skeleton } from '../../../ui/design-system'
import { formatTokenAmount, formatTime, shortAddr } from '../../../lib/format'
import { IconWallet, IconLink, IconLayers, IconClock } from '../../../ui/icons'

/**
 * Portfolio Dashboard (Sprint 1 / v8 Wallet Module) — the central
 * portfolio summary that sits above the categorized Asset Balances
 * list: connected wallet, native USDC balance, how many tracked tokens
 * are actually held vs. tracked in total, and when the whole portfolio
 * was last refreshed. Every figure comes from `usePortfolio`, which
 * itself only re-shapes `useBalances`/`useTokenBalances` output — no
 * new on-chain reads.
 */
export function PortfolioDashboard({ account, nativeBalance, balancesLoading, totals, lastUpdated, loading, onRefresh }) {
  return (
    <Panel
      title="Portfolio Dashboard"
      subtitle="Every asset this wallet holds on Arc Testnet, at a glance"
      actions={
        <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      }
      className="wv7-portfolio-dashboard-panel"
    >
      <Grid columns={5} minColWidth="180px" gap="md" aria-label="Portfolio dashboard">
        <MetricCard
          icon={<IconWallet width={16} height={16} />}
          label="Connected Wallet"
          value={account ? shortAddr(account) : '—'}
          sub="Arc Testnet"
        />

        <MetricCard
          icon={<IconLink width={16} height={16} />}
          label="Native USDC Balance"
          accent
          value={balancesLoading && nativeBalance === null ? <Skeleton width={64} height={26} /> : formatTokenAmount(nativeBalance, 4)}
          sub="Gas token"
        />

        <MetricCard
          icon={<IconLayers width={16} height={16} />}
          label="Total Assets"
          value={totals.totalHeld}
          sub="Tokens with a balance"
        />

        <MetricCard
          icon={<IconLayers width={16} height={16} />}
          label="Number of Tokens"
          value={totals.totalTokens}
          sub="Tracked in the registry"
        />

        <MetricCard
          icon={<IconClock width={16} height={16} />}
          label="Last Updated"
          value={lastUpdated ? formatTime(lastUpdated) : '—'}
          sub={lastUpdated ? 'Auto-refreshes every 15s' : 'Not refreshed yet'}
        />
      </Grid>
    </Panel>
  )
}
