# Blockchain Architecture

## Wallet flow

1. `useWallet()` (`src/hooks/useWallet.js`) wraps `window.ethereum` (MetaMask): connect, disconnect, network detection/switch, and an activity log — all persisted through `useLocalStorage`.
2. `WalletProvider` (`src/app/providers/WalletProvider.jsx`) instantiates `useWallet()` once and exposes it via `useWalletContext()`, so every feature reads the same wallet state without prop drilling.
3. `AppLayout` gates every wallet-gated route: not connected → connect prompt; wrong network → "Switch to Arc" banner; otherwise → the page body.
4. Every write transaction uses the connected wallet's `ethers.Signer` — the app never holds, requests, or stores a private key. This matters especially for the ERC-8183 integration, since the SDK it was adapted from signed with raw private keys from a `.env` file (a Node-only CLI pattern); that pattern was deliberately **not** carried into the browser app.

Chain configuration (chain id, RPC URL, explorer, `wallet_addEthereumChain` params) lives in one place: `src/chains/arc.js`. Nothing else hardcodes these values.

## ERC-8004 (Identity, Reputation, Validation, ANV)

**Pattern:** `src/contracts/registry.js` + `src/contracts/abis/`.

```js
import { CONTRACTS } from '../contracts/registry'
// CONTRACTS.IDENTITY_REGISTRY.address / .abi / .label
// CONTRACTS.REPUTATION_REGISTRY, CONTRACTS.VALIDATION_REGISTRY, CONTRACTS.ANV_TOKEN
```

`registry.js` is the single source of truth for these four contracts — addresses and ABI fragments used to be duplicated across four separate panel components before this was introduced (see root `ARCHITECTURE.md`, "Why a contract registry"). Every read or write against these four contracts goes through `useContractWrite` (writes) or a direct `ethers.Contract(address, abi, provider)` (reads, e.g. in `useBalances`).

| Contract | Address |
|---|---|
| Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |
| ANV Token | `0x736223037D622ed365fa641a116daAcED7A5be96` |

**Known limitation:** the Identity Registry ABI exposes only `register(string)` and a `Transfer` event — no `totalSupply()`, `tokenURI()`, `ownerOf()`, or `tokenByIndex()`. There is currently no on-chain way to enumerate every registered identity. This is why the Agent Marketplace uses a curated static catalog instead of a live registry query — see `MARKETPLACE.md`.

## ERC-8183 (Agentic Commerce / Jobs)

**Pattern:** `src/lib/blockchain/` (`constants.js`, `abis.js`, `contracts.js`, `helpers.js`, `jobs.js`, `index.js`).

```js
import { createJob, setBudget, approveUsdc, fundJob, submitDeliverable, completeJob, getJob, listJobsForAccount, getUsdcAllowance } from '../lib/blockchain/jobs'
```

This was folded in from a verified, standalone ERC-8183 SDK (a Node.js CLI toolkit for testing the job lifecycle), with two deliberate adaptations for the browser:

1. Every write function takes a `signer` argument instead of loading a raw private key from `.env`.
2. The lib is plain `.js` (matching this project's toolchain), not the SDK's original TypeScript.

Contract addresses, ABI signatures, and call arguments are otherwise unchanged and were re-verified against the working SDK scripts.

| Contract | Address |
|---|---|
| Agentic Commerce | `0x0747EEf0706327138c69792bF28Cd525089e4583` |
| USDC | `0x3600000000000000000000000000000000000000` |

**Job discovery.** The SDK only exposes `getJob(id)` — there's no "list jobs" call. `listJobsForAccount()` fills that gap by reading indexed `JobCreated` logs (`jobId`, `client`, `provider`) for the connected account, then resolving each id with `getJob()`. It's read-only and additive; none of the seven verified functions were changed to add it.

**Status model.** The on-chain enum is `Open → Funded → Submitted → Completed` (plus terminal `Rejected`/`Expired`) — there's no on-chain "Budget Set" or "Approved" state. Those two are derived client-side while a job is `Open` (see root `ARCHITECTURE.md` for the exact derivation), and `JobActionPanel` role-gates the single correct next action per job.

## Why two patterns instead of one

`contracts/registry.js` and `lib/blockchain/` solve the same problem (contract addresses + ABIs + call helpers) differently, and that's intentional, not an oversight:

- ERC-8004 contracts were centralized into `registry.js` specifically to eliminate duplication that existed across four panels early in the project's history.
- ERC-8183 was integrated later from an external, verified SDK, and `lib/blockchain/` deliberately mirrors that SDK's file layout so its contents stay traceable back to the source it was verified against.

Both are production-stable today. Unifying them is tracked as a considered, future decision in `PROJECT_ROADMAP.md` — not something to do opportunistically inside an unrelated change, since the ERC-8183 write paths (funds, escrow) are exactly the code you don't want to refactor without a dedicated test pass first.

## Security notes

- No private keys, seed phrases, or API secrets exist anywhere in this codebase — signing is always delegated to the injected wallet provider.
- Contract addresses are hardcoded with an explicit "don't edit without verifying against a fresh deployment" comment in `registry.js` — if you're pointing this app at a new deployment, update it there (and in `lib/blockchain/constants.js` for ERC-8183), not inline in a component.
- No environment variables are required or read by the app.
