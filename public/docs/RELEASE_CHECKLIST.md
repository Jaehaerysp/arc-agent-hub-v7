# Arc Agent Hub Release Checklist

## v6.0.0-m2 — Navigation & Layout

## Build

- [x] npm install — 381 packages, clean
- [x] npm run build — succeeds, 253 modules transformed
- [x] npm run lint — 0 errors, 6 pre-existing warnings (unrelated files, unchanged)
- [x] npm test — 5 files / 31 tests passed

## Visual QA
Shell-only milestone — page content unchanged, verified pages still render
correctly inside the new shell:

- [x] Dashboard
- [ ] Marketplace (route not present in this build — N/A)
- [x] Jobs
- [x] Reputation
- [x] Validation
- [x] Transfer
- [x] Settings
- [x] Developer Tools

## Responsive

- [x] Desktop (>=1100px) — persistent full sidebar, user-toggleable collapse
- [x] Tablet (720–1099px) — sidebar forced to icon rail, always persistent
- [x] Mobile (<720px) — sidebar becomes off-canvas drawer with scrim

## Accessibility

- [x] Keyboard — command palette (⌘K/Ctrl+K, arrow keys, Enter, Esc), full nav tab order
- [x] Focus — global :focus-visible retained; nav items and icon buttons focus-visible
- [x] Contrast — reused existing token system (already WCAG AA per Design Vision §12)

## Git

- [ ] Commit
- [ ] Tag
- [ ] Push

---

## v6.0.0-m3 — Mission Control Dashboard

## Build

- [ ] npm install — **not run**: this build environment has no network egress
      (registry.npmjs.org returns `403 host_not_allowed`), so `node_modules`
      could not be installed here. No dependencies were added or changed —
      `package.json` is untouched — so `npm install` should still resolve
      cleanly against v6.0.0-m2's lockfile.
- [ ] npm run build — not run, same reason. All new/changed files were
      reviewed manually for import-path correctness, JSX validity, and
      prop-shape consistency (see Files Modified / Files Added in the
      accompanying summary).
- [ ] npm run lint — not run, same reason. Manually checked against the
      project's `.eslintrc.cjs` rules (no unused imports, hooks called
      unconditionally at the top of components, no undeclared JSX props).
- [ ] npm test — not run, same reason. `dashboardLogic.test.js` was added
      alongside the new logic, following the existing `computeJobStats`
      test's structure and style, and mirrors DashboardPage's real call
      shape (see `cellsFor()` helper in the test file).

**Action for the team:** run `npm install && npm run build && npm run lint && npm test`
locally or in CI before merging, and check these boxes once green.

## Visual QA

Mission Control replaces the Dashboard route only:

- [ ] Mission Hero — greeting, network, wallet, ANV balance, live clock
- [ ] Mission Status strip — all 6 cells (Agent Health, Jobs Running, Trust,
      Escrow, Network, System), overall ribbon color
- [ ] Needs your attention — action items + empty "all caught up" state
- [ ] Live activity (existing component, reused unchanged)
- [ ] Your agents — registered-agent card + empty "register" invite state
- [ ] Quick actions — all 5 tiles route correctly

Not touched, should render exactly as in m2: Marketplace/Agents, Jobs,
Reputation, Validation, Transfer, Settings, Developer Tools.

## Responsive

- [ ] Desktop (>=1100px) — 6-across Mission Status strip, 5-across quick actions
- [ ] Tablet (720–1099px) — 3-across status cells, 3-across quick actions
- [ ] Mobile (<720px) — 2-across status cells, 2-across quick actions, hero
      facts wrap without dividers

## Accessibility

- [ ] Keyboard — every card/button in the new sections is a real
      `<button>`/interactive `Card` reachable via Tab, with the existing
      global `:focus-visible` styles
- [ ] Status is never color-only — every Mission Status cell and attention
      item pairs its color with a text label
- [ ] Contrast — reused the existing token system (no new colors introduced)

## Git

- [ ] Commit
- [ ] Tag
- [ ] Push

---

## v6.0.0-m4 — Marketplace & Agent Profile

## Build

- [ ] npm install — **not run**: this build environment has no network egress
      (`curl -I https://registry.npmjs.org/react` returns `403`, header
      `x-deny-reason: host_not_allowed`), confirmed freshly this milestone,
      same constraint recorded in m3. No dependency changed — `package.json`
      is untouched — so install should still resolve cleanly against the
      existing lockfile once network access is available.
