import { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { estimateTransferFee, USDC_TOKEN } from '../services/usdcPaymentService'

const DEBOUNCE_MS = 500

/**
 * Debounced live fee estimate for a pending payment in `token` (defaults
 * to USDC, unchanged from before Sprint 2's Universal Payment Support).
 * Re-estimates whenever `to`/`amount`/`token` change to a valid
 * combination, using the connected wallet's provider — never runs against
 * an invalid recipient/amount, and never blocks the Send button (see
 * PaymentForm: a stale/failed estimate doesn't stop `usePaymentSend`, it's
 * advisory only, same as `kit.estimateSend()` being a separate call from
 * `kit.send()` in send-usdc.ts).
 */
export function useFeeEstimate(provider, account, to, amount, token = USDC_TOKEN) {
  const [fee, setFee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  const toTrimmed = (to || '').trim()
  const isValid = provider && account && ethers.isAddress(toTrimmed) && amount && Number(amount) > 0

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
      const result = await estimateTransferFee(token, provider, account, toTrimmed, amount)
      if (requestId.current !== currentRequest) return // a newer request superseded this one

      setFee(result.error ? null : result)
      setError(result.error)
      setLoading(false)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [provider, account, toTrimmed, amount, isValid, token])

  return { fee, loading, error }
}
