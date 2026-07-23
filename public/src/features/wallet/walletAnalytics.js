import { CONTRACTS } from '../../contracts/registry'
import { formatTokenAmount } from '../../lib/format'

/**
 * Pure selectors for Wallet v7 (Mission 8). Every function here reads
 * from data the app already fetches — `useBalances` (native + ANV) and
 * `wallet.activity` (locally logged transactions) — no new on-chain
 * reads are introduced.
 *
 * Documented limitation, same pattern as trustAnalytics.js: there is no
 * price oracle wired into this app, so no USD conversion is invented for
 * either token. Arc Testnet's native gas currency is itself named USDC
 * (see `src/chains/arc.js` — `nativeCurrency.symbol`), so "Native
 * Balance" and "USDC Balance" in the Mission 8 brief are the same
 * on-chain figure; ANV is the separate ERC-20 balanced tracked by
 * `useBalances`. Both are shown as real, distinct holdings rather than
 * summed into a fabricated single "portfolio value".
 */

export const NETWORK_LABEL = 'Arc Testnet'

/** Asset Balances — one card per real, held token; never fabricates a USD figure. */
export function computeAssetBalances(nativeBalance, anvBalance, isArcNetwork) {
  return [
    {
      key: 'native',
      symbol: 'USDC',
      name: 'Native Gas Token',
      category: 'native',
      balance: nativeBalance,
      balanceFormatted: formatTokenAmount(nativeBalance, 4),
      usdValue: null,
      network: NETWORK_LABEL,
      status: isArcNetwork ? 'connected' : 'wrong-network',
    },
    {
      key: 'anv',
      symbol: 'ANV',
      name: 'ANV Token',
      category: 'custom',
      balance: anvBalance,
      balanceFormatted: formatTokenAmount(anvBalance, 4),
      usdValue: null,
      network: NETWORK_LABEL,
      status: isArcNetwork ? 'connected' : 'wrong-network',
      address: CONTRACTS.ANV_TOKEN.address,
    },
  ]
}

/**
 * Asset Balances (extended) — merges the two always-tracked assets (native
 * + ANV, from `computeAssetBalances` above) with live results from
 * `useTokenBalances` for every other token in the wallet registry. Kept as
 * a separate function so `computeAssetBalances`'s existing shape/tests are
 * untouched; WalletPage is the only caller that needs the merged list.
 *
 * A token whose read failed keeps `balance: null` and carries its `error`
 * through so the UI can show a per-card error state instead of silently
 * showing zero.
 */
export function computeExtendedAssetBalances(baseAssets, tokenBalances, isArcNetwork) {
  const extra = tokenBalances.map((token) => ({
    key: token.key,
    symbol: token.symbol,
    name: token.name,
    category: token.category,
    balance: token.balance,
    balanceFormatted: token.error ? 'Error' : formatTokenAmount(token.balance, 4),
    usdValue: null,
    network: NETWORK_LABEL,
    status: token.error ? 'error' : isArcNetwork ? 'connected' : 'wrong-network',
    address: token.address,
    error: token.error,
  }))

  return [...baseAssets, ...extra]
}

/**
 * Portfolio Dashboard totals (Sprint 1 / v8 Wallet Module) — "Total
 * Assets" is how many tracked tokens the connected account actually
 * holds a nonzero balance of; "Number of Tokens" is the full tracked
 * registry size (native + custom + AI + DeFi), regardless of balance.
 * Both are derived only from the same `assets` list AssetBalances
 * already renders — no new reads.
 */
export function computePortfolioTotals(assets) {
  const totalHeld = assets.filter((a) => typeof a.balance === 'number' && a.balance > 0).length
  return {
    totalTokens: assets.length,
    totalHeld,
  }
}

/**
 * Search Assets — filters the asset list by name, symbol, or contract
 * address (the "Explorer" field in the Sprint 1 brief: the identifier
 * that also drives the ArcScan link). Case-insensitive, matches on any
 * substring. An empty/whitespace query returns the list unchanged.
 */
export function filterAssetsBySearch(assets, query) {
  const q = query?.trim().toLowerCase()
  if (!q) return assets
  return assets.filter((a) => (a.name || '').toLowerCase().includes(q) || (a.symbol || '').toLowerCase().includes(q) || (a.address || '').toLowerCase().includes(q))
}

/** Category tabs filter — 'all' (the synthetic default) returns the list unchanged. */
export function filterAssetsByCategory(assets, category) {
  if (!category || category === 'all') return assets
  return assets.filter((a) => a.category === category)
}

const TX_TYPE_LABELS = {
  transfer: 'Transfer',
  job: 'Job',
  register: 'Registration',
  feedback: 'Feedback',
  validation: 'Validation',
  network: 'Network',
}

export function txTypeLabel(type) {
  return TX_TYPE_LABELS[type] || (type ? type[0].toUpperCase() + type.slice(1) : 'Activity')
}

/** Recent Transactions table — only activity entries with a real on-chain tx hash. */
export function computeRecentTransactions(activity, limit = 8) {
  return activity
    .filter((a) => a.txHash)
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      hash: a.txHash,
      type: txTypeLabel(a.type),
      amount: a.detail || '—',
      network: NETWORK_LABEL,
      status: a.status,
      date: a.timestamp,
    }))
}

/** Activity Timeline — every locally logged event, success or failure, newest first. */
export function computeActivityTimeline(activity, limit = 10) {
  return activity.slice(0, limit).map((a) => ({
    id: a.id,
    type: a.type,
    label: a.label,
    detail: a.detail,
    status: a.status,
    txHash: a.txHash,
    timestamp: a.timestamp,
  }))
}

/** Network Information — RPC, chain, contract registry status; all static config plus one live poll. */
export function computeNetworkInfo({ isArcNetwork, chainId, rpcUrl, blockNumber, gasPriceGwei, latencyMs }) {
  return {
    chainName: NETWORK_LABEL,
    chainId,
    isArcNetwork,
    rpcUrl,
    blockNumber,
    gasPriceGwei,
    latencyMs,
    registryStatus: Object.values(CONTRACTS).length === 4 ? 'operational' : 'degraded',
    contractCount: Object.values(CONTRACTS).length,
  }
}
