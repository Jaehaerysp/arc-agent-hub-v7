# Arc Agent Hub — UI Blueprint
## The Official Design Manual

*A text-based Figma specification. Every page is defined completely enough to build without further design questions. Companion to the Design Vision document — read that first for brand rationale; read this for exact execution.*

---

# PART A — PAGE SPECIFICATIONS

---

## 1. Dashboard

### 1.1 Purpose
The first five seconds of every session. Its job is to answer three questions before the user scrolls: *Is everything okay? What's mine? What needs me right now?* Emotion target: **quiet command** — the feeling of a status board that already did the checking for you.

### 1.2 Information Hierarchy
1. **Network + connection state** (header) — nothing below matters if the wrong network is selected.
2. **The four hero metrics** (Agents owned, Active jobs, Reputation average, ANV balance) — the "is everything okay" answer.
3. **Jobs needing attention** — the one section that can demand action.
4. **Live activity feed** — ambient awareness, not action-required.
5. **Your agents roster** — identity reference, lowest urgency; you already know your own agents exist.

### 1.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ ◆ Arc Agent Hub                    Arc Testnet ● Connected  [0x3f…]│  h=68
├──────────┬─────────────────────────────────────────────────────────┤
│          │  Good afternoon.  3 agents active, 2 jobs in progress.  │  24px margin
│ Dashboard│                                                          │
│ Market   │  ┌───────────┐┌───────────┐┌───────────┐┌───────────┐  │
│ Agents   │  │ AGENTS    ││ ACTIVE    ││ REPUTATION││ ANV       │  │  stat-card row
│ Jobs     │  │ 3         ││ JOBS: 2   ││ AVG: 94   ││ 1,204.50  │  │  gap 16
│ Reputa.  │  └───────────┘└───────────┘└───────────┘└───────────┘  │
│ Valid.   │                                                          │
│ Transfer │  Needs your attention                                   │  section label, 24px above
│          │  ┌────────────────────────────────────────────────────┐│
│ Settings │  │ ● Job #204 — validator response overdue   [Review] ││  attention list, 1 card
│ Dev Tools│  └────────────────────────────────────────────────────┘│
│          │                                                          │
│          │  ┌───────────────────────┐  ┌─────────────────────────┐│
│          │  │ Live Activity          │  │ Your Agents             ││  two-column, 16 gap
│          │  │ ● Job #204 completed    │  │ [avatar] Scout-01       ││
│          │  │ ● New job posted        │  │ [avatar] Auditor-02     ││
│          │  │ ● Validation confirmed │  │ [+ Register new agent]  ││
│          │  └───────────────────────┘  └─────────────────────────┘│
└──────────┴─────────────────────────────────────────────────────────┘
```

### 1.4 Tablet Layout
Sidebar collapses to icon rail (76px). Stat cards drop from 4-across to 2×2 grid. "Needs attention" and the two-column section both go full-width, stacked vertically in priority order (attention → activity → roster).

### 1.5 Mobile Layout
Sidebar becomes a bottom-accessible drawer triggered by a header menu icon. Stat cards become a horizontally swipeable row of 4 (one full-width card per swipe, with dot pagination) rather than a shrinking grid — protects legibility of the hero numbers over cramming. "Needs attention" stays pinned directly under the greeting, above the stat row, since on a small screen action-required content outranks ambient status. Activity feed and roster stack full-width beneath.

### 1.6 Component Usage
- **Metric Card ×4** — the hero numbers; only one (Reputation, or whichever is most abnormal that session) may use the gradient-text treatment.
- **Attention Card** — a variant of Metric Card with a left status-color bar and an inline primary button, so the action is reachable without a second click.
- **Activity Feed (Timeline, compact variant)** — dot-and-line list, see §Timeline.
- **Agent Roster List** — Avatar + name row, not full Agent Cards; this page references agents, the Marketplace/Profile pages present them.
- **Status Dot** — inline live/connected indicator in header.

### 1.7 Interaction Flow
- **Hover** on a stat card: 2px lift, top accent bar fades in.
- **Click** on "Needs attention" row: navigates directly to that Job Detail page, deep-linked to the action required.
- **Loading**: stat cards render as number-shaped skeletons on first load; activity feed renders as 3 skeleton rows.
- **Success**: a completed job in the activity feed settles from a pending dot to a solid success dot with a 200ms color fade, no motion beyond that.
- **Failure**: a fetch failure on any one card degrades that card only, to an inline "Couldn't load — retry" state; never blocks the rest of the dashboard.
- **Empty**: a brand-new wallet sees a modified greeting ("Welcome — register your first agent to get started") and the four stat cards show 0-states with a single connecting sentence rather than four separate "no data" messages.
- **Disabled**: N/A at this page level.
- **Keyboard**: `g d` jumps here from anywhere (command-bar shortcut, see Developer Tools/global nav); Tab order follows hierarchy top-to-bottom, left-to-right.

### 1.8 Animation
- Stat card lift: 150ms, `ease-out`, purpose: affordance that the card is interactive/live.
- Activity feed new item: slides in from top, 200ms `ease-out`, purpose: draw the eye to genuinely new information without being alarming.
- Greeting sentence: no animation — static text should never move, it's read once.

### 1.9 Accessibility
- Stat cards are `<section>` landmarks with `aria-label` matching their visible label, so screen-reader users get "Agents, 3" not just "3."
- The live activity feed is `aria-live="polite"` — announces new items without interrupting whatever the user is doing.
- Network status dot has a text equivalent ("Connected to Arc Testnet") always present, never color-only.
- Full dashboard reachable and operable via keyboard with visible focus rings on every card and list row.

### 1.10 Visual Priority
Dominant: the four stat cards, especially whichever metric is currently abnormal. Recede: the live activity feed (ambient, lower contrast text, no card border — feels like it's "behind glass") and the "Your Agents" roster (reference only, smallest type on the page).

---

## 2. Marketplace

### 2.1 Purpose
Where hiring decisions get made. Not a product catalog — a talent pool. Emotion target: **confident evaluation** — the feeling of reviewing résumés, not browsing a shop.

### 2.2 Information Hierarchy
1. **Search + category filter** — most visitors arrive with intent, not to browse.
2. **Agent identity + specialty** (per card) — who is this and what do they do, in plain language.
3. **Reputation signal** — trust, before price.
4. **Rate / terms** — the commercial fact, deliberately after trust is established.
5. **Hire action** — always present, never the first thing noticed.

### 2.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Marketplace                                     [⌘K Search agents] │
│ Find the right agent for the job.                                  │
│ [All] [Development] [Writing] [Data] [Ops]      Sort: Reputation ▾ │
├────────────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐                       │
│ │ [mark] name│ │ [mark] name│ │ [mark] name│   3-across grid,      │
│ │ Specialty  │ │ Specialty  │ │ Specialty  │   gap 16, card pad 20 │
│ │ ●●●●○ 94   │ │ ●●●●● 99   │ │ ●●●○○ 78   │                       │
│ │ 12 ANV/job │ │ 40 ANV/job │ │ 8 ANV/job  │                       │
│ │  [Hire →]  │ │  [Hire →]  │ │  [Hire →]  │                       │
│ └────────────┘ └────────────┘ └────────────┘                       │
│  (grid continues, 3 rows visible before scroll)                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.4 Tablet Layout
Grid drops to 2-across. Category filter row becomes a horizontally scrollable chip strip instead of wrapping, to preserve the sort control's position.

### 2.5 Mobile Layout
Single column, full-width cards. Search moves into the header as an icon that expands to a full-width field on tap (saves vertical space). Category filters collapse into a single "Filter" button opening a bottom sheet.

### 2.6 Component Usage
- **Agent Card (Marketplace variant)** — identity mark, name, specialty line, reputation as a 5-segment trust bar (not stars — see §Status/Trust patterns), rate, single primary action.
- **Search field** with `⌘K` affordance, shared visual language with the global Command Bar.
- **Filter Chips** — pill toggle group, single or multi-select by category.
- **Sort Dropdown** — text + chevron, opens a simple list, no icons needed.

### 2.7 Interaction Flow
- **Hover** card: lift + border brighten, rate and Hire button gain slightly more contrast to signal "this is now the focused card."
- **Click** card body (not the button): navigates to Agent Profile. Click **Hire**: opens the hiring flow directly (skips profile if user already knows who they want).
- **Loading**: 6 skeleton cards on first paint, matching exact card geometry.
- **Success**: N/A on this page (success lives in the hiring flow).
- **Failure**: search/filter returning zero agents is *not* an error — see Empty.
- **Empty**: "No agents match these filters" with the active filters listed and a one-tap "Clear filters" — never a dead end.
- **Disabled**: agents currently at job capacity show a muted card state with "At capacity" replacing the Hire button, card remains browsable (click-through to profile still works).
- **Keyboard**: `/` focuses search from anywhere on the page; arrow keys move focus grid-wise between cards when search is not focused.

### 2.8 Animation
- Filter chip toggle: 120ms background fade, no movement — filtering should feel instant, not choreographed.
- Grid re-flow on filter change: cards that remain fade+reflow over 180ms; this avoids a jarring full-grid flash.

### 2.9 Accessibility
- Each card is a labeled link/region announcing name, specialty, and reputation in one pass for screen readers.
- Trust-bar reputation has a numeric text equivalent adjacent, never conveyed by segment fill alone.
- Filter chips are a proper `role="group"` of toggle buttons with `aria-pressed`.

### 2.10 Visual Priority
Dominant: agent identity mark + name (this is a résumé, lead with who). Recede: the rate — present, legible, but never larger or bolder than the reputation signal above it.

---

## 3. Agent Profile

### 3.1 Purpose
The résumé. Where a hiring decision is confirmed. Emotion target: **due diligence satisfied** — by the time the user reaches the bottom, they should feel they know enough to commit funds.

### 3.2 Information Hierarchy
1. **Identity block** — mark, name, registration proof (this agent is who it claims to be).
2. **Reputation trend** — track record over time, not a single number.
3. **Job history** — evidence, the portfolio.
4. **Terms + Hire action** — the commercial decision, made last, once trust is established.

### 3.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ ← Marketplace                                                       │
│ ┌────┐  Scout-01                          ✓ Registered · ERC-8004  │
│ │mark│  Development · Solidity audits                              │
│ └────┘  0x3f2a…19c4  [copy]                          [Hire →]      │
├──────────────────────────┬───────────────────────────────────────┤
│ Reputation                │  Terms                                 │
│ ┌──────────────────────┐  │  Rate: 12 ANV / job                    │
│ │  trend line, 90d      │  │  Avg. delivery: 6h                    │
│ │  ╱‾‾╲___╱‾‾‾‾╲        │  │  Response rate: 98%                   │
│ └──────────────────────┘  │  [Hire this agent →]                   │
│ ● Job #204 · +2  Jul 2   │  └───────────────────────────────────┘
│ ● Job #198 · +1  Jun 28   │
├───────────────────────────┴──────────────────────────────────────┤
│ Job History                                                        │
│ [job row] [job row] [job row] [job row]  ← scannable list, 8 rows │
└────────────────────────────────────────────────────────────────────┘
```

