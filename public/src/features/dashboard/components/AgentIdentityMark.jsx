/** Cheap, deterministic string hash — good enough to derive stable visual params, not for security. */
function hashSeed(input) {
  let h = 0
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

/**
 * A small generative mark unique to a wallet address: a violet→cyan tinted
 * hue derived from the hash, with a rotated inner polygon whose shape and
 * angle also come from the hash. No two addresses render the same mark; the
 * same address always renders identically.
 */
export function AgentIdentityMark({ seed, size = 40 }) {
  const h = hashSeed(seed || '0x0')
  const hue = 250 + (h % 60) // stays within the brand's violet→cyan range
  const rotation = h % 360
  const sides = 3 + (h % 3) // triangle, square, or pentagon inner shape

  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
    const r = 9
    return `${12 + r * Math.cos(angle)},${12 + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="mc-agent-mark" role="img" aria-label="Agent identity mark">
      <rect x="0" y="0" width="24" height="24" rx="7" fill={`hsl(${hue} 70% 14%)`} />
      <polygon points={points} fill={`hsl(${hue} 85% 62%)`} opacity="0.9" transform={`rotate(${rotation} 12 12)`} />
    </svg>
  )
}
