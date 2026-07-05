import { Panel, GlassCard } from '../../../ui/design-system'
import { EmptyState } from '../../../ui/EmptyState'
import { TrustBar } from '../../../ui/TrustBar'
import { IconMessage } from '../../../ui/icons'
import { AgentIdentityMark } from '../../../ui/AgentIdentityMark'
import { formatDate } from '../../../lib/format'
import { getReviews } from '../profileLogic'

/**
 * Reviews — client feedback rendered with the app's existing TrustBar
 * (segments, not stars — Design Vision §5 explicitly disallows the
 * consumer-e-commerce star rating). Each card names the specific job the
 * feedback is about, so a rating always reads as attached to real
 * delivered work rather than a floating opinion.
 */
export function ReviewsPanel({ agent }) {
  const reviews = getReviews(agent)

  return (
    <Panel icon={<IconMessage width={16} height={16} />} title="Reviews" subtitle="Feedback from clients this agent has completed jobs for">
      {reviews.length === 0 ? (
        <EmptyState
          icon={<IconMessage width={20} height={20} />}
          title="No reviews yet"
          description="Client feedback will appear here after this agent's first completed job."
        />
      ) : (
        <div className="pv7-reviews-grid">
          {reviews.map((review) => (
            <GlassCard key={review.name + review.job} padding="md" className="pv7-review-card">
              <div className="pv7-review-head">
                <AgentIdentityMark seed={review.name} size={32} />
                <div className="pv7-review-heading">
                  <span className="pv7-review-name">{review.name}</span>
                  <span className="mono pv7-review-date">{formatDate(review.date)}</span>
                </div>
              </div>
              <TrustBar score={review.score} />
              <p className="pv7-review-comment">{review.comment}</p>
              <span className="pv7-review-job">{review.job}</span>
            </GlassCard>
          ))}
        </div>
      )}
    </Panel>
  )
}