### 3.4 Tablet Layout
Two-column Reputation/Terms section stacks to one column, Terms panel moves directly under the identity block (so the commercial decision stays reachable near the top even as the page grows taller).

### 3.5 Mobile Layout
Identity block, Hire button, reputation trend (simplified sparkline, no inline point labels), then Terms as a compact list, then Job History as a vertically scrollable list. Hire action is additionally pinned as a persistent bottom bar so it's reachable without scrolling back up.

### 3.6 Component Usage
- **Identity mark (large)**, **Registration Badge** (verified checkmark + standard reference), **Copy Button** on address.
- **Reputation Sparkline/Line Chart** with labeled point markers for significant events (ties to §Reputation page for the full version).
- **Job History List** — compact table-as-list, reuses the Timeline row pattern.
- **Terms Card** — a small, static metric card, not a form.

### 3.7 Interaction Flow
- **Hover** on a reputation trend point: tooltip with the specific event and delta.
- **Click** a job history row: opens that Job's detail page in a new context (profile remains the "back" target).
- **Loading**: identity block renders first (it's already known from the marketplace card), reputation and job history stream in independently with their own skeletons.
- **Failure**: if reputation history fails to load, show the current score only with a note, rather than blocking the whole page.
- **Empty**: a freshly-registered agent with no job history shows an explicit "No completed jobs yet — reputation builds after the first delivery," not a blank chart.
- **Keyboard**: standard tab order top-to-bottom; job history rows are individually focusable and Enter-activatable.

### 3.8 Animation
- Reputation trend line: draws in once on first load (400ms, `ease-out`), never re-animates on re-render — this is data, not a show.
- Hire button: identical weighted-click behavior described in Design Vision §3 (Buttons).

### 3.9 Accessibility
- Trend chart has a text-table equivalent available via a "View as table" toggle for screen-reader and low-vision users.
- Registration Badge state ("Registered") is real text, not an icon-only checkmark.

### 3.10 Visual Priority
Dominant: identity block and the Hire action (this page exists to convert a decision). Recede: raw wallet address and job history metadata (timestamps, tx refs) — present but in mono, muted, smallest type on the page.

---

## 4. Register Agent

### 4.1 Purpose
Onboard a new agent identity on-chain. This is a **commitment**, not a signup form — the user is creating a permanent, cryptographically real identity. Emotion target: **careful confidence** — the form should feel simple to fill out but visibly serious to submit.

### 4.2 Information Hierarchy
1. **What this action does** — one sentence, stated before any field, since this writes to the chain irreversibly.
2. **Identity fields** — name, specialty, description: what humans will see.
3. **Optional/advanced fields** — collapsed by default (evaluator address, custom metadata).
4. **The register action** — clearly the heaviest button on the page.

### 4.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Register a new agent identity                                       │
│ This creates a permanent, on-chain identity under ERC-8004.         │
├────────────────────────────────────────────────────────────────────┤
│  Name                              [___________________________]   │
│  Specialty                         [___________________________]   │
│  Description                       [___________________________]   │
│                                     [___________________________]   │
│                                                                      │
│  ▸ Advanced (optional)                                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  You're registering as 0x3f2a…19c4 on Arc Testnet.            │  │
│  │  [Cancel]                                    [Register agent →]│ │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```
Single column, max-width ~560px, centered — this is a focused, one-decision form, not a dashboard-width page.

### 4.4 Tablet Layout
Identical single-column form, full available width up to the same 560px cap (form does not stretch to fill a wider viewport — line length stays readable).

### 4.5 Mobile Layout
Same field order; the confirmation bar (wallet address + Register button) becomes sticky to the bottom of the viewport so it's always reachable while filling long fields.

### 4.6 Component Usage
- **Field Group** (label + input/textarea + optional hint), **Collapsible Section** ("Advanced"), **Confirmation Bar** — a distinct, slightly elevated footer container that states exactly what wallet is signing.
- **Primary Button (heavy variant)** for Register — see §Buttons for the weighted-action treatment.

### 4.7 Interaction Flow
- **Hover**: standard input border-brighten; no special hover on the form itself.
- **Click** Register: triggers wallet signature request; button enters loading state immediately, label changes to "Confirm in wallet…"
- **Loading**: after signature, button label changes again to "Registering on Arc Testnet…" with a subtle progress affordance (see Motion System) — never a bare spinner for a chain write.
- **Success**: on confirmation, the form transitions to a success panel with the new agent's identity mark and a direct link to its new profile — not just a toast, since this is a significant, page-defining event.
- **Failure**: a rejected signature or failed transaction returns the user to the filled form (nothing lost) with a specific inline explanation ("Transaction rejected in wallet" vs. "Network confirmation failed — try again").
- **Empty**: N/A (this page IS the empty-state resolution for a new user).
- **Disabled**: Register button is disabled (not hidden) until required fields are valid, with the specific missing requirement surfaced on hover/focus of the disabled button.
- **Keyboard**: full tab order through fields, Advanced section togglable via Enter/Space, form submittable via Enter from any single-line field.

### 4.8 Animation
- Advanced section expand: 200ms height auto-animate, `ease-out`.
- Success panel transition: 250ms cross-fade from form to success state, purpose: mark this as a distinct, resolved moment rather than an in-place update.

### 4.9 Accessibility
- Every field has a programmatically associated label (not placeholder-as-label).
- The confirmation bar's wallet address is announced in full to screen readers even though visually truncated.
- Loading states update an `aria-live="assertive"` region so screen-reader users get "Confirm in wallet," "Registering," "Registered" without needing to poll.

### 4.10 Visual Priority
Dominant: the Register button and the one-sentence explanation above the form. Recede: the Advanced section, collapsed and visually quiet until opened.

---

## 5. Jobs Overview

### 5.1 Purpose
The pipeline view — every job the user is party to (as client or agent), organized by where it stands. Emotion target: **control of a moving system**, not a static record search.

### 5.2 Information Hierarchy
1. **Stage columns** (or equivalent grouped view) — what stage is each job in, first.
2. **Jobs requiring a decision from you** — visually distinct wherever they appear, regardless of stage.
3. **Job identity** (title, counterparty) — second glance.
4. **Amount and timestamps** — reference detail, lowest priority in this view (full detail lives in Job Details).

### 5.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Jobs                                    [+ Create job]  [Search  ] │
│ Draft(1)  Posted(2)  Accepted(1)  In Progress(2)  Delivered(1)  Paid(9)│  ← stage tabs w/ counts
├────────────────────────────────────────────────────────────────────┤
│ In Progress                                                         │
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ #204  Solidity audit — Scout-01           4.5h elapsed  ⚠ due │   │  card-per-job, not row-
│ └──────────────────────────────────────────────────────────────┘   │  per-job — jobs carry
│ ┌──────────────────────────────────────────────────────────────┐   │  enough state to earn
│ │ #201  Copy review — Wordsmith-04          1.2h elapsed        │   │  a card, not a table row
│ └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```
Default view: stage tabs (a lightweight kanban-by-selection, not a literal multi-column board, to keep desktop width usable at any viewport ≥1024px). A "Board" toggle is available for users who prefer seeing all stages simultaneously as true columns.

### 5.4 Tablet Layout
Stage tabs become a horizontally scrollable strip (counts still visible). Board-view toggle is hidden below 1024px — tablet defaults to tab view only, since true columns don't fit usefully.

### 5.5 Mobile Layout
Stage tabs collapse into a single dropdown ("Viewing: In Progress ▾") to save the header. Job cards stack full-width, simplified to title, counterparty, and the single most relevant timestamp/state.

### 5.6 Component Usage
- **Job Card (list variant)** — title, counterparty avatar+name, elapsed/remaining time, a Status Chip, and a warning icon only when actually overdue (never decorative).
- **Stage Tabs** with inline counts, shared pattern with §Tabs.
- **Search field** — filters by job title or counterparty, not a separate page.

### 5.7 Interaction Flow
- **Hover**: card lift, identical to other interactive cards.
- **Click**: navigates to Job Details.
- **Loading**: skeleton cards matching the current stage's typical count (or 3 as default).
- **Success/Failure**: N/A at overview level — surfaced within Job Details.
- **Empty**: an empty stage ("No jobs in Draft") shows the stage's purpose in one line plus the Create Job action where relevant, rather than a bare blank tab.
- **Disabled**: N/A.
- **Keyboard**: number keys `1`–`6` jump between stage tabs; `c` opens Create Job.

### 5.8 Animation
- Stage tab switch: 150ms cross-fade of the card list, no slide (this is filtering, not navigating pages).
- Overdue warning icon: a single, slow (1.5s) opacity pulse — deliberately subtle, meant to be noticed on a glance, not to demand attention like a flashing alert.

### 5.9 Accessibility
- Stage tabs are a proper ARIA tablist with counts announced ("In Progress, 2 jobs").
- Overdue state is conveyed by icon + text ("Due") + color, never color alone.

### 5.10 Visual Priority
Dominant: jobs that need a decision (via the attention pattern from Dashboard, reused here). Recede: Paid/completed jobs — accessible via their tab but visually the quietest, most compact card treatment of any stage.

---

## 6. Create Job

### 6.1 Purpose
Post a new job for an agent to accept. Emotion target: **clear terms, low ambiguity** — the user should feel the job they post is exactly the job that gets delivered, because the form made every term explicit.

### 6.2 Information Hierarchy
1. **What the job is** — title, description (the work itself).
2. **Terms** — budget, expiration, evaluator (the contract).
3. **Who can do it** — direct-assign to a specific agent, or post openly (optional, defaults to open).
4. **Confirm + fund** — the commitment step.

### 6.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Create a job                                                        │
├────────────────────────────────────────────────────────────────────┤
│ Title                    [_______________________________________] │
│ Description               [______________________________________]│
│                            [______________________________________]│
│                                                                      │
│ Budget (USDC)   [______]   Expiration   [______]   Evaluator (opt) │
│                                                        [__________] │
│                                                                      │
│ Assign to        ( ) Open to marketplace   ( ) Specific agent [___]│
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Funds are held in escrow until the job is validated.          │  │
│  │  [Cancel]                              [Create & fund job →]   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 6.4 Tablet Layout
Same single-column form; Budget/Expiration/Evaluator row wraps to 2-up then 1-up rather than compressing field widths below a usable size.

### 6.5 Mobile Layout
Fully stacked, one field per row; the escrow confirmation bar is sticky-bottom, matching the Register Agent pattern for consistency across all "this writes to chain" forms.

### 6.6 Component Usage
- **Field Group** (shared with Register Agent), **Radio Group** for assignment mode, **Amount Input** (currency-aware, see §Forms), **Confirmation Bar**.

### 6.7 Interaction Flow
- **Hover/Click/Loading/Success/Failure**: identical pattern family to Register Agent §4.7 — every on-chain-writing form in the product shares this exact interaction shape deliberately, so users learn it once.
- **Empty**: N/A (this is itself the empty-state resolution for Jobs Overview).
- **Disabled**: "Create & fund job" disabled until title, description, and budget are valid; "Specific agent" field disables until that radio is selected.
- **Keyboard**: radio group operable via arrow keys, full tab order, Enter submits from the last field.

### 6.8 Animation
- Radio selection revealing the agent-picker field: 150ms height auto-animate, matches Advanced-section pattern.
- Escrow bar's explanatory sentence updates its amount live as Budget is typed (no animation — should feel instantaneous, like a calculator).

### 6.9 Accessibility
- Radio group is a true `role="radiogroup"` with arrow-key navigation.
- The escrow explanation sentence updates are read by `aria-live="polite"` only when the field loses focus (not on every keystroke, which would be disruptive).

### 6.10 Visual Priority
Dominant: Title and Description (the work itself). Recede: Evaluator field — genuinely optional, styled with the same "optional" Badge pattern used in the existing form fields.

---

## 7. Job Details

### 7.1 Purpose
The single source of truth for one job's story. Emotion target: **narrative clarity** — anyone opening this page, client or agent, should immediately know what happened, what's happening, and what's next.

### 7.2 Information Hierarchy
1. **Current stage + what's needed right now** (if anything).
2. **The timeline** — what happened, in order.
3. **Terms** — the agreed facts (budget, parties, expiration).
4. **Raw chain reference** — transaction hashes, contract calls — lowest priority, always available, never forced.

### 7.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ ← Jobs        #204 · Solidity audit                    [Delivered] │
│ Scout-01 (agent) ⇄ You (client)             Awaiting your validation│
│                                                    [Validate now →] │
├──────────────────────────┬───────────────────────────────────────┤
│ Timeline                  │  Terms                                 │
│ ● Posted        Jul 1     │  Budget: 12 ANV                        │
│ ● Accepted      Jul 1     │  Evaluator: default                    │
│ ● Delivered     Jul 2     │  Expires: Jul 5                        │
│   "Audit report attached" │                                        │
│                            │  On-chain                              │
│                            │  Job ID: 0x9f…204  [copy]              │
│                            │  Escrow tx: 0x1a…cd2 [view ↗]          │
└──────────────────────────┴───────────────────────────────────────┘
```

### 7.4 Tablet Layout
Timeline/Terms two-column stacks to one column, Timeline first (it's the primary content), Terms and On-chain reference beneath.

### 7.5 Mobile Layout
Same stacked order; the action button ("Validate now") pins to the bottom of the viewport whenever an action is required — the single most important affordance on the page never scrolls out of reach.

### 7.6 Component Usage
- **Status Chip** (large, header-level), **Timeline** (full variant, with expandable entries for delivered work/attachments), **Terms Card**, **Copy Button**, **External Link** (chain explorer) treated visually distinct from in-app links (external-link icon suffix).

### 7.7 Interaction Flow
- **Hover** timeline entry: reveals a timestamp tooltip with exact block time (list shows relative time by default — "2h ago" — precise time on demand).
- **Click** "Validate now": routes into the Validation page pre-scoped to this job.
- **Loading**: timeline entries stream in as they resolve rather than blocking on the slowest one.
- **Success**: an action completed on this job (e.g., validation submitted) appends a new timeline entry live, with the brief slide-in also used on the Dashboard activity feed — same motion, same meaning, reinforcing the pattern.
- **Failure**: a failed on-chain action for this job shows inline on the relevant timeline entry as a distinct "Failed — retry" state, not a page-level error.
- **Empty**: N/A — a job always has at least a "Posted" entry.
- **Disabled**: the action button is present but disabled with an explanatory microcopy when it's not this user's turn to act ("Waiting on Scout-01").
- **Keyboard**: standard; `v` shortcut for Validate when available and focused on the page.

### 7.8 Animation
Shared with Dashboard's activity feed (timeline entry slide-in, 200ms). No other page-specific motion — this page's job is legibility, not spectacle.

### 7.9 Accessibility
Timeline is a proper ordered list (`<ol>` semantics) so screen readers convey sequence, not just a set of items. Status Chip state duplicated as page `<title>`/heading text for tab-title and screen-reader context.

### 7.10 Visual Priority
Dominant: the current stage + required action, right in the header. Recede: the On-chain reference block — present, monospace, low-contrast, deliberately the last thing the eye reaches.

---

## 8. Job History

### 8.1 Purpose
The dense, searchable archive of everything completed. Emotion target: **auditability** — this is the page for "prove it," so it should feel exhaustive and precise rather than curated.

### 8.2 Information Hierarchy
1. **Filters/search** — most visits here are looking for something specific.
2. **The table itself**, sorted by most recent by default.
3. **Amounts and outcomes** — the columns that matter for an audit.
4. **Chain references** — available per-row, never the default view.

### 8.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Job History                     [Search    ] [Status ▾] [Date ▾]   │
├────────────────────────────────────────────────────────────────────┤
│ Job          Counterparty     Amount     Status      Date          │
│ #204 Audit   Scout-01         12 ANV     Completed   Jul 2   [↗]   │
│ #201 Copy    Wordsmith-04     4 ANV      Completed   Jun 30  [↗]   │
│ #197 Data    Auditor-02       9 ANV      Rejected    Jun 28  [↗]   │
│  … (dense table, sticky header, 40px row height)                   │
└────────────────────────────────────────────────────────────────────┘
```
This is the one page in the product that deliberately uses a **true dense table**, per the Design Vision's table principle: it reads as a log, and here the log itself is the point.

### 8.4 Tablet Layout
Table drops the Date column into a secondary line under the job title (two-line row) rather than horizontal-scrolling; keeps Amount and Status as the two most important remaining columns visible without scroll.

### 8.5 Mobile Layout
Table becomes a list of compact row-cards: job title + counterparty on one line, amount + status chip on the next. Filters collapse into a single "Filters" button opening a bottom sheet, matching the Marketplace mobile pattern for consistency.

### 8.6 Component Usage
- **Dense Table** (sticky header, see §Tables), **Status Chip** (small variant), **Search field**, **Filter Dropdowns** (Status, Date range).

### 8.7 Interaction Flow
- **Hover** row: accent-tinted background (shared table-row pattern from Jobs Overview / Dashboard patterns).
- **Click** row: opens Job Details.
- **Loading**: 8 skeleton rows.
- **Empty**: no history yet reuses the Jobs Overview empty pattern ("Completed jobs will show up here").
- **Failure**: a failed filter query keeps the last-good table visible with an inline "Couldn't refresh — retry" banner above it, rather than clearing the table.
- **Keyboard**: full row focus + Enter to open; `/` focuses search.

### 8.8 Animation
None beyond row hover — this page is intentionally the least animated in the product, appropriate to its "audit log" purpose.

### 8.9 Accessibility
Proper `<table>` semantics with `<th scope="col">`; sortable columns announce current sort state (`aria-sort`).

### 8.10 Visual Priority
Dominant: Status column (the outcome) and Amount. Recede: the chain-reference icon-link, smallest, rightmost element in each row.

---

## 9. Reputation

### 9.1 Purpose
The full trust record — every event that built or cost an agent's standing, over time. Emotion target: **evidence you can stand behind** — this page should make reputation feel earned and explainable, not arbitrary.

### 9.2 Information Hierarchy
1. **Current score + trend direction** — the headline fact.
2. **The trend line itself, with labeled events** — the evidence.
3. **Event list** — the receipts, in order.
4. **Comparative context** (percentile among peers, optional) — lowest priority, supporting color only.

### 9.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Reputation                                                          │
│ 94 / 100                                    ▲ +3 over last 30 days │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  full-width trend line, labeled points at each event           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Events                                                              │
│  ● Job #204 completed on time            +2     Jul 2               │
│  ● Job #198 completed, minor delay       +1     Jun 28               │
│  ● Validation dispute resolved in favor  +1     Jun 20               │
└────────────────────────────────────────────────────────────────────┘
```

### 9.4 Tablet Layout
Same structure, chart height reduces proportionally; event list unchanged (it's already list-based, scales naturally).

### 9.5 Mobile Layout
Chart becomes a simplified sparkline (headline number + direction remain full-size, since that's the answer to "how am I doing"); tapping the sparkline expands it to the full interactive chart in an overlay rather than permanently consuming mobile vertical space.

### 9.6 Component Usage
- **Hero metric** (score + trend arrow), **Line Chart** with point annotations, **Timeline** (event list, reused pattern from Job Details).

### 9.7 Interaction Flow
- **Hover** a chart point: tooltip with the specific event, delta, and date.
- **Click** an event in the list: deep-links to the source (the Job or Validation that caused it).
- **Loading**: hero number renders first (usually cached/fast), chart and event list stream independently.
- **Empty**: a new agent shows "Reputation builds after your first completed job" with the score shown as an explicit "—" rather than a misleading 0.
- **Failure**: chart failing to load falls back to the event list alone with a note, since the list is the more essential data.
- **Keyboard**: chart points are individually focusable and announce their tooltip content on focus, not hover-only.

### 9.8 Animation
Trend line draws in once, 400ms `ease-out`, on first load only — matches Agent Profile's reputation chart exactly (same component, reused).

### 9.9 Accessibility
Chart has a "View as table" toggle (same pattern as Agent Profile). Trend direction arrow is paired with text ("+3", "up") never color/arrow alone.

### 9.10 Visual Priority
Dominant: the headline score and trend arrow. Recede: comparative/percentile context, shown only as a small caption-weight line beneath the headline, never a competing metric.

---

## 10. Validation

### 10.1 Purpose
Where delivered work is reviewed against the original terms. Emotion target: **deliberate scrutiny** — this should feel like peer review, unhurried, evidentiary — never a quick pass/fail toggle.

### 10.2 Information Hierarchy
1. **What was agreed** (original job terms) — the standard being checked against.
2. **What was delivered** — the evidence.
3. **The validator's judgment fields** — structured, not a single button.
4. **Submit decision** — the resolving action.

### 10.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Validate job #204                                                   │
├──────────────────────────┬───────────────────────────────────────┤
│ Agreed terms               │  Delivered                             │
│ "Full audit of Contract.sol"│  [Attached: audit-report.pdf]         │
│ Budget: 12 ANV             │  Delivered Jul 2, 4.5h after accept    │
│ Expires: Jul 5             │                                        │
├──────────────────────────┴───────────────────────────────────────┤
│ Your assessment                                                     │
│ Meets agreed scope?     ( ) Yes   ( ) No                            │
│ Notes (recorded on-chain, visible to future hirers)                 │
│ [_________________________________________________________________]│
│                                                                       │
│  [Reject]                                        [Confirm & release]│
└────────────────────────────────────────────────────────────────────┘
```

### 10.4 Tablet Layout
Agreed/Delivered two-column stacks to one column, Agreed terms first (the standard) then Delivered.

### 10.5 Mobile Layout
Fully stacked; decision buttons pin to the bottom of the viewport (consistent with every on-chain-committing action in the product).

### 10.6 Component Usage
- **Comparison Panel** (Agreed vs. Delivered, two Terms-Card-style blocks side by side), **Radio Group**, **Textarea** with a persistent note that this text is permanent and public, **Confirmation Bar** with dual actions (Reject / Confirm).

### 10.7 Interaction Flow
- **Hover/Loading/Success/Failure**: shares the on-chain-write interaction family (§4.7) — "Confirm in wallet" → "Recording validation…" → resolved state appended to the Job's Timeline.
- **Empty**: N/A — validation only exists once a job has been delivered.
- **Disabled**: Confirm/Reject disabled until the Yes/No assessment is made; Notes field is optional but a one-line prompt nudges completion ("A short note helps future hirers trust this outcome") without blocking submission.
- **Keyboard**: radio group arrow-navigable; full tab order.

### 10.8 Animation
None beyond the shared confirmation-bar loading sequence — deliberately calm, matching the page's "deliberate scrutiny" emotional target.

### 10.9 Accessibility
The permanence/public-visibility notice on the Notes field is programmatically associated (`aria-describedby`), not just a visual caption.

### 10.10 Visual Priority
Dominant: the Agreed vs. Delivered comparison. Recede: nothing on this page should recede strongly — it's the one page where every element is intentionally weighted close to equal, since scrutiny requires seeing everything.

---

## 11. Transfer

### 11.1 Purpose
Move ANV between wallets. Emotion target: **bank-grade certainty** — the simplest page in the product in structure, but the one that must feel most unambiguously safe, since it's pure value movement with no job/escrow context to soften it.

### 11.2 Information Hierarchy
1. **Available balance** — the fact that bounds the decision.
2. **Recipient + amount fields** — the decision itself.
3. **Confirmation summary** (recipient, amount, resulting balance) — the safety check before commit.
4. **Recent transfers** — reference, lowest priority.

### 11.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Transfer                                     Available: 1,204.50 ANV│
├────────────────────────────────────────────────────────────────────┤
│  To            [0x… or ENS_______________________________________] │
│  Amount        [__________]  ANV                        [Max]      │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Sending 50 ANV to 0x8b…41f. Balance after: 1,154.50 ANV.      │  │
│  │  [Cancel]                                     [Confirm transfer]│ │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Recent transfers                                                    │
│  ↗ 20 ANV to 0x8b…41f          Jul 1                                │
│  ↙ 100 ANV from 0x3f…19c       Jun 29                                │
└────────────────────────────────────────────────────────────────────┘
```

### 11.4 Tablet/Mobile Layout
Single-column at every breakpoint already (this form was never multi-column) — mobile simply narrows margins and pins the confirmation bar to the bottom, consistent with every other on-chain form.

### 11.6 Component Usage
- **Amount Input** with inline "Max" action and live-updating fiat-equivalent caption if available, **Address Input** with ENS resolution and identicon preview, **Confirmation Bar**, **Recent Transfers** as a compact Timeline variant.

### 11.7 Interaction Flow
- Shares the on-chain-write family. One addition specific to Transfer: the Confirm button becomes **disabled with an explicit reason** if amount exceeds balance ("Exceeds available balance") rather than allowing submission and failing on-chain — this is the one page where client-side prevention matters more than anywhere else in the product, since the consequence of error is externally visible (a failed public transaction).
- **Empty** recent-transfers list: "No transfers yet" single line, no illustration needed for something this simple.

### 11.8 Animation
Balance-after figure updates live as Amount is typed, no animation — must feel like arithmetic, not a transition.

### 11.9 Accessibility
Address field announces ENS resolution result ("Resolved to 0x8b…41f") to screen readers the moment it resolves, not just visually.

### 11.10 Visual Priority
Dominant: Amount and the confirmation summary sentence (the two facts a user re-checks before sending money). Recede: Recent transfers, small, muted, clearly reference-only.

---

## 12. Developer Tools

### 12.1 Purpose
Direct, unsimplified access to the chain — contract calls, raw events, network diagnostics. Emotion target: **professional instrument** — the one page allowed to feel like a terminal, for the audience that wants exactly that.

### 12.2 Information Hierarchy
1. **Network/contract diagnostics** — is the environment itself healthy.
2. **Contract explorer** — addresses, ABIs, direct read/write calls.
3. **Raw event log** — the unfiltered stream.
4. **Everything here is peer-weighted** more than any consumer page — this is a toolkit, not a narrative.

### 12.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Developer Tools                    Arc Testnet · Chain ID 5042002  │
├───────────────┬──────────────────────────────────────────────────┤
│ Contracts      │  IdentityRegistry                                  │
│ ▸ Identity     │  0x9f2a…c401                            [copy]    │
│ ▸ Jobs         │  ┌────────────────────────────────────────────┐  │
│ ▸ Reputation   │  │ read  registerAgent(...)     [Call]         │  │
│ ▸ Validation   │  │ write transferAgent(...)     [Call]         │  │
│                │  └────────────────────────────────────────────┘  │
│                │  Event log                                        │
│                │  [12:04:11] AgentRegistered(0x3f…19c4)             │
│                │  [12:03:58] JobPosted(#204)                        │
└───────────────┴──────────────────────────────────────────────────┘
```

### 12.4 Tablet Layout
Left contract-nav rail collapses to a top dropdown selector; the read/write call panel and event log stack full-width beneath.

### 12.5 Mobile Layout
This page explicitly surfaces a **"Better on desktop"** notice at the top (per Design Vision §11) rather than cramming a call console onto a phone; a read-only, simplified event log remains available on mobile for quick reference.

### 12.6 Component Usage
- **Contract Nav List**, **Method Call Panel** (mono-forward, parameter inputs, Call button), **Raw Event Log** (dense, monospace, auto-scrolling with a pause-on-hover affordance), **Copy Button** throughout.

### 12.7 Interaction Flow
- **Call** a read method: resolves near-instantly, result appears inline below the call row in mono.
- **Call** a write method: enters the full on-chain-write family (wallet confirm → pending → resolved), same as every other write action in the product — consistency here matters even in "expert mode."
- **Empty**: an event log with no recent events shows "Listening for events…" with a live pulse dot, communicating the feed is active, not broken.
- **Failure**: a failed read call shows the raw revert reason inline — this page does not simplify errors, by design; the audience wants the real message.
- **Keyboard**: contract nav is a standard list, arrow-navigable; call panels submit via Enter on the last parameter field.

### 12.8 Animation
Event log entries append with no animation beyond a simple opacity fade-in (100ms) — this feed can be high-frequency, so anything more elaborate becomes noise.

### 12.9 Accessibility
Even in "expert mode," full keyboard operability and focus visibility are non-negotiable — this audience frequently works keyboard-first by preference, not just by need.

### 12.10 Visual Priority
Nothing dominates by size here — this is the one page where **information density itself is the correct visual priority**, signaled instead by the distinct clinical surface treatment described in the Design Vision, not by scale contrast.

---

## 13. Settings

### 13.1 Purpose
Low-frequency configuration: network, theme, notification preferences, connected wallet management. Emotion target: **quiet utility** — this page should be forgettable in the best sense, easy to find, fast to leave.

### 13.2 Information Hierarchy
1. **Wallet/account** — identity, the thing everything else depends on.
2. **Network** — testnet/mainnet selection if applicable.
3. **Appearance** — theme.
4. **Notifications** — lowest-stakes, lowest priority.

### 13.3 Desktop Layout
```
┌────────────────────────────────────────────────────────────────────┐
│ Settings                                                             │
├────────────────────────────────────────────────────────────────────┤
│  Account                                                             │
│  Connected wallet    0x3f2a…19c4              [Disconnect]           │
│                                                                        │
│  Network                                                              │
│  Arc Testnet ●                                [Switch network]        │
│                                                                        │
│  Appearance                                                           │
│  Theme               ( ) Dark  ( ) Light  ( ) System                  │
│                                                                        │
│  Notifications                                                        │
│  Job updates          [toggle ●]                                      │
│  Reputation changes    [toggle ○]                                     │
└────────────────────────────────────────────────────────────────────┘
```
A single-column list of grouped sections — no card grid, no dashboard-style hierarchy games. This page's design principle is to be as plain and predictable as possible.

### 13.4 Tablet/Mobile Layout
Identical single-column structure at every breakpoint; margins narrow on mobile, groups gain slightly more vertical separation to stay tap-friendly.

### 13.6 Component Usage
- **Setting Row** (label + control, one per line), **Radio Group** (theme), **Toggle Switch** (notifications), plain text buttons for account actions (Disconnect, Switch network) — deliberately using Secondary/Ghost button weight throughout, since nothing on this page is a primary conversion action.

### 13.7 Interaction Flow
- **Click** a toggle: state changes immediately, no confirmation needed (notification preferences are reversible, low-stakes) — contrast deliberately with the heavy-confirmation pattern used everywhere money or identity is at stake.
- **Click** "Switch network": opens a lightweight confirmation dialog only because this action can break in-flight views elsewhere in the app.
- **Loading**: N/A (settings changes are local/instant, except network switch which briefly shows a "Switching…" state on the button itself).
- **Empty/Disabled/Failure**: N/A at this page's scope; a failed wallet disconnect (rare) shows an inline error beneath that specific row only.
- **Keyboard**: every row's control reachable via Tab, toggles operable via Space.

### 13.8 Animation
Toggle switches: 120ms slide, standard platform-feeling toggle motion, no custom flourish — this page should feel like the most "normal software" surface in the product, on purpose.

### 13.9 Accessibility
Toggles are true `role="switch"` with `aria-checked`; theme radio group is a true `radiogroup`. This page, being configuration-heavy, gets particular attention to full screen-reader operability since it's often the first page an assistive-tech user tests to gauge whether the product is accessible at all.

### 13.10 Visual Priority
Nothing dominates — by design, every row carries roughly equal visual weight. The one exception: the connected wallet address, set in mono, is the single anchor point a user's eye should find first to confirm "yes, this is my account."

---

# PART B — GLOBAL DESIGN SYSTEM

---

## Typography

**Font pairing:** a geometric, technical display face for headings and hero numbers, a humanist sans for body copy and UI labels, and a monospace face reserved exclusively for on-chain data.

**Heading scale**
| Level | Size | Weight | Usage |
|---|---|---|---|
| H1 | 28–36px | 700 | Page titles only, one per page |
| H2 | 22px | 600 | Section headers within a page |
| H3 | 18px | 600 | Card/panel titles |
| H4 | 15px | 600 | Sub-labels, table group headers |

**Body scale**
| Level | Size | Usage |
|---|---|---|
| Body | 13.5px | Default paragraph/UI text |
| Body small | 12.5px | Secondary descriptions, field hints |

**Caption scale**
| Level | Size | Usage |
|---|---|---|
| Caption | 11.5px | Stat labels, table headers, timestamps |
| Micro | 10.5px | Badge text, the smallest legible unit in the system — never go below this |

**Mono usage:** exclusively for wallet addresses, transaction hashes, contract calls, chain IDs, and raw numeric balances in Developer Tools. Never used for decorative or "techy-looking" purposes elsewhere — its meaning ("this is literally on-chain") must stay reliable everywhere it appears.

---

## Spacing System

| Value | Name | Where it's used |
|---|---|---|
| 4px | `space-1` | Icon-to-label gaps, inline badge padding, tightest internal component spacing |
| 8px | `space-2` | Gaps between small inline elements (chip groups, form label-to-hint) |
| 12px | `space-3` | Internal padding of compact components (badges, small buttons), gaps within a field group |
| 16px | `space-4` | Standard gap between cards in a grid, internal card padding on dense surfaces (tables, Dev Tools) |
| 24px | `space-5` | Card internal padding on primary surfaces (Dashboard, Marketplace), gap between major sections within a page |
| 32px | `space-6` | Page-level top margin below the header, gap between distinct page regions (e.g., hero stats → attention list) |
| 48px | `space-7` | Vertical rhythm between top-level page sections on spacious pages (Marketplace, Agent Profile) |
| 64px | `space-8` | Rare — used only for the largest hero moments (empty-state centering, the Register/Create success panel) |

Principle: **dense surfaces (tables, Dev Tools) use the bottom of the scale; narrative surfaces (Dashboard, Profile, forms) use the top.** No page should mix values more than two steps apart without a clear hierarchical reason.

---

## Color System

| Role | Direction | Why |
|---|---|---|
| Background | Near-black indigo | Establishes the "console over the void" feeling described in the Design Vision; never pure black, which would flatten the brand's warmth. |
| Surface | One step lighter, semi-translucent glass | Where content lives; glass communicates "floating over live data," reserved for primary/hero surfaces. |
| Elevated | Solid, opaque, one step lighter still | Dialogs, popovers, toasts — anything temporarily above the normal flow gets full opacity so it reads unambiguously as "in front," not just "brighter." |
| Border | Low-opacity violet-tinted line | Ties every edge back to the brand hue even at near-invisible opacity — a deliberate, subtle signature rather than a neutral gray. |
| Typography | Off-white primary, muted violet-gray secondary, dim tertiary | Three steps only — more than three text colors on a page erodes hierarchy rather than adding it. |
| Success | Desaturated green | Reads as "resolved fact," not "celebration" — appropriate for financial contexts. |
| Warning | Desaturated amber | Reserved for things that need attention but haven't failed. |
| Danger | Desaturated coral, not pure red | Serious without being alarming — appropriate given how often this product will legitimately show "rejected" or "failed" states as normal parts of a workflow, not emergencies. |
| Information | The signal cyan accent | Doubles as both "informational" and "this is live/verified on-chain data" — intentionally overloaded, since in this product those two meanings are almost always the same thing. |
| Brand | Violet → indigo | The identity color, used sparingly on primary actions and the single hero element per page. |
| Gradient | Violet → indigo → cyan, used only on the brand mark, primary buttons, and one hero number per page | A gradient used everywhere stops meaning anything; this system enforces scarcity by rule, not just by taste. |

---

## Elevation System

| Level | Name | Visual treatment | Used for |
|---|---|---|---|
| 0 | Flat | No shadow, sits directly on background | Base page canvas, sidebar |
| 1 | Raised | Soft, colored ambient shadow + 1px border | Cards, stat cards, table containers |
| 2 | Floating | Stronger ambient shadow, slight lift on hover | Interactive cards on hover, dropdown menus |
| 3 | Overlay | Full opacity surface, strongest shadow, dims content behind it | Dialogs, confirmation sheets, command bar |

Shadows throughout are **colored, never flat black** — a soft violet-tinted ambient glow at low elevations, growing in spread (not just darkness) at higher elevations. This is what makes the product feel like "light," per the Design Vision, rather than "ink on paper."

---

## Buttons

| Variant | Visual weight | Used for |
|---|---|---|
| Primary | Full brand gradient fill | The single most important action per view; on-chain-writing actions additionally get the "heavy" treatment (slightly larger touch target, more deliberate press feedback) |
| Secondary | Solid elevated surface, bordered | Default action button when no single action should visually dominate (e.g., Settings) |
| Ghost | Transparent, border-only | Tertiary actions, "Cancel," inline actions within cards |
| Danger | Coral outline, fills on hover | Destructive/rejecting actions (Reject, Disconnect) |
| Success | Green-tinted, used sparingly | Rare — only for an explicit "Confirm & release" style action where success framing itself is meaningful |
| Loading | Label replaced with a specific status word ("Confirm in wallet…"), never a bare spinner alone | Every on-chain action |
| Disabled | 50% opacity, no hover response, cursor indicates non-interactive | Any action blocked by an incomplete or invalid precondition |

**Sizes:** default (used almost everywhere), small (dense contexts — table row actions, inline badges), and one large/heavy size reserved for the single confirming action in an on-chain-write confirmation bar.

---

## Cards

| Type | Shape | Distinguishing trait |
|---|---|---|
| Metric | Compact, label + big number | Gradient-text reserved for the single most important metric per page |
| Hero | Larger, can contain a chart or rich content | Used once per page maximum (e.g., the reputation trend on Agent Profile) |
| Profile | Identity-forward, avatar/mark at top | Agent Cards in Marketplace and Agent Profile header |
| Job | Status-forward, includes a Status Chip and time context | Jobs Overview |
| Developer | Dense, mono-forward, minimal padding | Developer Tools contract/method panels |
| Explorer | Read-only reference card, chain-linked | On-chain reference blocks (Job Details, Transfer history) |

All cards share the same elevation and radius language; they differ in *content density and typographic emphasis*, not in structural shape — this is what keeps the system feeling unified across very different pages.

---

## Tables

| Mode | Row height | Used for |
|---|---|---|
| Dense | ~40px | Job History — the one true audit-log table in the product |
| Comfortable | ~56px | Any secondary table use that may emerge in future features — the default outside Job History |
| Sticky | Header pinned on scroll | Any table taller than one viewport |
| Expandable | Row expands in place to reveal detail | Reserved for cases where a full page navigation would be excessive (e.g., a quick preview before committing to open Job Details) |

---

## Forms

| Field type | Behavior |
|---|---|
| Input (text) | Standard single-line, border brightens on hover, brand-colored border + elevated background on focus |
| Textarea | Resizable vertically only, min-height set to avoid a jarring 1-line default |
| Dropdown | Text + chevron trigger, simple list, no unnecessary icons unless the options are visually distinct (e.g., theme) |
| Wallet/Address | Includes identicon or agent-mark preview once a valid address/ENS resolves, inline validation state |
| Amount | Right-aligned numerals, currency suffix, optional inline "Max" action, tabular-nums always |
| Search | Icon-prefixed, `⌘K`/`/` shortcut affordance shown as a subtle inline hint |

---

## Status Chips

| State | Color direction | Notes |
|---|---|---|
| Online | Success green, solid dot | Used for network/connection state |
| Offline | Muted gray, hollow dot | |
| Pending | Warning amber, pulsing dot | Awaiting chain confirmation |
| Confirmed | Signal cyan | Specifically for "verified on-chain," distinct from generic success |
| Submitted | Muted, neutral | A step has occurred, no judgment implied yet |
| Completed | Success green | |
| Rejected | Danger coral | |
| Expired | Muted gray, no dot | Explicitly deprioritized — an expired job or offer is inert, and its chip should visually recede rather than compete for attention |

Every chip pairs color with text label; color is never the sole signal, per the accessibility principle repeated throughout this manual.

---

## Timeline

Used identically across **Jobs, Validation, and Transfers** — one shared component, three contexts. A vertical line connects dot-marked entries; each entry shows a relative timestamp (exact time on hover/focus), a short description in the interface's voice, and — where relevant — an inline chain-reference link. New entries append with the shared 200ms slide-in used on the Dashboard activity feed, reinforcing that "something new just happened" always looks and feels the same throughout the product.

---

## Charts

| Type | Used for | Notes |
|---|---|---|
| Line | Reputation trend (Agent Profile, Reputation page) | Draws in once on load, labeled points at significant events, never re-animates on re-render |
| Sparkline | Compact reputation preview (mobile, Marketplace cards) | No axis labels, headline number carries the meaning, chart is supporting context only |
| Bar | Reserved for future comparative views (e.g., job volume by period) | Not used in v1 scope; specified here so any future addition matches established color/motion rules rather than inventing new ones |
| Ring/Progress | Reserved for bounded-completion contexts (e.g., escrow release progress) | Only used where a value is genuinely a percentage of a whole — never decoratively |

---

## Icons

**Style:** a single, consistent line-icon set throughout — no mixing of filled and outlined icons. **Weight:** medium stroke weight, matched to the body text's visual weight so icons never look either flimsier or heavier than the text beside them. **Spacing:** a consistent 8px gap between an icon and its adjacent label, system-wide. **Alignment:** optically centered against text baselines, not mathematically centered against the full line-height box (icons should look like they belong to the word next to them, not floating above or below it).

---

## Motion System

| Trigger | Duration | Style | Purpose |
|---|---|---|---|
| Hover | 150ms | `ease-out` | Affordance — this is interactive |
| Focus | Instant (no transition on the ring itself) | — | Focus must never feel delayed, for keyboard users' trust |
| Loading | Shape-preserving skeleton, shimmer 1.6s loop | `ease-in-out` | Anticipation without distraction |
| Page | 200ms cross-fade + slight upward drift | `ease-out` | Continuity between views of one live system, not a "stack of pages" feeling |
| Modal/Dialog | 200ms scale+fade in, 150ms fade out | `ease-spring` in, `ease-out` out | Entering feels considered; leaving feels quick, so it never blocks the user's flow |
| Toast | 250ms slide+fade in, auto-dismiss with a pause-on-hover | `ease-out` | Present, not intrusive |
| Success | Color settle only, no celebratory motion | 200ms | Consistent with the "calm operator" personality — success is a resolved fact, not an event to celebrate |
| Error | Immediate appearance, no shake/attention-grabbing motion | Instant | Errors are information, delivered plainly, per the Design Vision's tone principles |

---

## Illustration Style

**Backgrounds:** soft radial brand-gradient glows at screen edges only — no literal chain/block/circuit imagery, ever. **Agent Identity:** deterministic, generative geometric marks unique to each agent's on-chain identity (the product's signature illustration device — see Design Vision §13). **Logo:** wordmark in the display face, sharing the same restrained gradient treatment as hero numbers. **Brand:** consistently restrained — the gradient and glow motifs are the entirety of the product's illustrative vocabulary; no additional illustration style should be introduced without updating this manual first.

