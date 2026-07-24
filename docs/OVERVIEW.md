# Arc Agent Hub — Overview

> Built on Arc Network. ARC_AGENT_HUB is an independent open-source project — see the [Brand Notice](../README.md#-brand-notice) in the root README.

**Version:** 5.1.0
**Stack:** React 18 + Vite + ethers.js v6 + React Router, plain JavaScript (no TypeScript), Vitest + React Testing Library for tests.

Arc Agent Hub is a web dashboard for the ERC-8004 AI Agent Identity protocol and ERC-8183 Agentic Commerce, running on Arc Testnet. It lets a connected wallet register an on-chain agent identity, browse and hire other agents through a marketplace, run the full ERC-8183 job lifecycle (create → budget → approve → fund → submit → complete), submit reputation feedback, request validation, and transfer the ANV token — all from one app, with no backend server.

## What's in this doc set

| Doc | Covers |
|---|---|
| `OVERVIEW.md` (this file) | What the product is, current modules, how the docs are organized |
| `ARCHITECTURE.md` | Folder layout, data flow, routing, providers — the "how it's wired together" view |
| `BLOCKCHAIN.md` | Wallet connection flow, ERC-8004 contract access, ERC-8183 contract access, why there are two patterns |
| `MARKETPLACE.md` | Agent Marketplace, Agent Profile, Hire Agent flow, and the on-chain discovery limitation |
| `DEVELOPMENT.md` | Local setup, scripts, conventions, testing |
| `PROJECT_ROADMAP.md` | Sprint history and what's planned next |
| `FAQ.md` | Common questions about network, marketplace data, Trust Center scoring, and contract-access patterns |

The root-level `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, and `CONTRIBUTING.md` remain the entry points for GitHub visitors; this `docs/` folder goes deeper on each topic for contributors actively working in the codebase.

## Current modules (v5.1.0)

| Module | Route(s) | Status |
|---|---|---|
| Landing | `/` | Complete |
| Dashboard | `/dashboard` | Complete |
| Agent Identity Registration (ERC-8004) | `/agents` → "Register Agent" tab | Complete |
| Agent Marketplace | `/agents` → "Marketplace" tab | Complete (static catalog — see `MARKETPLACE.md`) |
| Agent Profile | `/agents/:wallet` | Complete |
| Hire Agent flow | from Marketplace card or Profile → `/jobs/create` | Complete |
| Jobs (ERC-8183) | `/jobs`, `/jobs/create`, `/jobs/history`, `/jobs/:id` | Complete |
| Reputation | `/reputation` | Complete |
| Validation | `/validation` | Complete |
| Transfer (ANV) | `/transfer` | Complete |
| Settings | `/settings` | Complete |
| Developer Tools | `/developer-tools` | Complete |

## What v5.1 changed

v5.1 ("Stabilization & Developer Experience") shipped **zero user-facing behavior changes**. It brought the documentation up to date with what v5.0 had already shipped (Marketplace/Profile/Hire, which had no changelog entry before this release), added a first automated test suite, extracted a shared `usePolling` hook, and cleaned up small DX gaps (missing JSDoc). See `CHANGELOG.md` at the repo root for the full itemized list, and `PROJECT_ROADMAP.md` in this folder for what's next.
