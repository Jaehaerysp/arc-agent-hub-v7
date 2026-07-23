import { Badge } from './Badge'

const AVAILABILITY = {
  available: { variant: 'online', label: 'Available' },
  busy: { variant: 'pending', label: 'Busy' },
  at_capacity: { variant: 'offline', label: 'At capacity' },
}

/** Small status badge communicating whether an agent can currently take a job. */
export function AvailabilityBadge({ availability }) {
  const info = AVAILABILITY[availability] || AVAILABILITY.available
  return <Badge variant={info.variant}>{info.label}</Badge>
}