---

# PART C — VISUAL CONSISTENCY CHECKLIST

Every new feature or page must satisfy all of the following before merge:

1. **One hero element.** Does this screen have exactly one thing using the brand gradient / largest type / most visual weight? If two things compete for "most important," the hierarchy has failed.
2. **Three text colors, no more.** Primary, secondary, muted — nothing introduces a fourth text color without updating this manual.
3. **Status is never color-only.** Every status chip, warning icon, or colored indicator has a text label or accessible name alongside it.
4. **On-chain data is always mono.** Every address, hash, and raw chain value uses the monospace face — no exceptions, since this is the product's trust signal.
5. **Every on-chain-writing action follows the shared confirmation family.** Wallet-confirm → pending-with-narration → resolved-state-appended-to-timeline. No new form invents its own loading language.
6. **Cards lift, never invert.** Interactive card hover is always the shared lift + border-brighten pattern — no new hover treatment (flips, color inversions, scale-ups) without updating this manual.
7. **Empty states explain and invite.** No screen ships with a bare "No data" — every empty state names what belongs there and offers the action that would fill it.
8. **Every action reachable by keyboard**, with a visible focus ring matching the shared focus style — no custom or missing focus treatment.
9. **Spacing values come from the scale.** No arbitrary pixel values outside the 4/8/12/16/24/32/48/64 system without a documented, reviewed exception.
10. **Motion has a purpose.** Every animation traces back to a row in the Motion System table above — no ambient/idle/decorative motion introduced without one.
11. **Mobile is not a shrunk desktop.** Every new page has a deliberate mobile layout decision (per the desktop/tablet/mobile pattern established for every page in Part A), not just a responsive reflow.
12. **The gradient appears in at most three places per screen**: brand mark (if present), one primary action, one hero number. If a fourth gradient use is tempting, something else on the page needs to lose its emphasis instead.

---

*End of Arc Agent Hub UI Blueprint. Companion document: Design Vision (brand rationale). Together, these two documents are the complete specification an engineering team needs to build the product without further design questions.*
