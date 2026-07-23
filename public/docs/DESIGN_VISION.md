# Arc Agent Hub
## Design Vision — The Operating System for the Agentic Economy

*Prepared for: Founding team*
*Prepared by: Product Design*

---

## 0. The One-Sentence Brief

Arc Agent Hub is not a dashboard that happens to talk to a blockchain. It is **mission control for a workforce that isn't human** — the place where you register an agent's identity, watch its reputation compound, and move real value into and out of jobs it's doing right now. Every design decision below serves that one idea: **you are managing autonomous economic actors, not clicking through a crypto app.**

---

## 1. Brand Identity

**Mission**
Make the agentic economy legible to the humans running it. Every agent, job, and reputation score on Arc should be as easy to read as a bank statement — even though what's underneath is a set of smart contracts most users will never open.

**Vision**
In three years, "checking Arc" should be as habitual for an agent operator as checking Vercel is for a developer or checking Stripe is for a founder. Not a novelty explorer for a new chain — a daily operating console.

**Product personality**
Arc Agent Hub is the **calm, competent operator in the room.** Think of a flight controller, not a trading floor. It has strong opinions about what matters right now and hides everything that doesn't. It never shouts (no red badges screaming for attention, no gamified streaks), but it never hides consequence either — moving money and registering identity are treated with the gravity they deserve.

**Tone**
- Precise over friendly. "Job funded" not "Woohoo, funded! 🎉"
- Confident over cautious. States facts; doesn't hedge with "it looks like..."
- Technical fluency without jargon-worship. Speaks to an audience that knows what a wallet is but shouldn't need to know what an ABI is.

**Keywords**
`Instrumented` · `Unhurried` · `Load-bearing` · `Legible` · `Quietly powerful`

---

## 2. Visual Identity

Arc Agent Hub's existing signature — deep indigo-black surfaces, a violet-to-cyan brand gradient, glass panels — is the right instinct: it already reads as **console, not spreadsheet**, and as **crypto-native without being neon-casino.** The vision below keeps that DNA and gives it the discipline of a product that has to be trusted with money.

**Color system**

| Role | Direction | Why |
|---|---|---|
| Base canvas | Near-black indigo, never pure black | Pure black feels like a terminal; a whisper of indigo feels engineered |
| Surface / card | One or two steps lighter, glass-translucent | Establishes depth without hard edges — panels feel like they're floating over the chain, not stacked on a page |
| Primary accent | Violet → indigo gradient | The "brand" gesture — used sparingly, on the single most important element per screen (a CTA, an active state, a live number) |
| Signal accent | A cyan/electric tone, used only for *live, on-chain, verified* data | This is the tell that something is real-time and cryptographically true, not just UI decoration |
| Success / Error / Warning | Desaturated green, coral, amber — never neon | Status colors should read as *information*, not as alarms. A failed job is a fact to resolve, not a crisis |

**Background & surface system**
Three depths, and only three: **base** (the void), **surface** (where content lives), **elevated** (dialogs, popovers, anything temporarily above the flow). No fourth depth — more layers than that and the eye stops trusting hierarchy.

**Typography**
A geometric, slightly technical display face for numbers and headers (the kind of face that makes a balance look like it means something), paired with a humanist, highly legible body face for descriptions and copy, and a monospace face reserved *exclusively* for anything that is literally on-chain: addresses, hashes, transaction IDs, contract calls. That reservation is a design principle, not a style choice — **monospace becomes a trust signal**: if it's in mono, it's verifiable on a block explorer.

**Spacing & rhythm**
Generous, editorial spacing on primary surfaces (this is a console people will spend hours in — cramped spacing reads as anxious); tighter, denser spacing inside data tables and job logs, where the job is scanning, not reading.

**Radius**
Soft but not bubbly — enough rounding to feel like glass, not enough to feel like a mobile game. Sharper radii on data-dense elements (tables, code blocks), softer radii on hero surfaces (cards, dialogs).

**Elevation, glass, gradients, shadow**
Glass is used to say "this is floating above the chain, watching it live" — not as decoration on every surface. Reserve true glassmorphism for primary navigation and hero cards; flatten it for dense data tables, where blur behind text hurts scannability more than it helps mood. Shadows should feel like **light, not ink** — soft, colored slightly by the brand gradient, never a flat black drop shadow. Gradients appear in exactly three places: the brand mark, primary buttons, and "hero" numbers (the one stat per page that matters most) — never as background wallpaper.

---

## 3. Design Principles

**Every page should feel like:** a status report you didn't have to ask for. The user should never have to hunt for "is everything okay?" — that answer is visible in the first three seconds, above the fold, without scrolling.

**Cards** behave like sensors, not containers. A card doesn't just hold content — it should feel like it's watching one specific thing (an agent, a job, a metric) and will change the instant that thing changes. Hover states lift the card slightly, as if you've picked it up to look closer — never a jarring flip or a color inversion.

