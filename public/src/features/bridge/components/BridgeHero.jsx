import { HeroCard, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { NETWORK_LABEL } from '../../wallet/walletAnalytics'

/**
 * Bridge Hero — same HeroCard language as Wallet/Transfer/Payments. Shows
 * the one figure that matters before bridging: available balance in the
 * asset currently selected, read live via the same `useTokenBalances`
 * hook every Treasury page shares.
 */
export function BridgeHero({ token, balance, loading }) {
  return (
    <HeroCard
      className="wv7-hero wv7-transfer-hero"
      eyebrow="Bridge Center"
      title="Bridge Assets"
      description={`Move USDC and EURC between ${NETWORK_LABEL} and supported testnets`}
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
