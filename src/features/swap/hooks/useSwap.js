import { useCallback, useEffect, useRef, useState } from 'react'
import { executeSwap, getSwapAdapter, getSwapKitKey } from '../services/swapService'
import { getSwapQuote, getSwapQuoteKey } from '../services/quoteService'
import { scheduleBackgroundRetry, clearBackgroundRetry } from '../services/quoteRetry'
import { shortAddr } from '../../../lib/format'

const QUOTE_DEBOUNCE_MS = 500

/**
 * Orchestrates the Swap Flow end to end:
 *
 *   Connect Wallet -> Enter Amount -> Estimate Quote -> Display Quote
 *   -> Swap -> Update Balances -> Save History
 *
 * (Token In/Out selection happens ahead of "Enter Amount" via
 * `setTokenIn`/`setTokenOut`, then every amount/pair/slippage change
 * re-triggers "Estimate Quote" below.)
 *
 * Quoting and execution are two different SDK calls
 * (`quoteService.getSwapQuote` / `swapService.executeSwap`) but share one
 * App Kit adapter (`getSwapAdapter`, resolved once and reused) so the
 * quote shown to the person is generated the same way the swap itself
 * will be signed.
 *
 * Same "pure service + thin hook" shape as Bridge's `useBridge`/
 * `useBridgeEstimate` and Payments' `usePaymentSend`/`useFeeEstimate` —
 * this hook owns only React state/lifecycle; every actual SDK call lives
 * in `services/`.
 */
export function useSwap(account, addActivity) {
  const [tokenIn, setTokenIn] = useState(null)
  const [tokenOut, setTokenOut] = useState(null)
  const [amountIn, setAmountIn] = useState('')
  const [slippageBps, setSlippageBps] = useState(300) // 3% — same App Kit default as `kit.swap()` itself

  const [quote, setQuote] = useState(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState(null)
  const quoteRequestId = useRef(0)

  const [status, setStatus] = useState('idle') // idle | pending | success | error
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const isValid = Boolean(
    account && tokenIn && tokenOut && tokenIn.key !== tokenOut.key && amountIn && Number(amountIn) > 0
  )

  // Estimate Quote — re-estimates whenever the pair/amount/slippage
  // changes to a valid combination (Display Quote is just SwapCard
  // rendering `quote` below). Advisory only: a stale/failed quote never
  // blocks the Swap button, same as Bridge's `useBridgeEstimate`.
  useEffect(() => {
    if (!isValid) {
      setQuote(null)
      setQuoteError(null)
      setQuoteLoading(false)
      return
    }

    const currentRequest = ++quoteRequestId.current
    const stillCurrent = () => quoteRequestId.current === currentRequest
    setQuoteLoading(true)

    const fetchQuote = async () => {
      try {
        const kitKey = getSwapKitKey()
        const adapter = await getSwapAdapter()
        const result = await getSwapQuote({ adapter, kitKey, tokenIn, tokenOut, amountIn, slippageBps, shouldContinue: stillCurrent })
        if (!stillCurrent() || !result) return // superseded by a newer request

        setQuote(result.error ? null : result)
        setQuoteError(result.error)

        // ArcVault-style background retry (guide Part 7, Tier B): a quote
        // that came back stale (served from cache after a live failure) or
        // hard-failed with no cache gets one more attempt shortly after,
        // up to 3 times, in case the transient failure has cleared.
        const quoteKey = getSwapQuoteKey(tokenIn, tokenOut, amountIn, slippageBps)
        if (result.stale || result.error) {
          scheduleBackgroundRetry(quoteKey, () => {
            if (stillCurrent()) fetchQuote()
          })
        } else {
          clearBackgroundRetry(quoteKey)
        }
      } catch (e) {
        if (!stillCurrent()) return
        setQuote(null)
        setQuoteError(e?.message || 'Quote unavailable')
      } finally {
        if (stillCurrent()) setQuoteLoading(false)
      }
    }

    const timer = setTimeout(fetchQuote, QUOTE_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [isValid, tokenIn, tokenOut, amountIn, slippageBps])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setSuccess(null)
  }, [])

  const runSwap = useCallback(async () => {
    if (!tokenIn || !tokenOut) return null

    setStatus('pending')
    setError(null)
    setSuccess(null)

    const activityMeta = {
      type: 'swap',
      label: `${tokenIn.symbol} → ${tokenOut.symbol} swap`,
      failLabel: 'Swap failed',
      detail: `${amountIn} ${tokenIn.symbol} → ${tokenOut.symbol}`,
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn,
      wallet: shortAddr(account),
    }

    const result = await executeSwap({ account, tokenIn, tokenOut, amountIn, slippageBps })

    if (result.error) {
      setStatus('error')
      setError(result.error)
      if (addActivity) {
        addActivity({ status: 'error', detail: result.error, ...activityMeta })
      }
      return null
    }

    setStatus('success')
    setSuccess(result)

    if (addActivity) {
      addActivity({
        status: 'success',
        txHash: result.txHash,
        amountOut: result.amountOut,
        ...activityMeta,
      })
    }

    return result
  }, [account, tokenIn, tokenOut, amountIn, slippageBps, addActivity])

  return {
    tokenIn,
    tokenOut,
    amountIn,
    slippageBps,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setSlippageBps,
    quote,
    quoteLoading,
    quoteError,
    isValid,
    runSwap,
    status,
    loading: status === 'pending',
    error,
    success,
    reset,
  }
}
