import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeroCard, Button, Badge, Skeleton } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { shortAddr } from '../../../lib/format'
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

/**
 * Mission Control Hero — the one gradient/glow hero element on the page
 * (Blueprint checklist rule #1 and #12). Answers "is everything okay, and
 * what's mine" in one glance: greeting, connected wallet, active agents,
 * running jobs, reputation (trust), validation, and ANV balance.
 *
 * A slim attention row renders underneath the facts strip only when there
 * is something to act on — preserving the previous AttentionList behavior
 * (network switch, agent registration, expired jobs, jobs to validate)
 * without a separate full-width section competing with the hero.
 */
export function MissionControlHero({
  wallet,
  summary,
  anvBalance,
  balancesLoading,
  agentCount,
  jobsRunning,
  jobsLoading,
  trust,
  validation,
  attentionItems,
  onSwitchNetwork,
  onRefreshJobs,
}) {
  const navigate = useNavigate()
  const now = useClock()
  const greeting = getGreeting(now)

  const handleAttentionAction = (item) => {
    if (item.cta.to) return navigate(item.cta.to)
    if (item.cta.action === 'switchNetwork') return onSwitchNetwork?.()
    if (item.cta.action === 'refreshJobs') return onRefreshJobs?.()
  }

  return (
    <HeroCard
      className="dv7-hero"
      eyebrow="Mission Control"
      title={greeting}
      description={summary}
      actions={
        <div className="dv7-hero-facts" role="list">
          <div className="dv7-hero-fact" role="listitem" aria-label={`Wallet ${wallet.account ? shortAddr(wallet.account) : 'not connected'}`}>
            <span className="dv7-hero-fact-label">Wallet</span>
            <span className="dv7-hero-fact-value mono">
              <span className="dv7-status-dot" data-tone={wallet.isArcNetwork ? 'healthy' : 'attention'} />
              {shortAddr(wallet.account)}
            </span>
          </div>

          <div className="dv7-hero-fact" role="listitem" aria-label={`Active agents ${agentCount}`}>
            <span className="dv7-hero-fact-label">Active Agents</span>
            <span className="dv7-hero-fact-value">{agentCount}</span>
          </div>

          <div className="dv7-hero-fact" role="listitem" aria-label={`Running jobs ${jobsRunning}`}>
            <span className="dv7-hero-fact-label">Running Jobs</span>
            <span className="dv7-hero-fact-value">
              {jobsLoading ? <Skeleton width={28} height={20} /> : jobsRunning}
            </span>
          </div>

          <div className="dv7-hero-fact" role="listitem" aria-label={`Reputation ${trust.rate === null ? 'not yet available' : trust.rate + ' percent'}`}>
            <span className="dv7-hero-fact-label">Reputation</span>
            <span className="dv7-hero-fact-value">{trust.rate === null ? '—' : `${trust.rate}%`}</span>
          </div>

          <div className="dv7-hero-fact" role="listitem" aria-label={`Validation ${validation.rate === null ? 'not yet available' : validation.rate + ' percent'}`}>
            <span className="dv7-hero-fact-label">Validation</span>
            <span className="dv7-hero-fact-value">{validation.rate === null ? '—' : `${validation.rate}%`}</span>
          </div>

          <div className="dv7-hero-fact dv7-hero-fact-hero" role="listitem" aria-label="ANV balance">
            <span className="dv7-hero-fact-label">ANV Balance</span>
            <span className="dv7-hero-fact-value dv7-hero-gradient">
              {balancesLoading && anvBalance === null ? (
                <Skeleton width={72} height={26} />
              ) : (
                <AnimatedCounter value={Number(anvBalance) || 0} decimals={2} duration={1200} />
              )}
            </span>
          </div>
        </div>
      }
    >
      {attentionItems.length > 0 && (
        <div className="dv7-hero-attention" aria-live="polite">
          {attentionItems.map((item) => (
            <div key={item.id} className="dv7-hero-attention-item" data-tone={item.tone}>
              <span className="dv7-status-dot" data-tone={item.tone} />
              <span className="dv7-hero-attention-text">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </span>
              <Button
                variant={item.tone === 'attention' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleAttentionAction(item)}
              >
                {item.cta.label}
              </Button>
            </div>
          ))}
        </div>
      )}
      {attentionItems.length === 0 && (
        <div className="dv7-hero-allclear">
          <Badge variant="success" size="sm">All systems nominal</Badge>
          <span>Nothing needs your attention right now.</span>
        </div>
      )}
    </HeroCard>
  )
}