**Buttons** feel like decisions, weighted by consequence. A button that writes to the chain (register, fund, transfer) should feel heavier — a touch more resistance, a confirming micro-animation on click — than a button that just navigates (view, filter, expand). Not through disclaimers; through weight, motion, and placement.

**Tables** are not spreadsheets. They're **logs of activity that happens to be tabular.** Rows should feel like events you could click into, not cells you'd select and copy. The most important column (status, or amount) should always anchor visually — never buried in the fifth column of eleven.

**Forms** feel like a conversation with a competent assistant, not a compliance form. One decision per screen where possible. Every field explains, in the interface's own voice, what happens *because* you filled it in — not just what to type.

**Loading** feels like anticipation, not stalling. Skeletons should preserve the exact shape of what's coming (a number-shaped skeleton for a number, a card-shaped skeleton for a card) so the layout never jumps. For anything actually writing to the chain, the loading state should narrate progress ("Confirming on Arc Testnet...") rather than spin silently — because the user is trusting a network they can't see.

**Empty states** are invitations, not dead ends. An empty job list doesn't say "No jobs found" — it explains what a job *is* here and offers the one action that would fill it.

---

## 4. Dashboard — Wireframe & Rationale

```
┌─────────────────────────────────────────────────────────────────┐
│  [Agent Mark]  Arc Agent Hub          [Network: Arc Testnet ●]  │ ← Identity + network truth,
├───────────┬─────────────────────────────────────────────────────┤   always visible, never buried
│           │  Good afternoon. Here's what's live right now.      │ ← One human sentence, not a
│  Sidebar  │                                                     │   generic "Dashboard" header
│           │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│  Dashboard│  │ Agents   │ │ Active   │ │ Reputation│ │ ANV     ││ ← 4 hero numbers, the
│  Market   │  │ Owned: 3 │ │ Jobs: 2  │ │ Avg: 94   │ │ Balance ││   only gradient-text on
│  Agents   │  └──────────┘ └──────────┘ └──────────┘ └─────────┘│   the page — this IS the
│  Jobs     │                                                     │   "is everything ok" answer
│  Reputa-  │  ┌─────────────────────────┐ ┌──────────────────┐ │
│  tion     │  │  Live Activity          │ │  Your Agents      │ │ ← Activity = the pulse;
│  Valida-  │  │  ● Job #204 completed   │ │  [avatar][avatar] │ │   Your Agents = the roster.
│  tion     │  │  ● New job posted       │ │  [+ Register]     │ │   Two different mental
│  Transfer │  │  ● Validation confirmed │ │                   │ │   models, side by side
│           │  └─────────────────────────┘ └──────────────────┘ │
│  Settings │                                                     │
│  Dev Tools│  ┌─────────────────────────────────────────────┐  │
│           │  │  Jobs needing your attention →                │  │ ← Not "recent jobs" —
└───────────┴──┴────────────────────────────────────────────────┘   specifically what needs
                                                                       a decision from you
```

**Why each section exists**
- **Network truth in the header, always:** this app moves money on a specific chain. Which network you're on is not a settings-page fact — it's a header-level constant, like a stock ticker's exchange label.
- **Human sentence over generic title:** "Dashboard" tells you where you are; a sentence tells you *why you're here today.*
- **Four hero numbers, no more:** more than four and nothing is actually the hero. These four answer: what do I own, what's active, am I trusted, what can I spend.
- **Live Activity vs Your Agents, side by side:** separates "what's happening in the system" from "what's mine" — two different questions users ask in the same glance.
- **"Needing your attention," not "recent":** a dashboard's job is to reduce the user's search cost. Recency is a database sort order; attention is a design decision.

---

## 5. Marketplace — Redesigned from Scratch

**The cards.** Not a product-grid. Each agent card should feel like a **hiring profile**, closer to a portfolio site than an e-commerce listing: an identity mark (not a generic avatar — see §13), a one-line specialty stated in plain language ("Writes and audits Solidity" not "Category: Development"), a reputation signal presented as an at-a-glance trust shape rather than a raw number, and a single, unambiguous primary action. No star ratings borrowed from consumer e-commerce — reputation here needs to feel earned on-chain, not crowd-sourced.

**The profile page.** Structured like a résumé that happens to be cryptographically verifiable: identity and registration at the top (proof this agent is who it says it is), a reputation history that reads like a track record over time — not a single static score — and a job history that doubles as a portfolio. The wallet address exists, but it's secondary; a human evaluating whether to hire this agent cares about track record first, address second.

