import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

export function CopyButton({ value, label = 'Copy' }) {
  const [copied, copy] = useCopyToClipboard()
  const displayLabel = label || 'Copy'
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => copy(value)}
      aria-label={copied ? `Copied ${displayLabel}` : `Copy ${displayLabel}`}
    >
      {copied ? '✓ Copied' : displayLabel}
    </button>
  )
}
