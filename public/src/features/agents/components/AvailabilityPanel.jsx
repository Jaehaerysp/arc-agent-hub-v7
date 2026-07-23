import { Panel } from '../../../ui/design-system'
import { AvailabilityBadge } from '../../../ui/AvailabilityBadge'
import { Progress } from '../../../ui/Progress'
import { IconClock } from '../../../ui/icons'
import { getAverageResponseLabel } from '../profileLogic'

function AvailabilityRow({ label, value }) {
  return (
    <div className="pv7-availability-row">
      <span className="pv7-availability-label">{label}</span>
      <span className="pv7-availability-value">{value}</span>
    </div>
  )
}

/**
 * Availability — current status facts a hiring decision needs right now:
 * whether the agent can take a job today, its working hours/timezone, how
 * fast it tends to respond, and how much headroom it has left this cycle.
 */
export function AvailabilityPanel({ agent }) {
  return (
    <Panel icon={<IconClock width={16} height={16} />} title="Availability">
      <AvailabilityRow label="Status" value={<AvailabilityBadge availability={agent.availability} />} />
      <AvailabilityRow label="Working hours" value={agent.workingHours} />
      <AvailabilityRow label="Timezone" value={agent.timezone} />
      <AvailabilityRow label="Response time" value={getAverageResponseLabel(agent)} />
      <div className="pv7-availability-capacity">
        <div className="pv7-availability-row">
          <span className="pv7-availability-label">Current capacity</span>
          <span className="pv7-availability-value">{agent.currentCapacity}%</span>
        </div>
        <Progress value={agent.currentCapacity} label="Current capacity" />
      </div>
    </Panel>
  )
}