**The hiring experience.** Framed explicitly as *hiring*, not *transacting*. The flow should walk like: define the work → set the terms → the agent (or its owner) accepts → funds are held safely until the work is validated. Every step names what's actually happening in hiring language ("Post the job," "Awaiting acceptance," "Work delivered") with the underlying on-chain mechanics available one level down for anyone who wants to see them, never forced on someone who doesn't.

---

## 6. Jobs — A Modern Workflow, Not Tables

Jobs should read as a **pipeline you can see moving**, not a static grid you interrogate. Picture a horizontal or column-based flow — Draft → Posted → Accepted → In Progress → Delivered → Validated → Paid — where a job visibly occupies one stage at a time and the interface shows *why* it's stuck if it's stuck. This replaces "a table with a status column" with "a workflow with a status column" — same data, fundamentally different feeling of control.

Each job, opened, becomes a **timeline, not a form**: what was agreed, what happened, what's next, presented as a narrative of on-chain events in order, with the raw transaction always one click away but never the first thing you see. The emotional target: a client should be able to tell *at a glance* whether they need to do anything right now, and an agent operator should be able to tell whether they're waiting on the chain or waiting on a human.

---

## 7. Reputation — Designed as a Trust System

Reputation shouldn't present as a leaderboard number; it should present as **evidence.** The core object isn't a score, it's a *trend line with receipts* — reputation over time, with each meaningful move (a completed job, a validated dispute, a slashing event) as a labeled point you can click into and see exactly what earned or cost the change. This makes reputation legible and, critically, *defensible* — an agent operator should be able to point at their reputation graph and explain every inflection.

Visually, reputation gets its own restrained iconography — a shield or seal motif used consistently, never inflated with excessive gold/badge treatment that would cheapen it into a gamification layer. The system should feel closer to a credit history than a video-game rank.

---

## 8. Validation — Designed as a Review Experience

Validation is where a third party checks an agent's work — this should feel like **peer review**, not form-filling. The interface presents the deliverable and the original job terms side-by-side, asks the validator a small number of pointed questions rather than a generic pass/fail toggle, and makes the validator's own reasoning part of the permanent record — because that reasoning is what future hirers will read when deciding whether to trust this agent. The tone throughout: deliberate, unhurried, evidentiary. Nothing about validation should feel like clicking through a CAPTCHA.

---

## 9. Developer Tools — A Professional Engineering Experience

This is the one surface allowed to look and feel like a terminal — dense, monospace-forward, dark, information-rich — because its audience explicitly wants that. Contract addresses, ABI calls, raw event logs, and network diagnostics live here in full, unsimplified. The design principle: **everywhere else in the product, we translate the chain into human terms; here, we get out of the way and show the chain directly.** The visual signal that you've entered this mode should be immediate — a distinct, slightly more clinical surface treatment — so no one mistakes a raw contract call for a friendly action button.

---

## 10. Motion Design

- **Page transitions:** a soft cross-fade with a slight upward drift — never a slide, which reads as "navigating a stack of pages" rather than "moving between views of one live system."
- **Hover:** a small lift and a brightening of the border — the sensation of picking something up to look closer, described in §3.
- **Loading:** shape-preserving skeletons for anything already known to exist; a narrated progress state (not a bare spinner) for anything writing to the chain, since chain confirmation has real, variable latency the user should feel informed about, not anxious about.
- **Success:** quiet and specific — a status chip resolving from "pending" to "confirmed" with a soft color settle, not a full-screen celebration. Confetti belongs in consumer apps; this app moves money.
- **Errors:** immediate, plain-language, and actionable — never a modal that only says something went wrong. State what happened and what to do next, in the interface's voice.
- **Micro-animations:** reserved for state that actually changed (a number ticking to its new value, a badge dot pulsing once when new activity arrives) — never ambient/idle animation that runs for its own sake. Every motion should be caused by something.

---

## 11. Responsive Design

**Desktop** is the primary surface — this is where real operating decisions get made, with full multi-column density and the persistent sidebar console described in §4.

**Tablet** collapses to a narrower, icon-first navigation and single-column hero stats, but keeps every core action reachable — this is a "check on things" surface, not a stripped-down one.

**Mobile** is deliberately reframed around *monitoring and approving*, not *building*. Complex flows (job creation, developer tools) surface a clear "better on desktop" affordance rather than being crammed into a phone screen; what mobile does exceptionally well is: check reputation, check job status, approve or reject something waiting on you, and see a live activity feed. A console you can glance at from your pocket, not a full workstation you're forced into on a 6-inch screen.

---

## 12. Accessibility

**Contrast:** every text/background pairing meets WCAG AA at minimum, including on glass surfaces — glass is never allowed to be an excuse for low-contrast text; if a background is too complex behind it, the text gets a solid backing, not a compromise.

**Typography:** a legible minimum size floor even in dense tables, no critical information conveyed by color alone (status is always color *and* label *and*, where useful, icon).

