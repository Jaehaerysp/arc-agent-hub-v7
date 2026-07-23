import { useCallback, useMemo, useState } from 'react'
import {
  computeAssetBalances,
  computeExtendedAssetBalances,
  computePortfolioTotals,
  filterAssetsBySearch,
  filterAssetsByCategory,
} from '../walletAnalytics'

/**
 * usePortfolio — Sprint 1 (v8 Wallet Module).
 *
 * Composes the two existing balance sources (`useBalances` for native +
 * ANV, `useTokenBalances` for the extended registry) into the single
 * categorized, searchable/filterable asset list the Wallet Portfolio
 * Dashboard and Asset Balances panel both render. Introduces no new
 * on-chain reads of its own — it's a thin coordination layer over hooks
 * that already exist, plus the local UI state (search text, active
 * category tab, last-refreshed timestamp) those views need.
 *
 * @param {object} balancesState - `{ nativeBalance, anvBalance, loading, refresh }` from `useBalances`.
 * @param {object} tokenBalancesState - `{ balances, loading, error, refresh, refreshOne }` from `useTokenBalances`.
 * @param {boolean} isArcNetwork
 */
export function usePortfolio(balancesState, tokenBalancesState, isArcNetwork) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)

  const { nativeBalance, anvBalance, loading: balancesLoading, refresh: refreshBalances } = balancesState
  const { balances: tokenBalances, loading: tokenBalancesLoading, error: tokenBalancesError, refresh: refreshTokens, refreshOne } = tokenBalancesState

  const assets = useMemo(
    () => computeExtendedAssetBalances(computeAssetBalances(nativeBalance, anvBalance, isArcNetwork), tokenBalances, isArcNetwork),
    [nativeBalance, anvBalance, isArcNetwork, tokenBalances]
  )

  const filteredAssets = useMemo(() => {
    const byCategory = filterAssetsByCategory(assets, category)
    return filterAssetsBySearch(byCategory, search)
  }, [assets, category, search])

  const totals = useMemo(() => computePortfolioTotals(assets), [assets])

  const loading = balancesLoading || tokenBalancesLoading

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshBalances(), refreshTokens()])
    setLastUpdated(Date.now())
  }, [refreshBalances, refreshTokens])

  return {
    assets,
    filteredAssets,
    loading,
    error: tokenBalancesError,
    totals,
    search,
    setSearch,
    category,
    setCategory,
    lastUpdated,
    refreshAll,
    refreshToken: refreshOne,
  }
}
