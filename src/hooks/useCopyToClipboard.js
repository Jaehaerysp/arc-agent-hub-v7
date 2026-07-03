import { useCallback, useRef, useState } from 'react'

/**
 * Copies text to the clipboard and exposes a transient `copied` flag that
 * resets to `false` after `resetDelay` ms — used to drive the "✓ Copied"
 * label on `CopyButton` and similar affordances.
 *
 * @param {number} [resetDelay=1500] - How long `copied` stays true, in ms.
 * @returns {[boolean, (text: string) => Promise<void>]} `[copied, copy]`
 */
export function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  const copy = useCallback(
    async (text) => {
      if (!text) return
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetDelay)
      } catch {
        // clipboard API unavailable — no-op
      }
    },
    [resetDelay]
  )

  return [copied, copy]
}
