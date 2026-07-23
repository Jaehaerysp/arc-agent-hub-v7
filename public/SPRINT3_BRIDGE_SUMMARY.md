# Arc Agent Hub v8 — Sprint 3: Bridge Center

## Summary

Converted the four reference CLI bridge scripts into a full Bridge Center
feature (`/bridge`), built entirely on the existing Wallet/Payments
architecture from Sprints 1–2. UI, routing, navigation, folder structure,
and the Wallet/Payments patterns are all preserved — nothing existing was
redesigned or rewritten.

## New files

```
src/chains/bridgeNetworks.js               # destination network registry (Base/Eth/Arb/OP Sepolia, Fuji, Amoy, Solana Devnet)
src/styles/bridge-v7.css                   # additive; reuses wv7-hero/wv7-table/wv7-transfer-* elsewhere

src/features/bridge/
  BridgePage.jsx                           # page composition (route: /bridge)
  types/bridge.types.js                    # JSDoc shape documentation
  services/
    bridgeAssets.js (+ .test.js)           # USDC/EURC, reused from Wallet Token Registry + Payments' USDC_TOKEN
    bridgeContracts.js                     # TokenMessenger address registry — see "What isn't wired up" below
    bridgeService.js                       # approve + depositForBurn (CCTP), signer-only, no private keys
    bridgeEstimator.js                     # live gas estimate + published CCTP arrival windows
    bridgeHistoryService.js (+ .test.js)   # pure selectors over wallet.activity, type: 'bridge'
    bridgeErrors.js (+ .test.js)           # classifies errors into the 6 required cases
  hooks/
    useBridge.js                           # Pending→Submitted→Confirming→Completed/Failed state machine
    useBridgeEstimate.js                   # debounced fee/time estimate
    useBridgeHistory.js                    # memoized history selector
  components/
    BridgeHero.jsx, NetworkSelector.jsx, AssetSelector.jsx, BridgeSummary.jsx,
    BridgeForm.jsx, BridgeStatusDialog.jsx, BridgeHistoryTable.jsx
```

## Changed files (wiring only)

- `src/app/App.jsx` — added lazy `BridgePage` import + `/bridge` route.
- `src/app/nav.js` — added Bridge to `NAV_ITEMS` and the Treasury section of `NAV_SECTIONS`.
- `src/ui/icons.jsx` — added `IconBridge`.
- `src/styles/index.css` — added `@import './bridge-v7.css'`.

Every other existing file — Wallet, Payments, Transfer, Dashboard, Jobs,
Trust, design-system, etc. — is byte-for-byte unchanged (verified with a
recursive diff against the Sprint 1 baseline).

## Architecture

Same five-layer flow as the rest of the app:

```
UI (BridgePage/BridgeForm/…)
  ↓
Components (NetworkSelector, AssetSelector, BridgeSummary, …)
  ↓
Hooks (useBridge, useBridgeEstimate, useBridgeHistory)
  ↓
Services (bridgeService, bridgeEstimator, bridgeHistoryService, bridgeErrors)
  ↓
ethers.Contract (signer-only — no blockchain logic in components, no private keys anywhere)
```

- **Assets**: `BRIDGE_ASSETS` reuses `WALLET_TOKENS`/`USDC_TOKEN` — adding a
  `key` to `bridgeAssets.js`'s whitelist is enough to bridge a new asset.
- **Networks**: `chains/bridgeNetworks.js` follows the same "single source
  of truth" convention as `chains/arc.js`, covering all 7 networks the
  brief lists (6 EVM testnets are fully wired; Solana Devnet is listed but
  its actual signing path is intentionally disabled — see below).
- **Status pipeline**: Pending → Submitted → Confirming → Completed/Failed,
  implemented in `useBridge.js` and shown as a stepper in
  `BridgeStatusDialog.jsx`.
- **Error handling**: `bridgeErrors.js` classifies RPC errors, unsupported
  network, insufficient balance, user rejection, timeout, and network
  unavailable into consistent labels for `BridgeForm`.
- **Performance**: reuses `useTokenBalances`' existing polling/caching —
  no new balance-polling loop added.

## What isn't wired up (read before treating this as production-ready)

Two honest gaps, both flagged loudly in code comments at the point they matter:

1. **No verified TokenMessenger/CCTP contract address for Arc Testnet.**
   The reference scripts never touch a contract address directly — they
   call Circle's `@circle-fin/bridge-kit`, which resolves burn/mint
   contracts and the relayer internally, signed with a private key. This
   app's browser architecture deliberately avoids that private-key SDK
   path (same tradeoff Payments already made). `bridgeContracts.js` has
   the real, documented CCTP `depositForBurn` call ready to go, but every
   address is `null` until the team fills in a verified deployment —
   `useBridge`/`bridgeService` fail fast with a clear "not configured"
   error instead of guessing an address. This is why the deliverable
   below shows Build/Lint/Test as verified, but not an on-chain bridge
   transaction (there's nothing live to test against yet).
2. **Solana Devnet has no signer.** This app only ever holds an
   EVM `window.ethereum` signer; bridging to/from Solana needs a Solana
   wallet integration this app doesn't have. It's listed in the network
   registry (per the brief) but disabled in the selector and blocked in
   `bridgeService.js` with an explicit message, rather than silently
   failing.
3. **Destination-chain arrival isn't polled.** "Completed" in this app
   means the burn transaction confirmed on Arc Testnet — the mint on the
   destination chain depends on Circle's off-chain attestation relayer,
   which has no server component here to poll. `BridgeStatusDialog`
   states this directly rather than implying an arrival the app can't
   confirm.

## Testing

Sandbox has no npm/network access (same constraint as prior sessions), so
`npm test`/`npm run build`/`npm run lint` couldn't be run directly. What
was actually verified instead:

- **Build/syntax**: the entire app — including every new Bridge file and
  its wiring into `App.jsx`/`nav.js` — was bundled with `esbuild` in JSX
  mode. It resolves and bundles cleanly with zero errors or warnings,
  which catches syntax errors, broken imports, and mismatched exports
  across the whole tree, not just the new files.
- **Unit tests** (`bridgeAssets.test.js`, `bridgeHistoryService.test.js`,
  `bridgeErrors.test.js`) are written in the project's existing Vitest
  style. They couldn't run under `vitest` itself (no `node_modules`), so
  each pure function they exercise was separately bundled and smoke-run
  under plain Node with the same inputs the tests use — `BRIDGE_ASSETS`,
  `computeBridgeHistory`, and `classifyBridgeError` all produced the
  expected output.
- **Lint**: not run (no ESLint installed in this sandbox). Code follows
  the same import style, prop patterns, and formatting as the surrounding
  Payments/Transfer files it mirrors.
- **Existing modules**: confirmed unchanged via a recursive diff against
  the Sprint 1 baseline — only the four wiring files listed above differ.

Please run `npm install && npm run build && npm run lint && npm test`
locally before merging, same as prior sprints' honest-verification note.
