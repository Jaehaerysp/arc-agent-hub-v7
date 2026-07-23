import { HeroCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'

/**
 * Payments Hero — same HeroCard language as Wallet/Transfer. Shows the
 * one figure that matters before sending: available balance in whichever
 * token is currently selected, read live via the same `useTokenBalances`
 * hook the Wallet page's Asset Balances panel already uses.
 *
 * Sprint 2 (Universal Payment Support): generalized from a hardcoded USDC
 * balance/label to any token in `PAYMENT_TOKENS`.
 */
export function PaymentsHero({ token, balance, loading }) {
  return (
    <HeroCard
      className="wv7-hero wv7-transfer-hero"
      eyebrow="Payments"
      title="Send Payments"
      description={`Send any tracked asset to any address on ${NETWORK_LABEL}`}
      actions={
        <div className="wv7-hero-facts" role="list">
          <div className="wv7-hero-fact wv7-hero-fact-hero" role="listitem" aria-label={`Available ${token.symbol} balance`}>
            <span className="wv7-hero-fact-label">Available Balance</span>
            <span className="wv7-hero-fact-value wv7-hero-gradient">
              {loading && balance === null ? (
                <Skeleton width={90} height={26} />
              ) : (
                <AnimatedCounter value={Number(balance) || 0} decimals={2} duration={1000} suffix={` ${token.symbol}`} />
              )}
            </span>
          </div>
        </div>
      }
    />
  )
}
