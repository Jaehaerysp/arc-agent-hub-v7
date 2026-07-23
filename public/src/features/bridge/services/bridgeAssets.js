// Bridge Center — bridgeable asset list.
//
// Per the Sprint 3 brief: "Reuse the existing Wallet Token Registry. Future
// bridgeable assets should automatically appear." This is not a new token
// registry — it's a thin filter over the two registries the app already
// has, same pattern as Payments' `paymentTokens.js` composing
// `PAYMENT_TOKENS` from `USDC_TOKEN` + `WALLET_TOKENS`.
//
// `USDC_TOKEN` comes from the Payments feature (Sprint 2) rather than being
// redefined here, since it's the same Circle-issued USDC ERC-20 the
// ERC-8183 job-funding flow and Payments already read/write — one token
// descriptor, three consumers.
//
// `BRIDGEABLE_TOKEN_KEYS` is the only thing this module owns: the initial
// set is USDC + EURC (both `category: 'native'` in WALLET_TOKENS — Circle's
// own stablecoin family), matching what the reference bridge scripts
// actually move. Adding a `key` here — and nothing else — is enough to
// bridge a new asset, as long as it already exists in WALLET_TOKENS (or is
// USDC).

import { WALLET_TOKENS } from '../../wallet/services/tokenRegistry'
import { USDC_TOKEN } from '../../payments/services/usdcPaymentService'

const BRIDGEABLE_TOKEN_KEYS = ['usdc', 'eurc']

const ALL_KNOWN_TOKENS = [USDC_TOKEN, ...WALLET_TOKENS]

/** Every asset the Bridge Center currently offers, in registry order. */
export const BRIDGE_ASSETS = BRIDGEABLE_TOKEN_KEYS
  .map((key) => ALL_KNOWN_TOKENS.find((t) => t.key === key))
  .filter(Boolean)

export function getBridgeAsset(key) {
  return BRIDGE_ASSETS.find((t) => t.key === key) || BRIDGE_ASSETS[0]
}