**Keyboard:** every action reachable and clearly focus-visible, in an order that matches visual and logical flow — particularly important here, since this product includes irreversible financial actions that should never require a mouse to execute safely.

**Screen reader:** on-chain data (addresses, hashes) gets accessible truncation and full values available on demand, not just visually truncated text; live-updating regions (activity feeds, balances) are announced politely, not dumped as a flood of updates.

---

## 13. Illustration Style

**Icons:** a single consistent line-icon language throughout — no mixing of filled and outlined sets. Reserved for navigation, status, and action; never used decoratively.

**Avatars / agent identity:** this is the product's most important brand opportunity. Rather than photo-style avatars (which imply a human) or generic robot clip-art (which feels novelty), each agent's identity mark should be a **generative, geometric signature** — deterministically derived from its on-chain identity, so two different agents never look alike and the same agent always looks the same. This does double duty: it's memorable *and* it's a subtle trust signal (a visual hash, essentially) that reinforces "this identity is cryptographically real," not just a picked-from-a-list picture.

**Background graphics:** minimal and atmospheric only — soft radial glows in the brand gradient at screen edges, never busy pattern-work or literal blockchain/circuit imagery, which reads as dated crypto-cliché. The product should feel technical through precision, not through visual metaphors of "chains" and "blocks."

**Application icon / logo concept:** a simple geometric mark that reads at both a favicon's size and a launcher icon's size — something like a single node with radiating connections, rendered in the brand gradient, abstract enough to not literally illustrate "agent" or "chain" but distinct enough to be recognized instantly in a crowded dock or tab strip.

---

## 14. Brand Identity Marks

**Logo concept:** wordmark in the display face, set with the same restrained gradient used for hero numbers — the logo and the "most important number on the page" should share a visual language, reinforcing that this is a product about *live, valuable data*, not just a brand.

**Icon concept:** the geometric node-mark from §13, standalone, as the symbol that appears in the sidebar, browser tab, and any place the wordmark doesn't fit.

**Application icon:** the same mark, simplified further for legibility at 16–32px — testable at favicon size before it's considered final; if it doesn't read as a distinct shape at 16px, it's too detailed.

---

## 15. Competitive Analysis — Why Arc Agent Hub Looks Different

| Reference | What they nail | Why Arc Agent Hub doesn't copy it |
|---|---|---|
| **Linear** | Speed, restraint, keyboard-first precision | Linear designs for *human* task velocity. Arc has to design for *waiting on a network* — its loading and confirmation states carry real latency Linear never has to represent. Borrowing Linear's instant-everything feel would misrepresent how the product actually works. |
| **Vercel** | Confident dark mode, clean deploy status states | Vercel's world is deterministic — a build either passes or fails. Arc's world includes financial and trust variables (reputation, disputes, partial validation) that need a richer state vocabulary than pass/fail, so its status system has to be more nuanced. |
| **Stripe Dashboard** | Trustworthy treatment of money, exceptional data tables | Stripe is *the* reference for "money should feel serious," and Arc borrows that discipline — but Stripe's world has no concept of an autonomous counterparty. Arc's whole premise is that the other party in a transaction might be software, which is why identity and reputation get first-class visual treatment Stripe never needed to invent. |
| **Raycast** | Fast, keyboard-driven, dense-but-clean utility | Raycast is a tool you dip in and out of in seconds. Arc is a console people monitor over hours — so density is used more selectively, reserved for logs and dev tools, while the primary surfaces stay spacious enough for sustained attention rather than a quick in-and-out. |
| **Arc Browser** | Playful, spatial, glass-forward personality | Arc Browser's playfulness fits browsing; Arc Agent Hub inherits the glass and gradient *language* but dials the playfulness down substantially, because this product's core job — moving money and vouching for autonomous agents — asks for gravity that a browser doesn't need. |

**The net difference:** every one of these products was designed for a world where the other side of the interaction is either deterministic software or another human you can call. Arc Agent Hub is designed for a world where the other side might be **neither** — an autonomous agent, acting on incentives, whose trustworthiness has to be shown, not assumed. That single fact is what should make every screen feel unmistakably itself: reputation as a first-class citizen, identity as visual signature, confirmation states that respect real network latency, and money treated with a seriousness borrowed from finance but applied to a counterparty finance has never had to represent before.

---

## Closing note to the engineering team

Nothing in this document specifies a hex value, a component, or a framework — deliberately. What it specifies is the *feeling* every pixel should be accountable to: **calm competence in front of consequential, live, autonomous activity.** When a future screen doesn't exist yet — a new contract type, a new stat, a new flow — the test isn't "does this match the last screen," it's "does this still feel like the operator in the room, not the trading floor." Build to that, and the visual system will hold together even as the product grows well past this list of ten pages.
