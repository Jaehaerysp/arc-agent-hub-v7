import { useMemo } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useBalances } from '../../hooks/useBalances'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { useTokenBalances } from './hooks/useTokenBalances'
import { usePortfolio } from './hooks/usePortfolio'
import { Container, Section } from '../../ui/design-system'
import { PortfolioHero } from './components/PortfolioHero'
import { PortfolioSummary } from './components/PortfolioSummary'
import { PortfolioDashboard } from './components/PortfolioDashboard'
import { AssetBalances } from './components/AssetBalances'
import { RecentTransactionsTable } from './components/RecentTransactionsTable'
import { WalletActivityTimeline } from './components/WalletActivityTimeline'
import { NetworkStatusPanel } from './components/NetworkStatusPanel'
import { WalletQuickActions } from './components/WalletQuickActions'
import { computeRecentTransactions, computeActivityTimeline, computeNetworkInfo } from './walletAnalytics'
import { ARC_RPC_URL } from '../../chains/arc'

/**
 * Wallet v8 (Sprint 1 — Wallet Module + Complete Asset Portfolio
 * Integration). Layout order: Portfolio Hero -> Portfolio Summary ->
 * Portfolio Dashboard (new) -> Asset Balances (now categorized +
 * searchable) -> Recent Transactions -> Activity Timeline -> Network
 * Information -> Quick Actions.
 *
 * Every figure still traces back to existing hooks only: `useWalletContext`
 * (account, activity, connection state), `useBalances` (native + ANV
 * balances), `useTokenBalances` (the extended Custom/AI/DeFi registry),
 * and `useNetworkStatus`. `usePortfolio` is a new coordination hook that
 * merges those into one categorized, searchable asset list plus the
 * portfolio totals/last-updated state the new Portfolio Dashboard panel
 * needs — it performs no on-chain reads of its own. See
 * walletAnalytics.js for the documented USD-value limitation.
 */
export default function WalletPage() {
  const { account, provider, chainId, isArcNetwork, isConnecting, activity, arcExplorer, connect, disconnect, switchToArc } = useWalletContext()
  const balancesState = useBalances(provider, account)
  const { nativeBalance, anvBalance, loading: balancesLoading } = balancesState
  const tokenBalancesState = useTokenBalances(provider, account)
  const { blockNumber, gasPriceGwei, latencyMs } = useNetworkStatus(provider)

  const portfolio = usePortfolio(balancesState, tokenBalancesState, isArcNetwork)

  const transactions = useMemo(() => computeRecentTransactions(activity, 8), [activity])
  const timelineItems = useMemo(() => computeActivityTimeline(activity, 10), [activity])
  const networkInfo = useMemo(
    () => computeNetworkInfo({ isArcNetwork, chainId, rpcUrl: ARC_RPC_URL, blockNumber, gasPriceGwei, latencyMs }),
    [isArcNetwork, chainId, blockNumber, gasPriceGwei, latencyMs]
  )

  return (
    <Container size="wide" className="wv7-wallet-page">
      <Section spacing="md">
        <PortfolioHero
          account={account}
          isArcNetwork={isArcNetwork}
          chainId={chainId}
          nativeBalance={nativeBalance}
          anvBalance={anvBalance}
          balancesLoading={balancesLoading}
          arcExplorer={arcExplorer}
          isConnecting={isConnecting}
          onConnect={connect}
          onDisconnect={disconnect}
          onSwitchNetwork={switchToArc}
        />
      </Section>

      {account && (
        <>
          <Section spacing="md">
            <PortfolioSummary
              anvBalance={anvBalance}
              nativeBalance={nativeBalance}
              balancesLoading={balancesLoading}
              txCount={activity.length}
              isArcNetwork={isArcNetwork}
            />
          </Section>

          <Section spacing="md">
            <PortfolioDashboard
              account={account}
              nativeBalance={nativeBalance}
              balancesLoading={balancesLoading}
              totals={portfolio.totals}
              lastUpdated={portfolio.lastUpdated}
              loading={portfolio.loading}
              onRefresh={portfolio.refreshAll}
            />
          </Section>

          <Section spacing="md">
            <AssetBalances
              assets={portfolio.filteredAssets}
              allAssetsCount={portfolio.assets.length}
              loading={portfolio.loading}
              error={portfolio.error}
              search={portfolio.search}
              onSearchChange={portfolio.setSearch}
              category={portfolio.category}
              onCategoryChange={portfolio.setCategory}
              onRefreshToken={portfolio.refreshToken}
            />
          </Section>

          <Section spacing="md">
            <RecentTransactionsTable transactions={transactions} arcExplorer={arcExplorer} />
          </Section>

          <Section spacing="md">
            <WalletActivityTimeline items={timelineItems} arcExplorer={arcExplorer} />
          </Section>

          <Section spacing="md">
            <NetworkStatusPanel networkInfo={networkInfo} />
          </Section>
        </>
      )}

      <Section spacing="md">
        <WalletQuickActions />
      </Section>
    </Container>
  )
}
