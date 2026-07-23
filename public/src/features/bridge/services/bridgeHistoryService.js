// Bridge Center — pure selectors over `wallet.activity`, same pattern as
// `paymentsAnalytics.js`/`walletAnalytics.js`. No new state, reads only
// entries this feature itself logged via `addActivity` (`type: 'bridge'`).
//
// Sprint 3.2 note: the brief's "history item" shape (asset, amount,
// sourceChain, destinationChain, burnTx, mintTx, status, timestamp) is a
// standalone record shape. This app's history is instead a selector over
// `wallet.activity` (useWallet.js, which Sprint 3.2 explicitly says not to
// modify) — so rather than introduce a second, parallel history store,
// `computeBridgeHistory` below is extended to read `burnTx`/`mintTx` off
// the same activity entries `useBridge.js` already writes via
// `addActivity`, falling back to the original single `txHash` field for
// entries logged before this sprint. Same data shape the brief asks for,
// same architecture this file already used.

import { formatTokenAmount } from '../../../lib/format'

/**
 * Bridge Status — the full pipeline an activity entry's `status` can be
 * logged as. `pending`/`submitted`/`confirming` cover the untouched
 * approve()+depositForBurn() half (bridgeService.js); everything from
 * `burn_confirmed` on is Sprint 3.2's attestation+mint half.
 */
export const BRIDGE_STATUS = [
  'pending',
  'submitted',
  'confirming',
  'burn_confirmed',
  'switching_network',
  'waiting_attestation',
  'minting',
  'mint_confirmed',
  'completed',
  'failed',
]

export function bridgeStatusLabel(status) {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'submitted':
      return 'Submitted'
    case 'confirming':
      return 'Confirming Burn'
    case 'burn_confirmed':
      return 'Burn Confirmed'
    case 'switching_network':
      return 'Switch Network'
    case 'waiting_attestation':
      return 'Waiting for Attestation'
    case 'minting':
      return 'Minting'
    case 'mint_confirmed':
      return 'Mint Confirmed'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

/** Bridge History table rows — only activity entries logged by this feature. */
export function computeBridgeHistory(activity, limit = 10) {
  return activity
    .filter((a) => a.type === 'bridge')
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      hash: a.txHash,
      burnTx: a.burnTx || a.txHash || null,
      mintTx: a.mintTx || null,
      detail: a.detail || a.label,
      status: a.status,
      sourceNetwork: a.sourceNetwork,
      destinationNetwork: a.destinationNetwork,
      amount: a.amount,
      tokenSymbol: a.tokenSymbol,
      timestamp: a.timestamp,
    }))
}

export function formatBridgeAmount(amount, symbol) {
  if (amount === null || amount === undefined) return '—'
  return `${formatTokenAmount(Number(amount), 4)} ${symbol}`
}
