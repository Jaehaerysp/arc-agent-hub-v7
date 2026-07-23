import { useCallback, useEffect, useState } from 'react'
import { getJob, getUsdcAllowance } from '../lib/blockchain/jobs'

/**
 * Loads a single job by id (read-only — works with a signer or a plain
 * provider) plus the connected account's current USDC allowance for the
 * Agentic Commerce contract, which JobActionPanel needs to tell "Approve
 * USDC" and "Fund Job" apart while a job is still Open.
 */
export function useJob(provider, account, jobId) {
  const [job, setJob] = useState(null)
  const [allowance, setAllowance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const refresh = useCallback(async () => {
    if (!provider || jobId === undefined || jobId === null) return

    setLoading(true)
    setError(null)
    setNotFound(false)

    try {
      const result = await getJob(provider, jobId)
      setJob(result)

      if (account) {
        try {
          const currentAllowance = await getUsdcAllowance(provider, account)
          setAllowance(currentAllowance)
        } catch {
          setAllowance(null)
        }
      }
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || 'Failed to load job'
      if (/could not decode|missing revert|call revert|invalid job|bad data/i.test(msg)) {
        setNotFound(true)
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [provider, account, jobId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { job, allowance, loading, error, notFound, refresh }
}
