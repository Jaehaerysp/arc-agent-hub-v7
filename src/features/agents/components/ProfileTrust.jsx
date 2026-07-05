import { Panel } from '../../../ui/design-system'
import { AnimatedCounter } from '../../../ui/AnimatedCounter'
import { IconCheck, IconZap, IconShield } from '../../../ui/icons'
import { computeTrustBreakdown, getAverageResponseLabel } from '../profileLogic'

const RING_SIZE = 88
const RING_STROKE = 8
const RADIUS = (RING_SIZE - RING_STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * A single progress ring: percentage sweep drawn as an SVG stroke-dasharray
 * offset. Purely presentational — no animation library needed, and it
 * respects prefers-reduced-motion via the `pv7-ring-arc` CSS transition
 * being disabled globally (see tokens.css's reduced-motion block).
 */
function ProgressRing({ percent, label, value }) {
  const clamped = Math.max(0, Math.min(100, percent))
  const offset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <div className="pv7-ring">
      <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} role="img" aria-label={`${label}: ${clamped}%`}>
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={RING_STROKE}
        />
        <circle
          className="pv7-ring-arc"
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#pv7-ring-gradient)"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
        <defs>
          <linearGradient id="pv7-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-neon)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="pv7-ring-center">
        <span className="pv7-ring-value">{value}</span>
      </div>
      <span className="pv7-ring-label">{label}</span>
    </div>
  )
}

/**
 * Trust Snapshot (Mission 5) — the full version described in UI Blueprint
 * §3.6, expanded per the mission brief with progress rings for the two
 * headline percentages (Trust Score, Approval Rate) plus the concrete
 * evidence rows (jobs completed, average response) that make the rings
 * read as earned rather than arbitrary — "evidence before scores" (Design
 * Vision principle), same as the existing compact TrustSnapshot used on
 * the Marketplace card.
 */
export function ProfileTrust({ agent }) {
  const trust = computeTrustBreakdown(agent)
  const responseLabel = getAverageResponseLabel(agent)

  return (
    <Panel
      icon={<IconShield width={16} height={16} />}
      title="Trust Snapshot"
      subtitle="Reputation, validation outcomes, and delivery reliability — all on-chain evidence"
    >
      <div className="pv7-trust-rings">
        <ProgressRing percent={trust.trustPercent} label="Trust score" value={`${trust.trustPercent}%`} />
        <ProgressRing percent={trust.approvalRate} label="Approval rate" value={`${trust.approvalRate}%`} />
      </div>

      <div className="pv7-trust-facts">
        <div className="pv7-trust-fact">
          <IconCheck width={14} height={14} />
          <div>
            <div className="pv7-trust-fact-value">
              <AnimatedCounter value={trust.completedJobs} />
            </div>
            <div className="pv7-trust-fact-label">Jobs completed</div>
          </div>
        </div>
        <div className="pv7-trust-fact">
          <IconZap width={14} height={14} />
          <div>
            <div className="pv7-trust-fact-value">{trust.responseRate}%</div>
            <div className="pv7-trust-fact-label">Response rate</div>
          </div>
        </div>
        <div className="pv7-trust-fact">
          <IconCheck width={14} height={14} />
          <div>
            <div className="pv7-trust-fact-value">{responseLabel}</div>
            <div className="pv7-trust-fact-label">Average response</div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
