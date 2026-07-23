import { useEffect, useRef, useState } from 'react'
import { estimateBridgeFee, estimateBridgeArrival } from '../services/bridgeEstimator'
import { BRIDGE_CONTRACTS } from '../services/bridgeContracts'

const DEBOUNCE_MS = 500

/**
 * Debounced live estimate for a pending bridge, same shape as Payments'
 * `useFeeEstimate`. Re-estimates whenever `amount`/`token`/`network`
 * change to a valid combination; never blocks the Bridge button — a
 * stale/failed estimate is advisory only (see BridgeForm).
 */
export function useBridgeEstimate(provider, account, amount, token, network) {
  const [fee, setFee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  const isValid = provider && account && token && network && amount && Number(amount) > 0

  useEffect(() => {
    if (!isValid) {
      setFee(null)
      setError(null)
      setLoading(false)
      return
    }

    const currentRequest = ++requestId.current
    setLoading(true)

    const timer = setTimeout(async () => {
      const spender = BRIDGE_CONTRACTS[network.id]?.tokenMessenger
      const result = await estimateBridgeFee(token, provider, account, amount, spender)
      if (requestId.current !== currentRequest) return // superseded by a newer request

      setFee(result.error ? null : result)
      setError(result.error)
      setLoading(false)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [provider, account, amount, isValid, token, network])

  const arrival = network ? estimateBridgeArrival(network.id) : null

  return { fee, loading, error, arrival }
}
