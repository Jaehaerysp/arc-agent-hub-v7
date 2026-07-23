import { useWalletContext } from '../../app/providers/WalletProvider'
import { useBalances } from '../../hooks/useBalances'
import { useJobs } from '../../hooks/useJobs'
import { computeJobStats } from '../jobs/components/JobStats'
import { getAgentByWallet } from '../../data/agents'
import { Container, Section } from '../../ui/design-system'
import { MissionControlHero } from './components/MissionControlHero'
import { MissionMetrics } from './components/MissionMetrics'
import { AiWorkforcePanel } from './components/AiWorkforcePanel'
import { MissionAnalytics } from './components/MissionAnalytics'
import { MissionTimeline } from './components/MissionTimeline'
import { MissionQuickActions } from './components/MissionQuickActions'
import {
  splitJobsByRole,
  computeTrust,
  computeValidationRate,
  computeAttentionItems,
  computeMissionSummary,
  computeActivityBreakdown,
  computeJobsBreakdown,
  computeWorkforce,
} from './dashboardLogic'

/**
 * Dashboard v7 — "AI Mission Control." Layout order: Hero -> Metrics ->
 * AI Workforce -> Analytics -> Activity Timeline -> Quick Actions, per the
 * Mission 3 brief. Every number on this page still traces back to the
 * same three data sources the previous Dashboard used - wallet context,
 * useBalances, useJobs - no new on-chain reads were added.
 */
export default function DashboardPage() {
  const wallet = useWalletContext()
  const { anvBalance, loading: balancesLoading } = useBalances(wallet.provider, wallet.account)
  const { jobs, loading: jobsLoading, error: jobsError, refresh } = useJobs(wallet.provider, wallet.account)

  const jobStats = computeJobStats(jobs)
  const { asProvider, asClient } = splitJobsByRole(jobs, wallet.account)
  const trust = computeTrust(asProvider)
  const validation = computeValidationRate(asClient)
  const attentionItems = computeAttentionItems({ wallet, jobs, jobsError })
  const summary = computeMissionSummary({ jobStats, attentionItems })
  const activityBreakdown = computeActivityBreakdown(wallet.activity)
  const jobsBreakdown = computeJobsBreakdown(jobStats)
  const workforce = computeWorkforce({ wallet, jobs, getAgentByWallet })

  const jobsRunning = jobStats.funded + jobStats.submitted
  const agentCount = wallet.agentId ? 1 : 0

  return (
    <Container size="wide" className="dv7-mission-control">
      <Section spacing="md">
        <MissionControlHero
          wallet={wallet}
          summary={summary}
          anvBalance={anvBalance}
          balancesLoading={balancesLoading}
          agentCount={agentCount}
          jobsRunning={jobsRunning}
          jobsLoading={jobsLoading && jobs.length === 0}
          trust={trust}
          validation={validation}
          attentionItems={attentionItems}
          onSwitchNetwork={wallet.switchToArc}
          onRefreshJobs={refresh}
        />
      </Section>

      <Section spacing="md">
        <MissionMetrics
          agentCount={agentCount}
          jobsRunning={jobsRunning}
          jobsCompleted={jobStats.completed}
          trust={trust}
          validation={validation}
          anvBalance={anvBalance}
          loading={jobsLoading && jobs.length === 0}
        />
      </Section>

      <Section spacing="md">
        <AiWorkforcePanel workforce={workforce} />
      </Section>

      <Section spacing="md">
        <MissionAnalytics
          activityBreakdown={activityBreakdown}
          jobsBreakdown={jobsBreakdown}
          trust={trust}
          validation={validation}
        />
      </Section>

      <Section spacing="md">
        <MissionTimeline activity={wallet.activity} arcExplorer={wallet.arcExplorer} limit={8} />
      </Section>

      <Section spacing="md">
        <MissionQuickActions />
      </Section>
    </Container>
  )
}
