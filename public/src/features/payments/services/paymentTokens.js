// Universal Payments token list (Sprint 2 — Objective 1).
//
// This is NOT a new token registry. Payments previously only offered the
// one Circle USDC entry (`USDC_TOKEN`, still defined in
// `usdcPaymentService.js` since that's the same ERC-20 the ERC-8183
// job-funding flow already uses). This module composes the token
// selector Payments needs by combining that entry with the two registries
// that already exist elsewhere in the app:
//   - `CONTRACTS.ANV_TOKEN` (`contracts/registry.js`) — the app's other
//     always-tracked ERC-20.
//   - `WALLET_TOKENS` (`wallet/services/tokenRegistry.js`) — the full
//     Custom / AI Agent / DeFi registry the Wallet page reads live.
//
// Every entry here is a plain ERC-20 with a working `transfer` (all read
// via the same `ERC20_ABI`), so anything added to `WALLET_TOKENS` in the
// future is automatically payable — no change needed here or in the
// Payment Form.
//
// The Arc Testnet *native gas token* (also confusingly labeled "USDC" on
// the Wallet page — see walletAnalytics.js) is intentionally excluded: it
// isn't an ERC-20, sending it is a native value transfer rather than a
// `transfer()` call, and that's a different write path this sprint isn't
// touching.

import { CONTRACTS } from '../../../contracts/registry'
import { WALLET_TOKENS } from '../../wallet/services/tokenRegistry'
import { USDC_TOKEN } from './usdcPaymentService'

/** ANV in the same token-descriptor shape as WALLET_TOKENS/USDC_TOKEN entries. */
const ANV_TOKEN = {
  key: 'anv',
  symbol: 'ANV',
  name: CONTRACTS.ANV_TOKEN.label,
  address: CONTRACTS.ANV_TOKEN.address,
  decimals: 18,
  category: 'custom',
}

/** Every token the Payment Form can send: USDC + ANV + the full Wallet registry. */
export const PAYMENT_TOKENS = [USDC_TOKEN, ANV_TOKEN, ...WALLET_TOKENS]

/** Looks up a payment token by its `key`, falling back to USDC if not found. */
export function getPaymentToken(key) {
  return PAYMENT_TOKENS.find((t) => t.key === key) || USDC_TOKEN
}
