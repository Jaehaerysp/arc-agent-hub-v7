# Development Workflow

## Requirements

- Node.js 18+
- npm
- MetaMask (or another injected-provider wallet) for manual testing against Arc Testnet

## Setup

```bash
git clone https://github.com/Jaehaerysp/arc-agent-hub-v8.git
cd arc-agent-hub
npm install
```

No environment variables are required — the app has no backend and reads all chain config from `src/chains/arc.js`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Starts the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint over `.js`/`.jsx`, warnings included (`--max-warnings=-1`) |
| `npm test` | Runs the Vitest suite once (CI mode) |
| `npm run test:watch` | Runs Vitest in watch mode |

All five of `build`, `lint`, and `test` should pass before opening a PR (see `CONTRIBUTING.md`).

## Testing

Configured via the `test` block inside `vite.config.js` — one config file for both the build and the test runner, rather than a separate `vitest.config.js` to keep in sync.

- **Environment:** `jsdom`
- **Setup file:** `src/test/setup.js` (loads `@testing-library/jest-dom` matchers)
- **Convention:** tests live next to the code they cover — `src/lib/format.test.js` beside `src/lib/format.js`, `JobStats.test.js` beside `JobStats.jsx`, etc. — so a file and its test move together and nothing needs mirroring into a parallel `__tests__` tree.

**Current scope is intentionally narrow:** pure functions with no side effects — formatters (`lib/format.js`), aggregations (`computeJobStats`, `computeAgentStats`), and lookups (`getAgentByWallet`) — plus the new `usePolling` hook (tested with fake timers via `@testing-library/react`'s `renderHook`).

**Explicitly out of scope for now:** anything that touches `ethers.Contract`, `BrowserProvider`, or a `signer` — `useContractWrite`, `useWallet`, `useJob`/`useJobs`, and everything in `src/contracts/`/`src/lib/blockchain/`. Testing these properly needs provider/signer mocking (or a local chain fork), which is real infrastructure work, not a quick add-on — see `PROJECT_ROADMAP.md`.

Example of adding a test for a new pure function:

```js
// src/lib/foo.js
export function double(n) { return n * 2 }

// src/lib/foo.test.js
import { describe, it, expect } from 'vitest'
import { double } from './foo'

describe('double', () => {
  it('doubles a number', () => {
    expect(double(21)).toBe(42)
  })
})
```

## Folder conventions

- One folder per feature under `src/features/<name>/`, exporting a single `<Name>Page.jsx` consumed as a `React.lazy` import in `App.jsx`.
- Promote a component to `src/ui/` only once it's used by two or more features — otherwise keep it in the feature's own `components/` folder.
- New contract addresses/ABIs for ERC-8004-style contracts go in `src/contracts/registry.js` + `src/contracts/abis/`; ERC-8183/Jobs-related additions go in `src/lib/blockchain/`. See `BLOCKCHAIN.md` for why these stay separate.
- New CSS goes in the most specific relevant file (`agents.css`, `jobs.css`, etc.) rather than growing `components.css`; only truly cross-feature primitives belong there.

## Linting

ESLint config (`.eslintrc.cjs`) extends `eslint:recommended`, `plugin:react/recommended`, and `plugin:react-hooks/recommended`. Notably: `no-unused-vars` is a warning (not an error) with an `^_` ignore pattern for intentionally-unused args, and `react-hooks/recommended` will catch missing/incorrect hook dependencies — pay attention to these warnings, since they're exactly the class of bug that caused the double-`giveFeedback()` transaction fixed in an earlier release (see `CHANGELOG.md`).

## Related docs

- `CONTRIBUTING.md` (repo root) — PR expectations and commit conventions.
- `BLOCKCHAIN.md` — contract/wallet specifics.
- `PROJECT_ROADMAP.md` — where testing and architecture work is headed next.
