import { useCallback, useState } from 'react'

/**
 * Same loading/error/success/reset shape as useContractWrite, generalized to
 * wrap an arbitrary async function instead of a single contract method call.
 * Used for jobs.js helpers (createJob, submitDeliverable, completeJob) that
 * do more than one thing (event parsing, hashing) so they aren't a fit for
 * useContractWrite's single execute(method, args) call.
 */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const reset = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  const run = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await fn()
      setSuccess(result)
      return result
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || 'Transaction failed'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { run, loading, error, success, reset }
}
