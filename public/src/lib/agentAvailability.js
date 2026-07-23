/** True when an agent cannot currently take new jobs. */
export function isAtCapacity(availability) {
  return availability === 'at_capacity'
}
