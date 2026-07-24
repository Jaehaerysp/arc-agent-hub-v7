# FAQ

> Built on Arc Network. ARC_AGENT_HUB is an independent open-source project — see the [Brand Notice](../README.md#-brand-notice) in the root README.

### Is ARC_AGENT_HUB an official Arc or Circle product?

No. It's an independent, open-source project that integrates with Arc
Network and Circle's developer tooling (Circle AppKit, CCTP). See the
[Brand Notice](../README.md#-brand-notice) for the full statement.

### What network does this run on?

Arc Testnet only, by design — see `src/chains/arc.js` for the chain id, RPC,
and explorer configuration. Multi-chain support is listed as a future idea
in [`ROADMAP.md`](../ROADMAP.md), not a current capability.

### Why is the Agent Marketplace a static catalog instead of live on-chain data?

The deployed ERC-8004 Identity Registry ABI only exposes `register(string)`
and a `Transfer` event — there's no `totalSupply()`, `tokenByIndex()`, or
`ownerOf()` to enumerate registered identities on-chain. `src/data/agents.js`
is an intentional, curated catalog rather than a forgotten placeholder. Full
detail is in [`docs/MARKETPLACE.md`](./MARKETPLACE.md) and
[`ARCHITECTURE.md`](../ARCHITECTURE.md#why-the-marketplace-uses-static-data)'s
"Why the Marketplace uses static data" section.

### Why does the Trust Center show scores derived from local activity instead of reading them from chain?

Neither the Reputation nor the Validation registry contract exposes a getter
to read a score or decision back — only `giveFeedback()` and
`validationRequest()` exist. `trustAnalytics.js` derives every figure shown
from this browser's own wallet activity log rather than an on-chain read.
This is documented in [`ARCHITECTURE.md`](../ARCHITECTURE.md) and the
`trustAnalytics.js` source comments.

### Does this app ever hold my private key or funds?

No. It's a client-side, non-custodial dApp — every transaction is signed by
your own connected wallet (MetaMask, Rabby, etc.). See
[`SECURITY.md`](../SECURITY.md) for the full policy and how to report a
vulnerability.

### Why do two different patterns exist for talking to contracts (`src/contracts/registry.js` vs. `src/lib/blockchain/`)?

This is deliberate, not inconsistent by accident. `src/contracts/registry.js`
covers Identity/Reputation/Validation/ANV; `src/lib/blockchain/` is carried
over from the verified ERC-8183 SDK so its addresses/ABIs/call signatures
stay traceable back to that source. See ARCHITECTURE.md's "A note on
contract-access patterns" for the reasoning, and don't merge them without
discussing it first (also called out in `CONTRIBUTING.md`).

### Can I connect a wallet other than MetaMask or Rabby?

Any injected-provider wallet works today. WalletConnect / non-injected
multi-wallet support is listed as a future idea in `ROADMAP.md`, not yet
implemented.

### Where do I report a bug vs. a security issue?

Bugs and feature requests: open a GitHub issue using the templates in
`.github/ISSUE_TEMPLATE/`. Security issues (anything that could put a
wallet or funds at risk): follow the private disclosure process in
[`SECURITY.md`](../SECURITY.md) — not a public issue.

### Is the Circle AppKit "kit key" safe to use as shown in `.env.example`?

For this project's Vite/React frontend (no backend to proxy through), the
key does end up in the client bundle — that's an accepted testnet-only
tradeoff, documented directly in `.env.example`. Never use a mainnet/
production key here; for production, proxy `kit.swap()`/`kit.estimateSwap()`
through a backend so the key never ships to the browser.

### Why plain JavaScript instead of TypeScript?

The whole Vite/React app is plain `.jsx`/`.js` — no `tsconfig`, no TS build
step. The one folder ported from a TypeScript SDK (`src/lib/blockchain/`,
from the verified ERC-8183 SDK) was deliberately converted to `.js` with
JSDoc-style comments rather than introducing a second toolchain for one
folder — see ARCHITECTURE.md's "ERC-8183 Agentic Commerce (Sprint 1)"
section.
