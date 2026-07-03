# Arc Agent Hub
## AI Development Guide
Version: v6.0.0
Status: Master Development Guide

---

# Project Identity

Arc Agent Hub is the Operating System for the Agentic Economy.

This application is NOT a crypto dashboard.

It is NOT a blockchain explorer.

It is a professional operating console for managing AI agents, reputation, validation, escrow, and blockchain jobs.

Every UI decision should reinforce this identity.

---

# Technology Stack

React 18

Vite

JavaScript

ethers v6

React Router

Arc Testnet

ERC-8004

ERC-8183

---

# Current Status

Production Stable

The following modules are working.

✓ Dashboard

✓ Marketplace

✓ Agent Profile

✓ Register Agent

✓ ERC-8004 Identity

✓ ERC-8183 Jobs

✓ Reputation

✓ Validation

✓ Transfer

✓ Settings

✓ Developer Tools

DO NOT BREAK EXISTING FUNCTIONALITY.

---

# Architecture Rules

Business Logic

Blockchain Logic

Wallet Logic

Hooks

Contract Wrappers

Routing

must remain stable.

UI improvements are preferred over architectural refactoring.

---

# Files That Require Extra Caution

Never modify unless explicitly requested.

src/lib/blockchain/

src/contracts/

src/hooks/useWallet*

src/hooks/useContractWrite*

src/app/providers/

WalletProvider

ThemeProvider

App.jsx routing

---

# Current Blockchain Status

ERC-8183 integration is production stable.

Known working:

createJob()

setBudget()

approveUsdc()

fundJob()

submitDeliverable()

completeJob()

getJob()

listJobsForAccount()

queryFilterChunked()

getLogsIncremental()

useJobs()

useJob()

DO NOT rewrite these.

---

# Design Philosophy

Arc Agent Hub should feel like

"The Operating System for the Agentic Economy."

Inspired by

Linear

Arc Browser

Stripe

Raycast

Vercel

WITHOUT copying them.

---

# Design Principles

Calm

Premium

Professional

Financial

AI Native

Blockchain Native

Minimal

Elegant

Never cluttered.

---

# Color Philosophy

Dark-first.

Glass surfaces only where appropriate.

Gradients used sparingly.

Status colors communicate information, not emotion.

---

# Typography

Modern

Readable

Editorial spacing

Monospace ONLY for blockchain values.

---

# Motion

Subtle.

Purposeful.

Never decorative.

Animations should communicate state changes.

---

# Agent Identity

Agents are NOT represented by robot clipart.

Each agent should eventually have a deterministic geometric identity generated from wallet address.

---

# Jobs

Jobs should evolve toward a workflow timeline.

Not spreadsheet tables.

---

# Reputation

Treat as a trust system.

Not a leaderboard.

Evidence first.

Score second.

---

# Validation

Treat as peer review.

Not form submission.

---

# Developer Tools

This is the only module allowed to feel like a terminal.

Everywhere else translates blockchain into human language.

Developer Tools expose blockchain directly.

---

# Coding Standards

Never duplicate code.

Prefer reusable components.

Prefer composition over duplication.

Document new components.

Avoid magic numbers.

Keep functions small.

Keep components focused.

---

# Build Requirements

Every milestone must pass.

npm install

npm run build

npm run lint

If tests exist

npm test

before completion.

---

# Required Output

Every task should return

Architecture summary

Files modified

Files added

Build result

Lint result

Test result

Future recommendations

---

# Development Roadmap

Milestone 1

Design Foundation

Typography

Spacing

Buttons

Cards

Inputs

Badges

Theme

Tokens

NO feature changes.

---

Milestone 2

Navigation

Sidebar

Header

Search

Command Palette

Layouts

NO feature changes.

---

Milestone 3

Mission Control Dashboard

Hero

Analytics

Metrics

Activity

Quick Actions

NO blockchain changes.

---

Milestone 4

Marketplace

Premium Agent Cards

Profiles

Hiring UX

NO backend changes.

---

Milestone 5

Jobs

Timeline

Workflow

Validation

Reputation

Explorer

NO smart contract changes.

---

Milestone 6

Premium Polish

Animations

Accessibility

Responsive

Performance

Final QA

---

# Golden Rule

Never redesign business logic.

Never redesign blockchain architecture.

Never rewrite working contract code.

Only improve the experience around it.

The engineering foundation is considered production stable.

The focus of v6 is creating a world-class product experience.