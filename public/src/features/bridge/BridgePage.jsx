import { useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../app/providers/WalletProvider'
import { useTokenBalances } from '../wallet/hooks/useTokenBalances'
import { useBridgeEstimate } from './hooks/useBridgeEstimate'
import { useBridge } from './hooks/useBridge'
import { useBridgeHistory } from './hooks/useBridgeHistory'
import { Container, Section, Button } from '../../ui/design-system'
import { BridgeHero } from './components/BridgeHero'
import { BridgeForm } from './components/BridgeForm'
import { BridgeStatusDialog } from './components/BridgeStatusDialog'
import { BridgeHistoryTable } from './components/BridgeHistoryTable'
import { BRIDGE_ASSETS, getBridgeAsset } from './services/bridgeAssets'
import { BRIDGE_NETWORKS, getBridgeNetwork } from '../../chains/bridgeNetworks'
import { NETWORK_LABEL } from '../wallet/walletAnalytics'

/**
 * Bridge Center — moves USDC/EURC between Arc Testnet and supported
 * testnets through the connected browser wallet. Built entirely on the
 * Wallet/Payments architecture from Sprints 1–2:
 *   - `useTokenBalances` (Wallet's own hook) reads live balances for
 *     `BRIDGE_ASSETS`, same as Payments does for `PAYMENT_TOKENS`.
 *   - `bridgeService`/`useBridgeEstimate`/`useBridge` follow the same
 *     "pure service + thin hook" shape as `usdcPaymentService`/
 *     `useFeeEstimate`/`usePaymentSend`.
 *   - No private keys anywhere in this flow — every read and write uses
 *     the `provider`/`signer` from the connected browser wallet.
 */
export default function BridgePage() {
  const { signer, account, provider, addActivity, activity, arcExplorer, isArcNetwork, switchToArc } = useWalletContext()
  const { balances, loading: balanceLoading, refresh: refreshBalance } = useTokenBalances(provider, account, BRIDGE_ASSETS)

  const [direction, setDirection] = useState('outbound') // 'outbound' = Arc → destination, 'inbound' = destination → Arc
  const [destinationId, setDestinationId] = useState(BRIDGE_NETWORKS[0].id)
  const destinationNetwork = useMemo(() => getBridgeNetwork(destinationId), [destinationId])

  const [assetKey, setAssetKey] = useState(BRIDGE_ASSETS[0]?.key)
  const selectedAsset = useMemo(() => getBridgeAsset(assetKey), [assetKey])
  const balance = useMemo(() => balances.find((b) => b.key === assetKey)?.balance ?? null, [balances, assetKey])

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { fee, loading: feeLoading, error: feeError, arrival } = useBridgeEstimate(provider, account, amount, selectedAsset, destinationNetwork)
  const {
    runBridge,
    resumeBridge,
    resumableSession,
    status,
    loading,
    error,
    success,
    mintTx,
    attestationPhase,
    attestationAttempt,
    reset,
  } = useBridge(signer, addActivity)

  // A pending session (see bridgeSessionService.js) means a previous burn
  // confirmed but the attestation/mint half didn't finish — e.g. the tab
  // reloaded while this app's own network switch was in flight. Resume it
  // against its own destination chain, not whatever's currently selected
  // in the form.
  const resumeNetwork = useMemo(
    () => (resumableSession ? getBridgeNetwork(resumableSession.destinationNetworkId) : null),
    [resumableSession]
  )

  const clearState = () => {
    setSubmitted(false)
    setFormError(null)
    reset()
  }

  const handleDirectionToggle = () => {
    clearState()
    setDirection((d) => (d === 'outbound' ? 'inbound' : 'outbound'))
  }

  const handleDestinationChange = (id) => {
    clearState()
    setDestinationId(id)
  }

  const handleAssetChange = (key) => {
    clearState()
    setAmount('')
    setAssetKey(key)
  }

  const handleMax = () => {
    if (balance !== null) {
      clearState()
      setAmount(balance.toString())
    }
  }

  const handleSubmit = async () => {
    setFormError(null)
    const recipientTrimmed = recipient.trim() || account || ''

    if (!recipientTrimmed || !ethers.isAddress(recipientTrimmed)) return setFormError('Valid recipient address required')
    if (!amount || Number(amount) <= 0) return setFormError('Valid amount required')
    if (balance !== null && Number(amount) > Number(balance)) return setFormError('Amount exceeds available balance')
    if (direction === 'inbound') return setFormError(`Bridging from ${destinationNetwork?.name} isn't wired up in this browser build yet — switch to Arc → ${destinationNetwork?.name} for now.`)

    const result = await runBridge(selectedAsset, destinationNetwork, amount, recipientTrimmed)

    if (result) {
      setSubmitted(true)
      setDialogOpen(true)
      refreshBalance()
    } else {
      setDialogOpen(true)
    }
  }

  const handleResume = async () => {
    if (!resumeNetwork) return
    setDialogOpen(true)
    const result = await resumeBridge(resumeNetwork)
    if (result) refreshBalance()
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    if (submitted) {
      setRecipient('')
      setAmount('')
    }
    clearState()
  }

  const bridges = useBridgeHistory(activity, 8)

  const sourceLabel = direction === 'outbound' ? NETWORK_LABEL : destinationNetwork?.name || 'Select network'
  const destLabel = direction === 'outbound' ? destinationNetwork?.name || 'Select network' : NETWORK_LABEL

  return (
    <Container size="wide" className="wv7-transfer-page">
      <Section spacing="md">
        <BridgeHero token={selectedAsset} balance={balance} loading={balanceLoading} />
      </Section>

      {resumableSession && status === 'idle' && (
        <Section spacing="md">
          <div className="brg-mint-status" role="status">
            <div className="brg-mint-status-row">
              <span className="brg-mint-status-label">
                A previous bridge burned {resumableSession.amount} to {resumeNetwork?.name || resumableSession.destinationNetworkId} but didn&apos;t finish minting.
              </span>
              <Button variant="secondary" onClick={handleResume} disabled={!resumeNetwork}>
                Resume bridge
              </Button>
            </div>
          </div>
        </Section>
      )}

      <Section spacing="md">
        <BridgeForm
          direction={direction}
          destinationId={destinationId}
          destinationNetwork={destinationNetwork}
          assets={BRIDGE_ASSETS}
          selectedAsset={selectedAsset}
          balance={balance}
          recipient={recipient}
          amount={amount}
          signer={signer}
          isArcNetwork={isArcNetwork}
          onSwitchToArc={switchToArc}
          loading={loading}
          status={status}
          submitted={submitted}
          formError={formError}
          bridgeError={error}
          fee={fee}
          feeLoading={feeLoading}
          feeError={feeError}
          arrival={arrival}
          onDirectionToggle={handleDirectionToggle}
          onDestinationChange={handleDestinationChange}
          onAssetChange={handleAssetChange}
          onRecipientChange={(v) => { clearState(); setRecipient(v) }}
          onAmountChange={(v) => { clearState(); setAmount(v) }}
          onMax={handleMax}
          onSubmit={handleSubmit}
        />
      </Section>

      <Section spacing="md">
        <BridgeHistoryTable bridges={bridges} arcExplorer={arcExplorer} />
      </Section>

      <BridgeStatusDialog
        open={dialogOpen}
        status={status}
        txHash={success?.txHash}
        mintTx={mintTx}
        amount={amount}
        tokenSymbol={selectedAsset.symbol}
        sourceLabel={sourceLabel}
        destLabel={destLabel}
        arcExplorer={arcExplorer}
        destinationNetwork={destinationNetwork || resumeNetwork}
        attestationPhase={attestationPhase}
        attestationAttempt={attestationAttempt}
        error={error}
        onClose={handleDialogClose}
      />
    </Container>
  )
}
