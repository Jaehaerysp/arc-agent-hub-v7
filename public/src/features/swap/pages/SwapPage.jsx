import { useEffect, useMemo, useState } from 'react'
import { useWalletContext } from '../../../app/providers/WalletProvider'
import { useTokenBalances } from '../../wallet/hooks/useTokenBalances'
import { useSwap } from '../hooks/useSwap'
import { Container, Section, HeroCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { SwapCard } from '../components/SwapCard'
import { SwapSettings } from '../components/SwapSettings'
import { SwapHistory } from '../components/SwapHistory'
import { SwapStatusDialog } from '../components/SwapStatusDialog'
import { SWAP_TOKENS, getOppositeSwapToken } from '../services/swapService'
import { computeSwapHistory } from '../services/swapHistoryService'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'
import '../styles/swap.css'

/**
 * Universal Token Swap (Sprint 4) — exchanges USDC and EURC on Arc
 * Testnet through the connected browser wallet. Built entirely on the
 * Wallet/Payments/Bridge architecture from Sprints 1–3:
 *   - `useTokenBalances` (Wallet's own hook) reads live balances for
 *     `SWAP_TOKENS`, same as Payments/Bridge do for their own token lists.
 *   - `swapService`/`quoteService`/`useSwap` follow the same "pure
 *     service + thin hook" shape as `usdcPaymentService`/`useFeeEstimate`/
 *     `usePaymentSend` and `bridgeService`/`useBridgeEstimate`/`useBridge`.
 *   - History is a selector over `wallet.activity` (`type: 'swap'`), same
 *     as Payment History / Bridge History — no new persisted store.
 *
 * No private keys anywhere in this flow — every read and write uses the
 * `provider`/`signer`/`account` from the connected browser wallet, and
 * the App Kit adapter itself is built from that same wallet
 * (`createViemAdapterFromProvider`, see swapService.js).
 */
export default function SwapPage() {
  const { signer, account, provider, addActivity, activity, arcExplorer, isArcNetwork } = useWalletContext()
  const { balances, loading: balanceLoading, refresh: refreshBalance } = useTokenBalances(provider, account, SWAP_TOKENS)

  const swap = useSwap(account, addActivity)
  const { tokenIn, tokenOut, setTokenIn, setTokenOut, amountIn, setAmountIn, slippageBps, setSlippageBps } = swap

  // Default the pair once tokens are known — USDC -> EURC, the same
  // direction both reference scripts lead with.
  useEffect(() => {
    if (!tokenIn && SWAP_TOKENS[0]) setTokenIn(SWAP_TOKENS[0])
    if (!tokenOut && SWAP_TOKENS[1]) setTokenOut(SWAP_TOKENS[1])
  }, [tokenIn, tokenOut, setTokenIn, setTokenOut])

  const balance = useMemo(
    () => (tokenIn ? balances.find((b) => b.key === tokenIn.key)?.balance ?? null : null),
    [balances, tokenIn]
  )

  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const clearState = () => {
    setSubmitted(false)
    setFormError(null)
    swap.reset()
  }

  const handleTokenInChange = (key) => {
    clearState()
    setAmountIn('')
    const next = SWAP_TOKENS.find((t) => t.key === key)
    setTokenIn(next)
    if (tokenOut && next && tokenOut.key === next.key) setTokenOut(getOppositeSwapToken(next.key))
  }

  const handleTokenOutChange = (key) => {
    clearState()
    const next = SWAP_TOKENS.find((t) => t.key === key)
    setTokenOut(next)
    if (tokenIn && next && tokenIn.key === next.key) setTokenIn(getOppositeSwapToken(next.key))
  }

  const handleSwitchTokens = () => {
    clearState()
    setAmountIn('')
    const prevIn = tokenIn
    setTokenIn(tokenOut)
    setTokenOut(prevIn)
  }

  const handleMax = () => {
    if (balance !== null) {
      clearState()
      setAmountIn(balance.toString())
    }
  }

  const handleSubmit = async () => {
    setFormError(null)

    if (!tokenIn || !tokenOut) return setFormError('Select both tokens to swap')
    if (tokenIn.key === tokenOut.key) return setFormError('Token In and Token Out must be different')
    if (!amountIn || Number(amountIn) <= 0) return setFormError('Valid amount required')
    if (balance !== null && Number(amountIn) > Number(balance)) return setFormError('Amount exceeds available balance')

    const result = await swap.runSwap()

    if (result) {
      setSubmitted(true)
      setDialogOpen(true)
      refreshBalance()
    } else {
      setDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    if (submitted) setAmountIn('')
    clearState()
  }

  const swaps = useMemo(() => computeSwapHistory(activity, 8), [activity])

  return (
    <Container size="wide" className="wv7-transfer-page">
      <Section spacing="md">
        <HeroCard
          className="wv7-hero wv7-transfer-hero"
          eyebrow="Universal Token Swap"
          title="Swap Tokens"
          description={`Exchange USDC and EURC on ${NETWORK_LABEL}`}
          actions={
            <div className="wv7-hero-facts" role="list">
              <div
                className="wv7-hero-fact wv7-hero-fact-hero"
                role="listitem"
                aria-label={`Available ${tokenIn?.symbol || ''} balance`}
              >
                <span className="wv7-hero-fact-label">Available Balance</span>
                <span className="wv7-hero-fact-value wv7-hero-gradient">
                  {balanceLoading && balance === null ? (
                    <Skeleton width={90} height={26} />
                  ) : (
                    <AnimatedCounter
                      value={Number(balance) || 0}
                      decimals={2}
                      duration={1000}
                      suffix={tokenIn ? ` ${tokenIn.symbol}` : ''}
                    />
                  )}
                </span>
              </div>
            </div>
          }
        />
      </Section>

      <Section spacing="md">
        <div className="swap-layout">
          <SwapCard
            tokens={SWAP_TOKENS}
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            balance={balance}
            quote={swap.quote}
            quoteLoading={swap.quoteLoading}
            quoteError={swap.quoteError}
            signer={signer}
            isArcNetwork={isArcNetwork}
            loading={swap.loading}
            submitted={submitted}
            formError={formError}
            swapError={swap.error}
            onTokenInChange={handleTokenInChange}
            onTokenOutChange={handleTokenOutChange}
            onSwitchTokens={handleSwitchTokens}
            onAmountChange={(v) => { clearState(); setAmountIn(v) }}
            onMax={handleMax}
            onSubmit={handleSubmit}
          />

          <SwapSettings slippageBps={slippageBps} disabled={swap.loading} onChange={setSlippageBps} />
        </div>
      </Section>

      <Section spacing="md">
        <SwapHistory swaps={swaps} arcExplorer={arcExplorer} />
      </Section>

      <SwapStatusDialog
        open={dialogOpen}
        status={swap.status}
        txHash={swap.success?.txHash}
        explorerUrl={swap.success?.explorerUrl}
        amountIn={amountIn}
        amountOut={swap.success?.amountOut}
        tokenIn={tokenIn?.symbol}
        tokenOut={tokenOut?.symbol}
        error={swap.error}
        onClose={handleDialogClose}
      />
    </Container>
  )
}
