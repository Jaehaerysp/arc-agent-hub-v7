import { useMemo } from 'react'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { Container, Section, Grid } from '../../ui/design-system'
import { TrustHero } from './components/TrustHero'
import { TrustMetrics } from './components/TrustMetrics'
import { OverallTrustScore } from './components/OverallTrustScore'
import { ValidationStatusTimeline } from './components/ValidationStatusTimeline'
import { ReputationTimeline } from './components/ReputationTimeline'
import { VerificationHistoryTable } from './components/VerificationHistoryTable'
import { TrustAnalyticsPanel } from './components/TrustAnalyticsPanel'
import { CertificatesPanel } from './components/CertificatesPanel'
import { OnChainEvidencePanel } from './components/OnChainEvidencePanel'
import { AchievementBadges } from './components/AchievementBadges'
import { SecurityInsightsPanel } from './components/SecurityInsightsPanel'
import { RecentEventsFeed } from './components/RecentEventsFeed'
import { TrustQuickActions } from './components/TrustQuickActions'
import { FeedbackFormPanel } from './components/FeedbackFormPanel'
import { ValidationRequestPanel } from './components/ValidationRequestPanel'
import {
  computeTrustEvents,
  computeReputationEvents,
  computeValidationEvents,
  computeReputationStats,
  computeValidationStats,
  computeTrustScore,
  computeMonthlyTrustActivity,
  computeMonthlyJobActivity,
  computeValidationSuccessRing,
  computeNetworkDistribution,
  computeReputationTimeline,
  computeBadges,
  computeCertificates,
  computeSecurityInsights,
  computeRecentSecurityEvents,
  computeRiskLevel,
} from './trustAnalytics'

/**
 * Trust Center (Mission 7) — merges the previous Reputation and
 * Validation pages into one premium security/reputation/validation/
 * on-chain-proof center, per the Mission 7 brief. Layout order: Hero ->
 * Metrics -> Overall Trust -> Take Action (Give Feedback / Request
 * Validation, business logic preserved from the old pages) ->
 * Validation Status -> Reputation Timeline -> Verification History ->
 * Trust Analytics -> Certificates -> On-Chain Evidence -> Achievement
 * Badges -> Security Insights -> Recent Events -> Quick Actions.
 *
 * Every figure on this page is derived from `wallet.activity` and
 * `wallet.agentId` — the same two sources ReputationPage and
 * ValidationPage already read — via the pure selectors in
 * `trustAnalytics.js`. No new on-chain reads were added; see that file's
 * header comment for the documented limitation this implies (no
 * "getReputation" / "getValidationStatus" getter exists on either
 * registry ABI).
 */
export default function TrustCenterPage() {
  const { account, signer, agentId, activity, arcExplorer } = useWalletContext()

  const trustEvents = useMemo(() => computeTrustEvents(activity), [activity])
  const reputationEvents = useMemo(() => computeReputationEvents(activity), [activity])
  const validationEvents = useMemo(() => computeValidationEvents(activity), [activity])

  const reputationStats = useMemo(() => computeReputationStats(activity), [activity])
  const validationStats = useMemo(() => computeValidationStats(activity), [activity])
  const { score, tier } = useMemo(() => computeTrustScore(agentId, reputationStats, validationStats), [agentId, reputationStats, validationStats])

  const monthlyTrust = useMemo(() => computeMonthlyTrustActivity(activity), [activity])
  const monthlyJobs = useMemo(() => computeMonthlyJobActivity(activity), [activity])
  const successRing = useMemo(() => computeValidationSuccessRing(validationStats), [validationStats])
  const networkDistribution = useMemo(() => computeNetworkDistribution(activity), [activity])
  const jobCount = useMemo(() => activity.filter((a) => a.type === 'job').length, [activity])

  const reputationTimeline = useMemo(() => computeReputationTimeline(activity, agentId), [activity, agentId])
  const badges = useMemo(() => computeBadges(agentId, reputationStats, validationStats, tier), [agentId, reputationStats, validationStats, tier])
  const certificates = useMemo(() => computeCertificates(agentId, reputationStats, validationStats, Boolean(signer)), [agentId, reputationStats, validationStats, signer])
  const securityInsights = useMemo(() => computeSecurityInsights(agentId, validationStats, Boolean(signer)), [agentId, validationStats, signer])
  const recentSecurityEvents = useMemo(() => computeRecentSecurityEvents(activity), [activity])
  const riskLevel = useMemo(() => computeRiskLevel(securityInsights), [securityInsights])

  const latestEvent = trustEvents[0]
  const latestReputationTx = reputationEvents.find((e) => e.status === 'success' && e.txHash)
  const latestValidationTx = validationEvents.find((e) => e.status === 'success' && e.txHash)

  return (
    <Container size="wide" className="tv7-trust-page">
      <Section spacing="md">
        <TrustHero agentId={agentId} score={score} tier={tier} validationStats={validationStats} latestEvent={latestEvent} loading={false} />
      </Section>

      <Section spacing="md">
        <TrustMetrics
          score={score}
          tier={tier}
          reputationStats={reputationStats}
          validationStats={validationStats}
          successRing={successRing}
          jobCount={jobCount}
          loading={false}
        />
      </Section>

      <Section spacing="md">
        <OverallTrustScore score={score} tier={tier} monthlyTrend={monthlyTrust} />
      </Section>

      <Section spacing="md">
        <Grid columns={2} minColWidth="360px" gap="lg" aria-label="Take action">
          <FeedbackFormPanel />
          <ValidationRequestPanel />
        </Grid>
      </Section>

      <Section spacing="md">
        <ValidationStatusTimeline events={validationEvents} arcExplorer={arcExplorer} />
      </Section>

      <Section spacing="md">
        <ReputationTimeline milestones={reputationTimeline} arcExplorer={arcExplorer} />
      </Section>

      <Section spacing="md">
        <VerificationHistoryTable events={trustEvents} arcExplorer={arcExplorer} />
      </Section>

      <Section spacing="md">
        <TrustAnalyticsPanel
          monthlyTrust={monthlyTrust}
          monthlyJobs={monthlyJobs}
          successRing={successRing}
          networkDistribution={networkDistribution}
        />
      </Section>

      <Section spacing="md">
        <CertificatesPanel certificates={certificates} />
      </Section>

      <Section spacing="md">
        <OnChainEvidencePanel
          account={account}
          agentId={agentId}
          latestReputationTx={latestReputationTx}
          latestValidationTx={latestValidationTx}
          arcExplorer={arcExplorer}
        />
      </Section>

      <Section spacing="md">
        <AchievementBadges badges={badges} />
      </Section>

      <Section spacing="md">
        <SecurityInsightsPanel insights={securityInsights} recentEvents={recentSecurityEvents} riskLevel={riskLevel} />
      </Section>

      <Section spacing="md">
        <RecentEventsFeed events={trustEvents} arcExplorer={arcExplorer} limit={8} />
      </Section>

      <Section spacing="md">
        <TrustQuickActions />
      </Section>
    </Container>
  )
}
