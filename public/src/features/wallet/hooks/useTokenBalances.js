import { useCallback, useRef, useState } from 'react'
import { usePolling } from '../../../hooks/usePolling'
import { fetchTokenBalance, fetchTokenBalances } from '../services/tokenBalanceService'
import { WALLET_TOKENS } from '../services/tokenRegistry'

// Background poll cadence. Was 15s — widened to 60-90s (Sprint 2 Wallet
// Performance Optimization); see useBalances.js for the same change and
// rationale. Event-driven refreshes (`refresh()` below) still fire
// immediately on connect/network/token-list change or a manual click.
const POLL_INTERVAL_MS = 75000

/**
 * Merges a freshly-fetched balances array into the previous one, keeping
 * each entry's previous object reference when nothing about it changed
 * (same key/balance/error). This keeps the array itself referentially
 * stable across identical background polls, so memoized selectors and
 * `React.memo`'d asset cards downstream don't re-render for no reason —
 * and if literally nothing changed, the whole array reference is kept too.
 */
function mergeBalances(prev, next) {
  if (prev.length !== next.length) return next

  let changed = false
  const merged = next.map((entry, i) => {
    const prevEntry = prev[i]
    if (prevEntry && prevEntry.key === entry.key && prevEntry.balance === entry.balance && prevEntry.error === entry.error) {
      return prevEntry
    }
    changed = true
    return entry
  })

  return changed ? merged : prev
}

/**
 * Live balances for the extended Wallet token registry (everything beyond
 * native + ANV, which `useBalances` already covers). Same shape and polling
 * cadence as `useBalances` so the two hooks feel identical to consume.
 *
 * `tokens` are read from `provider` only — never from a private key — so
 * this only ever returns what the connected browser wallet actually holds.
 *
 * `refresh({ silent: true })` (the background poll tick) never toggles
 * `loading` once the first successful batch has resolved, and the merge
 * above means unchanged balances keep their previous reference — so asset
 * cards stay visually stable across routine background refreshes instead
 * of flashing a loading state or re-mounting. A plain `refresh()` (wallet
 * connect, network switch, token-list change, or the "Refresh" button)
 * always shows loading.
 */
export function useTokenBalances(provider, account, tokens = WALLET_TOKENS) {
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasLoadedRef = useRef(false)

  const refresh = useCallback(
    async ({ silent = false } = {}) => {
      if (!provider || !account) {
        hasLoadedRef.current = false
        setBalances([])
        setError(null)
        setLoading(false)
        return
      }

      const showLoading = !silent || !hasLoadedRef.current
      if (showLoading) setLoading(true)

      const { results, error: batchError } = await fetchTokenBalances(provider, account, tokens)

      setBalances((prev) => mergeBalances(prev, results))
      setError(batchError)
      hasLoadedRef.current = true
      if (showLoading) setLoading(false)
    },
    [provider, account, tokens]
  )

  const backgroundRefresh = useCallback(() => refresh({ silent: true }), [refresh])

  usePolling(backgroundRefresh, POLL_INTERVAL_MS, Boolean(provider && account))

  /**
   * Re-reads a single token's balance (the per-card "Refresh Balance"
   * affordance) without disturbing the rest of the list or the loading
   * flag for the whole batch.
   */
  const refreshOne = useCallback(
    async (key) => {
      if (!provider || !account) return
      const token = tokens.find((t) => t.key === key)
      if (!token) return

      const result = await fetchTokenBalance(provider, token, account)
      setBalances((prev) => prev.map((b) => (b.key === key ? result : b)))
    },
    [provider, account, tokens]
  )

  return { balances, loading, error, refresh, refreshOne }
}
