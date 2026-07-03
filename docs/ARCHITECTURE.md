# Architecture (deep dive)

For the full annotated folder tree, see the root [`ARCHITECTURE.md`](../ARCHITECTURE.md) — it's kept as the single source of truth for file-by-file layout so it doesn't drift out of sync with a second copy here. This doc covers the shape of the system at a higher level: how the pieces fit together and why.

## The shape of the app

```
Wallet (MetaMask)
     │
     ▼
useWallet() ──► WalletProvider (React Context) ──► useWalletContext()
                                                          │
                              ┌───────────────────────────┼───────────────────────────┐
                              ▼                           ▼                           ▼
                    Feature pages (routes)      contracts/registry.js        lib/blockchain/*
                    read wallet state via        (ERC-8004: Identity,        (ERC-8183: Jobs)
                    useWalletContext()            Reputation, Validation,
                                                   ANV token)
```

- **One wallet instance, shared everywhere.** `WalletProvider` creates a single `useWallet()` instance and shares it via context — no prop drilling, no duplicate `eth_requestAccounts` calls.
- **Two contract-access modules, by design.** ERC-8004 contracts go through `contracts/registry.js`; ERC-8183 (Jobs) goes through `lib/blockchain/`. See `BLOCKCHAIN.md` for why these are separate and why that's staying that way for now.
- **Feature-based folders.** Each user-facing feature is one folder under `src/features/`, exporting a single `<Feature>Page.jsx` that's `React.lazy`-loaded by the router. Shared UI lives in `src/ui/`; shared non-UI logic lives in `src/hooks/` and `src/lib/`.

## Routing

Registered once, in two places that must stay in sync:

1. `src/app/nav.js` — sidebar entries.
2. `src/app/App.jsx` — the actual `<Route>` elements, each a `React.lazy` import.

`/` is the only route outside the wallet-gated `AppLayout` (the public landing page). Every other route — including `/agents/:wallet`, the Agent Profile page — renders inside `AppLayout`, which shows a connect prompt or "switch network" banner instead of the page body when the wallet isn't ready.

## Providers

| Provider | Wraps | Provides |
|---|---|---|
| `ThemeProvider` | Everything | Dark/light theme, persisted to `localStorage` |
| `ToastProvider` | Everything | `useToast()` — app-wide toast notifications |
| `WalletProvider` | Everything except the two above | `useWalletContext()` — account, signer, provider, chain id, activity log, agent id |

## Data flow for a typical write action

1. A feature page reads `signer`/`account`/`addActivity` from `useWalletContext()`.
2. It calls `useContractWrite({ address, abi, signer, addActivity })` (ERC-8004) or a `lib/blockchain/jobs.js` function via `useAsyncAction()` (ERC-8183).
3. The hook handles the try/await-receipt/catch lifecycle, exposes `loading`/`error`/`success`, and logs the outcome to the shared activity feed.
4. Activity and the registered agent ID persist to `localStorage` via `useLocalStorage`, surviving reloads.

## Data flow for polled reads

`useBalances` (native + ANV balance) and `useJobs` (job list) both follow the same shape, now built on the shared `usePolling(fn, intervalMs, enabled)` hook (added in v5.1 — see the "Polling" section of the root `ARCHITECTURE.md` for the exact refactor and why it's behavior-identical to what came before):

```
mount ──► fn() runs immediately ──► enabled? ──► setInterval(fn, intervalMs)
                                        │
                                        └─ false ──► no repeat timer
```

`useJob` (singular — a single job's detail + USDC allowance) was intentionally left as its own implementation in v5.1 rather than migrated to `usePolling`, to keep this release's diff minimal and fully verifiable.

## Styling

Everything is CSS custom properties (`src/styles/tokens.css`) plus plain CSS files, one per concern (`base`, `layout`, `components`, `features`, `jobs`, `agents`). No CSS-in-JS, no Tailwind. New feature-specific styles get their own file rather than growing `components.css` indefinitely.

## See also

- Root [`ARCHITECTURE.md`](../ARCHITECTURE.md) — full folder tree, the contract-registry rationale, the ERC-8183 SDK integration story, the Marketplace/Hire flow details, the polling refactor, and the testing setup.
- [`BLOCKCHAIN.md`](./BLOCKCHAIN.md) — everything contract- and wallet-related.
- [`MARKETPLACE.md`](./MARKETPLACE.md) — Marketplace/Profile/Hire specifics and the discovery limitation.
