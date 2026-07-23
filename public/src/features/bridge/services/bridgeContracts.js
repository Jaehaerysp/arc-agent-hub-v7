// Bridge Center — on-chain bridge contract registry.
//
// Same "single source of truth, do not edit without verifying against a
// fresh deployment" convention as `contracts/registry.js`.
//
// SOURCE OF THESE ADDRESSES: Arc Testnet's CCTP deployment only exists on
// CCTP V2 (there is no V1 TokenMessenger on Arc), so this registry targets
// CCTP V2 throughout rather than the V1 interface the previous scaffold
// used. Every address below was cross-checked against two independent
// first-party Circle sources, not invented or guessed:
//   1. Circle's own Nov 24, 2025 developer blog post, "Crosschain USDC
//      transfers with RainbowKit and Bridge Kit" (circle.com/blog), whose
//      `getSupportedChains()` sample output for Arc Testnet lists domain
//      26 with these exact tokenMessenger/messageTransmitter addresses.
//   2. The published `@circle-fin/bridge-kit` npm package's own shipped
//      chain config (chains.d.ts), which bakes in the same values for
//      every chain below — this is Circle's own SDK data, not a
//      third-party mirror.
// Arc Testnet's USDC address here (0x3600...) also matches this repo's
// existing `USDC_ADDRESS` (src/lib/blockchain/constants.js) and EURC
// address (tokenRegistry.js) exactly, which is a third independent
// confirmation that this is the right deployment for this app.
//
// This app only ever bridges FROM Arc Testnet (the connected wallet's
// network — see useWallet.js) TO one of the destinations below, never the
// reverse, so there is exactly one source-side TokenMessenger — Arc's —
// and the only thing that varies per destination is its CCTP domain id.
//
// depositForBurn on CCTP V2 takes a different argument list than V1
// (adds `destinationCaller`, `maxFee`, `minFinalityThreshold` for Fast
// Transfer support) — see bridgeService.js's TOKEN_MESSENGER_ABI.

/** Arc Testnet — the only source chain this app ever bridges from. */
export const ARC_SOURCE_CCTP = {
  domain: 26,
  tokenMessenger: '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
  messageTransmitter: '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
}

export const BRIDGE_CONTRACTS = {
  'base-sepolia': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 6 },
  'ethereum-sepolia': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 0 },
  'arbitrum-sepolia': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 3 },
  'optimism-sepolia': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 2 },
  'avalanche-fuji': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 1 },
  'polygon-amoy': { tokenMessenger: ARC_SOURCE_CCTP.tokenMessenger, domain: 7 },
  // Solana Devnet has a verified CCTP domain (5) too, but this app has no
  // Solana wallet integration to sign the destination-side interaction
  // with, so it stays unconfigured on purpose — see bridgeService.js's
  // `network.kind !== 'evm'` guard, which fails fast before this table is
  // even consulted for that route.
  'solana-devnet': { tokenMessenger: null, domain: null },
}

export function isBridgeConfigured(networkId) {
  return Boolean(BRIDGE_CONTRACTS[networkId]?.tokenMessenger)
}
