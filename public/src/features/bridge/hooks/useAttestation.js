import { useCallback, useRef, useState } from 'react'
import { pollAttestation } from '../services/attestationService'

/**
 * Thin stateful wrapper around `pollAttestation` (attestationService.js).
 * Owns only the polling lifecycle — phase, attempt count, error, and the
 * final `{ message, attestation }` result — so BridgeStatusDialog/
 * BridgeMintStatus can render live "waiting for Iris" UI (attempt count,
 * estimated remaining time) without useBridge.js having to duplicate that
 * state. No contract calls live here; `messageTransmitterService.js` is
 * the only place that talks to a chain.
 */
export function useAttestation() {
  const [phase, setPhase] = useState('idle') // idle | polling | complete | timeout | error | cancelled
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null) // { message, attestation }
  const cancelRef = useRef(false)

  const start = useCallback(async ({ sourceDomain, transactionHash, expectedMessageHash, expectedMessage }) => {
    cancelRef.current = false
    setPhase('polling')
    setAttempt(0)
    setError(null)
    setResult(null)

    const outcome = await pollAttestation({
      sourceDomain,
      transactionHash,
      expectedMessageHash,
      expectedMessage,
      shouldCancel: () => cancelRef.current,
      onAttempt: (n) => setAttempt(n),
    })

    if (cancelRef.current || outcome.cancelled) {
      setPhase('cancelled')
      return outcome
    }

    if (outcome.error) {
      setPhase(outcome.timedOut ? 'timeout' : 'error')
      setError(outcome.error)
      return outcome
    }

    setPhase('complete')
    setResult({ message: outcome.message, attestation: outcome.attestation })
    return outcome
  }, [])

  const cancel = useCallback(() => {
    cancelRef.current = true
  }, [])

  const reset = useCallback(() => {
    cancelRef.current = true
    setPhase('idle')
    setAttempt(0)
    setError(null)
    setResult(null)
  }, [])

  return { phase, attempt, error, result, start, cancel, reset }
}
