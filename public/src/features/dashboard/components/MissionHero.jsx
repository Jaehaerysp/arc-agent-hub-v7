import { useEffect, useState } from 'react'
import { Card } from '../../../ui/Card'
import { Skeleton } from '../../../ui/Skeleton'
import { shortAddr, formatTokenAmount } from '../../../lib/format'
import { getGreeting } from '../dashboardLogic'

/** Live wall-clock, updated once a minute — cheap enough to not need memoizing further. */
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function MissionHero({ wallet, summary, anvBalance, balancesLoading }) {
  const now = useClock()
  const greeting = getGreeting(now)
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Card variant="hero" className="mc-hero">
      <div className="mc-hero-main">
        <div className="mc-hero-greeting">{greeting}</div>
        <div className="mc-hero-summary">{summary}</div>
      </div>

      <div className="mc-hero-facts">
        <div className="mc-hero-fact">
          <span className="mc-hero-fact-label">Network</span>
          <span className={`mc-hero-fact-value ${wallet.isArcNetwork ? '' : 'is-attention'}`}>
            <span className="mc-status-dot" data-tone={wallet.isArcNetwork ? 'healthy' : 'attention'} />
            {wallet.isArcNetwork ? 'Arc Testnet' : 'Wrong network'}
          </span>
        </div>

        <div className="mc-hero-divider" />

        <div className="mc-hero-fact">
          <span className="mc-hero-fact-label">Wallet</span>
          <span className="mc-hero-fact-value mono">{shortAddr(wallet.account)}</span>
        </div>

        <div className="mc-hero-divider" />

        <div className="mc-hero-fact mc-hero-fact-hero">
          <span className="mc-hero-fact-label">ANV Balance</span>
          <span className="mc-hero-fact-value mc-hero-gradient">
            {balancesLoading && anvBalance === null ? <Skeleton width={60} height={22} /> : formatTokenAmount(anvBalance, 2)}
          </span>
        </div>

        <div className="mc-hero-divider" />

        <div className="mc-hero-fact">
          <span className="mc-hero-fact-label">Local Time</span>
          <span className="mc-hero-fact-value">{time}</span>
        </div>
      </div>
    </Card>
  )
}