- [ ] npm run build — attempted; fails immediately with `sh: 1: vite: not
      found` because `node_modules` was never installed (not a code issue).
      In its place: a syntax-only `tsc --allowJs --checkJs false` pass was
      run over the entire `src/` tree (100 files) — 0 errors. A custom
      script verified every relative import in every new/changed file
      resolves to a real file and a real named/default export (0 problems),
      and every `agent.<field>` access used in the new components was
      cross-checked against the actual fields on the `AGENTS` data objects
      (0 mismatches).
- [ ] npm run lint — attempted; fails immediately with `sh: 1: eslint: not
      found`, same root cause. In its place, every new/changed file was
      manually audited against the exact rules in `.eslintrc.cjs`
      (`eslint:recommended`, `plugin:react/recommended`,
      `plugin:react-hooks/recommended`): unused imports, `react/jsx-key` on
      every `.map()`, `react/no-unknown-property` on the new SVG mark,
      hook rules (`useEffect`/`useMemo` dependency arrays), and
      `react/no-unescaped-entities` on every JSX text node. One real
      instance of the latter was found and fixed
      (`MarketplaceHero.jsx`, an apostrophe in "you're browsing" →
      `&apos;re`, matching the existing convention in
      `CreateJobPage.jsx`/`JobActionPanel.jsx`). Two foreseeable
      `react-refresh/only-export-components` warnings were designed out
      before they could fire: `isAtCapacity` was moved out of
      `AvailabilityBadge.jsx` into `lib/agentAvailability.js`, and
      `SORT_OPTIONS` was un-exported from `MarketplaceFilters.jsx` (nothing
      outside that file imported it).
- [ ] npm test — attempted; fails immediately with `sh: 1: vitest: not
      found`, same root cause. Tests **do exist** in this repo (6 files,
      including `src/data/agents.test.js` and
      `src/features/agents/components/AgentStats.test.js`, both in this
      milestone's scope) — this is not a "no tests" situation, it's that
      the test runner binary was never installed. Both in-scope test files
      were traced by hand against the current code: `AgentStats.jsx`
      (`computeAgentStats`) was not modified at all, and its test uses
      fully inline fixtures, so it's unaffected by this milestone's changes;
      `data/agents.js` changes were purely additive new fields with every
      existing field/value/shape kept intact, and `getAgentByWallet`'s
      logic was not touched, so `agents.test.js` should still pass. This is
      a manual trace, not a substitute for actually running the suite.

**Action for the team:** run `npm install && npm run build && npm run lint && npm test`
locally or in CI — this environment cannot reach the npm registry at all
(sandbox network policy), not a project problem. Check these boxes once green.

## Marketplace / Agent Profile build checklist

- [x] Marketplace Hero
- [x] Featured Agent section
- [x] Editorial Agent Cards (identity mark, specialty + skills, trust bar,
      availability, rate de-emphasized, no star ratings)
- [x] Enhanced Agent Profile (registration badge, Trust Snapshot, Terms,
      Job History empty state)
- [x] Trust Snapshot component (shared between card + profile)
- [x] Skills & specialization layout
- [x] Availability status (Available / Busy / At capacity)
- [x] Search & category filter chips + sort
- [x] Empty state names the active filters and offers one-tap Clear
- [x] Hire flow UI — same `navigate('/jobs/create', { state: { provider,
      agentName } })` contract as before; "At capacity" only disables the
      marketplace shortcut, no blockchain/hiring logic changed

Not touched, should render exactly as before: Dashboard, Jobs, Reputation,
Validation, Transfer, Settings, Developer Tools, Wallet, hooks, contracts,
providers, routing.

## Responsive

- [x] Desktop (>=1100px) — 3-across agent grid
- [x] Tablet (641–1099px) — 2-across agent grid
- [x] Mobile (<=640px) — 1-across agent grid, featured agent/profile header/
      filters row stack to a single column
      (breakpoints match the existing 640px/1100px/520px values already
      used in `dashboard.css`/`features.css`)

## Accessibility

- [x] Keyboard — every action is a real `<button>`; no interactive element
      is nested inside another (an earlier draft made the whole card a
      `role="link"` click target wrapping its own buttons — invalid ARIA,
      removed in favor of two explicit buttons)
- [x] Screen reader — repeated per-card buttons get a contextual
      `aria-label` (e.g. "Hire Research Agent") so they're distinguishable
      out of context; category chips use `role="group"` +
      `aria-pressed`; Trust Bar exposes `role="img"` with a text
      equivalent ("Reputation 4.8 out of 5") so the score is never
      conveyed by segment fill alone
- [x] Contrast — reused the existing token system, no new colors introduced

## Git

- [ ] Commit
- [ ] Tag
- [ ] Push