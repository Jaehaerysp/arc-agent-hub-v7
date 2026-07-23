import { useCallback, useEffect, useRef, useState } from 'react'
import { initiateBridge } from '../services/bridgeService'
import { extractBurnMessage } from '../services/attestationService'
import { receiveMessage } from '../services/messageTransmitterService'
import { ARC_SOURCE_CCTP } from '../services/bridgeContracts'
import { useAttestation } from './useAttestation'
import {
  savePendingBridgeSession,
  clearPendingBridgeSession,
  loadPendingBridgeSession,
} from '../services/bridgeSessionService'
import { shortAddr } from '../../../lib/format'

/**
 * Runs a bridge transfer end to end and tracks it through the full
 * Sprint 3.2 pipeline:
 *
 *   Pending -> Submitted -> Confirming (approve + depositForBurn, unchanged
 *   -- see bridgeService.js, not modified by this hook) -> Burn Confirmed ->
 *   Switch Network -> Waiting for Attestation -> Minting -> Mint Confirmed ->
 *   Completed
 *
 * `initiateBridge` (bridgeService.js) still owns the entire burn half
 * exactly as before and is called exactly as before -- this hook only adds
 * what happens *after* it returns a confirmed burn receipt.
 *
 * Resuming: once a burn confirms, its burnTx/messageHash/destination/
 * recipient/asset/amount are persisted (bridgeSessionService.js) *before*
 * this hook switches the wallet's network -- because that switch, or any
 * tab reload while waiting on Iris, must not risk re-running approve()/
 * depositForBurn() against funds that are already burned. On mount, if a
 * matching pending session exists, BridgePage can call `resumeBridge` to
 * resume straight into `waiting_attestation` using the persisted state
 * instead of starting a new bridge. The session is cleared once the mint
 * confirms; a failed attestation/mint deliberately leaves it in place so a
 * retry can resume rather than re-burn.
 */
export function useBridge(signer, addActivity) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [mintTx, setMintTx] = useState(null)
  const [messageHash, setMessageHash] = useState(null)

  const cancelRef = useRef(false)
  const attestation = useAttestation()

  const reset = useCallback(() => {
    cancelRef.current = true
    setStatus('idle')
    setError(null)
    setSuccess(null)
    setMintTx(null)
    setMessageHash(null)
    attestation.reset()
  }, [attestation])

  /** Shared tail: attestation -> switch network -> mint -> completed/failed. Used by both a fresh burn and a resumed session. */
  const runPostBurn = useCallback(
    async ({ burnTx, receipt, messageHash: msgHash, message: msg, network, activityMeta }) => {
      setStatus('switching_network')
      setStatus('waiting_attestation')

      const attestationResult = await attestation.start({
        sourceDomain: ARC_SOURCE_CCTP.domain,
        transactionHash: burnTx,
        expectedMessageHash: msgHash,
        expectedMessage: msg,
      })

      if (cancelRef.current) return null

      if (attestationResult.error) {
        setStatus('failed')
        setError(attestationResult.error)
        if (addActivity) {
          addActivity({ status: 'failed', detail: attestationResult.error, burnTx, mintTx: null, ...activityMeta })
        }
        // Deliberately NOT cleared -- the burn is confirmed and the message
        // hash is known, so the user (or a retry) can still resume the
        // mint later without re-burning.
        return { txHash: burnTx, receipt, error: attestationResult.error }
      }

      setStatus('minting')

      const mintResult = await receiveMessage({
        network,
        message: attestationResult.message,
        attestation: attestationResult.attestation,
      })

      if (cancelRef.current) return null

      if (mintResult.error) {
        setStatus('failed')
        setError(mintResult.error)
        if (addActivity) {
          addActivity({ status: 'failed', detail: mintResult.error, burnTx, mintTx: null, ...activityMeta })
        }
        return { txHash: burnTx, receipt, error: mintResult.error }
      }

      setStatus('mint_confirmed')
      setMintTx(mintResult.txHash)
      setStatus('completed')
      clearPendingBridgeSession()

      const finalResult = { txHash: burnTx, receipt, mintTx: mintResult.txHash }
      setSuccess(finalResult)
      if (addActivity) {
        addActivity({ status: 'completed', txHash: burnTx, burnTx, mintTx: mintResult.txHash, ...activityMeta })
      }
      return finalResult
    },
    [attestation, addActivity]
  )

  const runBridge = useCallback(
    async (token, network, amount, recipient) => {
      cancelRef.current = false
      setStatus('pending')
      setError(null)
      setSuccess(null)
      setMintTx(null)
      setMessageHash(null)

      const activityMeta = {
        type: 'bridge',
        label: `${token.symbol} bridge`,
        failLabel: 'Bridge failed',
        detail: `${amount} ${token.symbol} -> ${network.name} (${shortAddr(recipient)})`,
        sourceNetwork: 'Arc Testnet',
        destinationNetwork: network.name,
        amount,
        tokenSymbol: token.symbol,
      }

      setStatus('submitted')
      setStatus('confirming')

      const burnResult = await initiateBridge({ signer, token, network, amount, recipient })

      if (cancelRef.current) return null

      if (burnResult.error) {
        setStatus('failed')
        setError(burnResult.error)
        if (addActivity) addActivity({ status: 'failed', detail: burnResult.error, ...activityMeta })
        return null
      }

      setStatus('burn_confirmed')
      setSuccess(burnResult)

      const extracted = extractBurnMessage(burnResult.receipt)
      if (extracted.error) {
        // Burn succeeded but we couldn't read the CCTP message back off
        // its own receipt -- nothing to poll Iris for. Surface as a failed
        // mint step; the burn itself (and its tx hash) is still shown.
        setStatus('failed')
        setError(extracted.error)
        if (addActivity) addActivity({ status: 'failed', detail: extracted.error, burnTx: burnResult.txHash, ...activityMeta })
        return { ...burnResult, error: extracted.error }
      }

      setMessageHash(extracted.messageHash)

      savePendingBridgeSession({
        burnTx: burnResult.txHash,
        messageHash: extracted.messageHash,
        destinationNetworkId: network.id,
        recipient,
        assetKey: token.key,
        amount,
        activityMeta,
      })

      return runPostBurn({
        burnTx: burnResult.txHash,
        receipt: burnResult.receipt,
        messageHash: extracted.messageHash,
        message: extracted.message,
        network,
        activityMeta,
      })
    },
    [signer, addActivity, runPostBurn]
  )

  /** Resumes a persisted post-burn session (see bridgeSessionService.js) instead of starting a new bridge. */
  const resumeBridge = useCallback(
    async (network) => {
      const session = loadPendingBridgeSession()
      if (!session) return null

      cancelRef.current = false
      setStatus('burn_confirmed')
      setError(null)
      setSuccess({ txHash: session.burnTx })
      setMessageHash(session.messageHash)

      return runPostBurn({
        burnTx: session.burnTx,
        receipt: null,
        messageHash: session.messageHash,
        network,
        activityMeta: session.activityMeta,
      })
    },
    [runPostBurn]
  )

  /** Whether a persisted session exists to offer resuming -- read once on mount, same as any other "restore from storage" check in this app. */
  const [resumableSession] = useState(() => loadPendingBridgeSession())

  useEffect(() => () => {
    cancelRef.current = true
  }, [])

  return {
    runBridge,
    resumeBridge,
    resumableSession,
    status,
    loading: !['idle', 'completed', 'failed'].includes(status),
    error,
    success,
    mintTx,
    messageHash,
    attestationPhase: attestation.phase,
    attestationAttempt: attestation.attempt,
    reset,
  }
}
