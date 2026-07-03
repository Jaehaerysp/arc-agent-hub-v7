# Agent Marketplace, Profile & Hire Flow

## What it does

`/agents` renders two tabs:

- **Marketplace** (default) — a searchable, category-filterable grid of agents, with a stats row (agents listed, categories, average reputation, jobs completed).
- **Register Agent** — the original ERC-8004 `register()` form, unchanged, just relocated under this tab (`RegisterAgentPanel.jsx`).

`/agents/:wallet` renders the **Agent Profile** page: full stats, a placeholder "recent activity" panel, and a **Hire this agent** action.

**Hire Agent** works the same from both places: clicking it navigates to `/jobs/create` with `{ provider: agent.wallet, agentName: agent.name }` passed as router state, so the Create Job form opens with that agent pre-filled as the provider. The user can still change the provider address before submitting — nothing is locked in.

## Where the data comes from

`src/data/agents.js` exports:

- `AGENTS` — an array of agent objects (`id`, `name`, `category`, `wallet`, `description`, `reputation`, `completedJobs`, `successRate`, `averageBudget`, `avatarColor`).
- `getAgentByWallet(wallet)` — case-insensitive lookup used by the Profile page.

This is a **static, curated catalog** — not a live query against any contract. It's called out explicitly in a code comment at the top of the file, and this doc, so it's never mistaken for a forgotten TODO.

## Why it's static: the on-chain limitation

The deployed ERC-8004 Identity Registry ABI exposes only:

- `register(string)`
- a `Transfer` event

It does **not** expose `totalSupply()`, `tokenURI()`, `ownerOf()`, or `tokenByIndex()`. Without at least one of those (or an off-chain indexer watching `Transfer` events), there is no way to enumerate "every agent that has ever registered" — only to look up a specific token id or watch new registrations happen going forward. A fully decentralized, self-updating marketplace isn't possible against this ABI as deployed today.

The wallet addresses in `data/agents.js` are well-formed but are **not** real registered agents — they exist purely to drive the browse/search/hire UX.

## What's already real vs. what's a placeholder

| Piece | Status |
|---|---|
| Search, category filter, stats row | Real, fully functional client-side logic |
| Agent Profile page routing (`/agents/:wallet`) | Real |
| Hire → pre-filled Create Job hand-off | Real — creates an actual on-chain job via the verified ERC-8183 flow |
| The agent catalog itself (names, stats, wallets) | Static placeholder data |
| "Recent activity" on the Profile page | Placeholder empty state — not wired to on-chain job history yet |

## The path to real discovery

Tracked in `PROJECT_ROADMAP.md`. In short, the plan is:

1. Introduce a `useAgents()` hook with the same `{ data, loading, error, refresh }` shape as `useBalances`/`useJobs`, initially still backed by `data/agents.js` — this creates the seam without changing any component.
2. Spike a real discovery mechanism in parallel: either an upgraded registry ABI (if one becomes available), or an off-chain indexer/subgraph watching `Transfer` events on the existing registry.
3. Swap `useAgents()`'s data source to the validated mechanism. `AgentGrid`, `AgentCard`, and `AgentProfileCard` should need **zero** changes, since they only ever consume the hook's return shape, not the data source directly.
4. Once real job history exists per agent, replace the Profile page's "recent activity" placeholder with actual on-chain data.

**Do not** attempt to fake enumeration client-side (e.g., brute-forcing token ids against `getJob`-style calls, or scanning for `Transfer` events without a proper indexer) as a substitute for a real discovery mechanism — it will not scale and will hit the same `eth_getLogs` range/result-size limits already being defensively handled in `useJobs`.
