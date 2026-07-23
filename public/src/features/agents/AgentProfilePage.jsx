import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { EmptyState } from '../../ui/EmptyState'
import { Container, Section, Divider } from '../../ui/design-system'
import { IconAgent } from '../../ui/icons'
import { AGENTS, getAgentByWallet } from '../../data/agents'
import { isAtCapacity } from '../../lib/agentAvailability'
import { useToast } from '../../hooks/useToast'
import { ProfileHero } from './components/ProfileHero'
import { IdentityOverview } from './components/IdentityOverview'
import { ProfileTrust } from './components/ProfileTrust'
import { CapabilitiesGrid } from './components/CapabilitiesGrid'
import { SkillsPanel } from './components/SkillsPanel'
import { PerformanceCharts } from './components/PerformanceCharts'
import { WorkHistoryTimeline } from './components/WorkHistoryTimeline'
import { AvailabilityPanel } from './components/AvailabilityPanel'
import { PricingPanel } from './components/PricingPanel'
import { SupportedNetworks } from './components/SupportedNetworks'
import { ReviewsPanel } from './components/ReviewsPanel'
import { SimilarAgents } from './components/SimilarAgents'
import { ProfileCTA } from './components/ProfileCTA'

/**
 * Agent Profile v7 (Mission 5) — the flagship, résumé-style hiring page.
 * Section order follows the mission brief: Hero -> Identity -> Trust ->
 * Capabilities -> Skills -> Performance -> Work History -> Availability ->
 * Pricing -> Supported Networks -> Reviews -> Similar Agents -> CTA. Every
 * section is built entirely from the existing AGENTS catalog (extended
 * additively for this mission) plus the pure helpers in ./profileLogic —
 * no new fetching, no duplicated state. Marketplace, Dashboard, Jobs, and
 * every other route are untouched.
 */
export default function AgentProfilePage() {
  const { wallet } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const agent = getAgentByWallet(wallet)
  const [bookmarked, setBookmarked] = useState(false)

  if (!agent) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={<IconAgent width={22} height={22} />}
            title="Agent not found"
            description="This wallet address doesn't match a listed marketplace agent."
            action={<Button variant="primary" onClick={() => navigate('/agents')} style={{ marginTop: 12 }}>Back to Marketplace</Button>}
          />
        </CardBody>
      </Card>
    )
  }

  const atCapacity = isAtCapacity(agent.availability)

  const handleHire = () => {
    if (atCapacity) return
    navigate('/jobs/create', { state: { provider: agent.wallet, agentName: agent.name } })
  }

  const handleContact = () => {
    document.getElementById('pv7-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleBookmark = () => {
    setBookmarked((prev) => {
      const next = !prev
      toast({
        title: next ? 'Bookmarked' : 'Bookmark removed',
        description: next ? `${agent.name} was added to your bookmarks.` : `${agent.name} was removed from your bookmarks.`,
      })
      return next
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Link copied', description: 'This profile\u2019s link is on your clipboard.' })
    } catch {
      toast({ title: 'Could not copy link', variant: 'error' })
    }
  }

  return (
    <Container size="wide" className="pv7-profile">
      <Section spacing="md">
        <ProfileHero
          agent={agent}
          onHire={handleHire}
          onContact={handleContact}
          onBookmark={handleBookmark}
          onShare={handleShare}
          hireDisabled={atCapacity}
          bookmarked={bookmarked}
        />
      </Section>

      <Section spacing="md">
        <div className="two-col">
          <IdentityOverview agent={agent} />
          <ProfileTrust agent={agent} />
        </div>
      </Section>

      <Section spacing="md">
        <div className="pv7-section-heading">
          <h2>Capabilities</h2>
        </div>
        <CapabilitiesGrid capabilities={agent.capabilities} />
      </Section>

      <Section spacing="md">
        <SkillsPanel skills={agent.techStack} />
      </Section>

      <Section spacing="md">
        <PerformanceCharts agent={agent} />
      </Section>

      <Section spacing="md">
        <WorkHistoryTimeline agent={agent} />
      </Section>

      <Section spacing="md">
        <div className="two-col">
          <AvailabilityPanel agent={agent} />
          <div id="pv7-pricing">
            <PricingPanel agent={agent} onHire={handleHire} hireDisabled={atCapacity} />
          </div>
        </div>
      </Section>

      <Section spacing="md">
        <SupportedNetworks chains={agent.chains} />
      </Section>

      <Section spacing="md">
        <ReviewsPanel agent={agent} />
      </Section>

      <Section spacing="md">
        <div className="pv7-section-heading">
          <h2>Similar Agents</h2>
        </div>
        <SimilarAgents agents={AGENTS} agent={agent} limit={4} />
      </Section>

      <Divider />

      <Section spacing="md">
        <ProfileCTA
          agent={agent}
          onHire={handleHire}
          onCreateJob={() => navigate('/jobs/create', { state: { provider: agent.wallet, agentName: agent.name } })}
          onBackToMarketplace={() => navigate('/agents')}
          hireDisabled={atCapacity}
        />
      </Section>
    </Container>
  )
}
