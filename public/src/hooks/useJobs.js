import { useCallback, useState } from 'react'
import { listJobsForAccount } from '../lib/blockchain/jobs'
import { usePolling } from './usePolling'

// Was 20s. eth_getLogs (x2) plus one eth_call per open job on every tick
// adds up fast against the shared Arc Testnet RPC's rate limit, especially
// with useBalances/useNetworkStatus polling in parallel on the same page.
// 45s keeps Jobs reasonably fresh without contributing to that burst.
const POLL_INTERVAL_MS = 45000

/**
 * Loads every ERC-8183 job where the connected account is client or
 * provider, polling lightly so Jobs dashboard/history stay fresh. Follows
 * the same provider/account/poll shape as useBalances.
 */
export function useJobs(provider, account) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!provider || !account) {
      setJobs([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await listJobsForAccount(provider, account)
      setJobs(result)
    } catch (e) {
      // ethers v6 sometimes wraps a real RPC rejection (e.g. eth_getLogs
      // range/result-size limits) in a generic "could not coalesce error"
      // shortMessage. When that happens, the actual RPC-provided reason is
      // in e.error / e.info.error — prefer that so the message shown is
      // never the opaque wrapper text.
      const underlying = e?.error?.message || e?.error?.details || e?.info?.error?.message
      setError(underlying || e?.reason || e?.shortMessage || e?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [provider, account])

  usePolling(refresh, POLL_INTERVAL_MS, Boolean(provider && account))

  return { jobs, loading, error, refresh }
}
