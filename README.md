<div align="center">

<img src=".github/assets/logo.png" alt="Arc Agent Hub v8" width="88" />

<img src=".github/assets/banner.png" alt="Arc Agent Hub v8" width="100%" />

# 🚀 Arc Agent Hub v8.0

### A Premium AI Agent Operations Dashboard Powered by Circle AppKit, ERC-8004, ERC-8183 & Arc Testnet

**Version 8.0.0 – Sprint 4 Complete**

Arc Agent Hub is a production-ready, open-source developer platform demonstrating how to build modern AI-powered Web3 applications on **Arc Testnet** using **Circle AppKit**, **ERC-8004 AI Identity**, **ERC-8183 Agentic Commerce**, **Circle CCTP Bridge**, **Universal Wallet**, **Universal Payments**, and **Universal Token Swap**.

<p align="center">

[![Build](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/build.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/build.yml)
[![Lint](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/lint.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/lint.yml)
[![Tests](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/test.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v8/actions/workflows/test.yml)
[![Version](https://img.shields.io/badge/version-8.0.0-7c3aed?style=flat-square)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Circle](https://img.shields.io/badge/Circle-AppKit-1B6FFF)](https://developers.circle.com/)
[![ethers.js](https://img.shields.io/badge/ethers.js-v6-2535A0)](https://docs.ethers.org)
[![Arc](https://img.shields.io/badge/Network-Arc%20Testnet-7c3aed)](https://arc.net)

</p>

**📖 [Architecture](./ARCHITECTURE.md) • 📝 [Changelog](./CHANGELOG.md) • 🛣 [Roadmap](./ROADMAP.md) • 🤝 [Contributing](./CONTRIBUTING.md) • 📚 [Documentation](./docs/OVERVIEW.md)**

</div>

---

# 🌟 Overview

ARC_AGENT_HUB is an open-source AI Workforce Platform built on **Arc
Network**.

The platform demonstrates how developers can build modern autonomous AI
applications using Arc Network together with the Circle Developer
Platform.

Rather than showcasing a single feature, ARC_AGENT_HUB combines
identity, wallets, stablecoin payments, agent commerce, validation,
reputation, developer tooling, and cross-chain infrastructure into a
unified developer experience.

Core capabilities include:

-   🤖 AI Agent Management
-   👛 Universal Wallet
-   💳 Stablecoin Payments
-   🔄 Universal Token Swap
-   🌉 Cross-chain USDC Transfers
-   🛡 Reputation & Validation
-   📈 Mission Control Dashboard
-   🛠 Developer Tools

------------------------------------------------------------------------

# 💡 Why ARC_AGENT_HUB?

Building decentralized AI applications typically requires integrating
multiple blockchain services, wallets, payment systems, identity
protocols, and developer tools.

ARC_AGENT_HUB brings these components together into a single modular
platform.

It is intended for:

-   Arc builders
-   Circle developers
-   Web3 developers
-   AI application developers
-   Hackathon participants
-   Open-source contributors

------------------------------------------------------------------------

# 🎯 Project Vision

ARC_AGENT_HUB demonstrates what a modern AI-native Web3 application
should look like when built on Arc Network.

Goals:

-   Promote stablecoin-native development
-   Demonstrate Circle Developer Platform integrations
-   Showcase AI agent infrastructure
-   Encourage open-source collaboration
-   Accelerate developer adoption of Arc Network

------------------------------------------------------------------------

# 🚀 Development Journey

ARC_AGENT_HUB has evolved through multiple production-focused
development sprints.

  Sprint     Status   Highlights
  ---------- -------- -----------------------------------
  Sprint 0   ✅       Foundation, routing, architecture
  Sprint 1   ✅       Universal Wallet
  Sprint 2   ✅       Stablecoin Payments
  Sprint 3   ✅       Circle CCTP Bridge
  Sprint 4   ✅       Universal Token Swap

------------------------------------------------------------------------

# ✨ Platform Features

## 🤖 AI Agent Platform

-   ERC-8004 Identity Registry
-   Reputation Registry
-   Validation Registry
-   AI Agent Marketplace
-   Agent Profiles

## 💼 Agent Commerce

-   ERC-8183 Job Lifecycle
-   Job Creation
-   Funding Workflow
-   Job Analytics

## 👛 Wallet Center

-   Wallet Connection
-   Portfolio Dashboard
-   Asset Balances
-   Transaction History

## 💳 Stablecoin Payments

-   Native USDC Transfers
-   Payment History
-   Wallet Integration

## 🌉 Circle CCTP

-   Cross-chain USDC
-   Iris Attestation
-   Burn / Mint Workflow

## 🔄 Universal Token Swap

-   Circle AppKit
-   Quote Engine
-   Swap History

## 🛡 Trust Center

-   Reputation
-   Validation
-   Security Insights

## 📊 Mission Control

-   Dashboard
-   Portfolio
-   Analytics
-   System Health

## 🛠 Developer Tools

-   Smart Contract Registry
-   RPC Configuration
-   Explorer Links

------------------------------------------------------------------------

# ⭐ Platform Highlights

-   Built on Arc Network
-   Circle Developer Platform
-   Native USDC
-   Universal Wallet
-   Stablecoin Payments
-   Universal Token Swap
-   Circle CCTP
-   ERC-8004
-   ERC-8183
-   AI Marketplace
-   Production-ready React Architecture
-   Open Source

------------------------------------------------------------------------

# 📊 Project Statistics

  Metric                                  Value
  --------------------- -----------------------
  Version                                   8.1
  Development Sprints                         5
  Major Features                            12+
  React Components                         150+
  Feature Modules                           10+
  Circle Integrations                         4
  Network                 Arc Network (Testnet)

------------------------------------------------------------------------

**End of README Part 1**

➡️ Continue with **README_Part2.md** for System Architecture, Project
Structure, Technology Stack, Circle Developer Platform Integration,
Smart Contracts, and Network Configuration.
# 🏗 System Architecture

ARC_AGENT_HUB follows a modular, feature-first architecture designed for
scalable AI-powered Web3 applications built on **Arc Network**.

``` text
                               Users
                                 │
                   MetaMask / Rabby Wallet
                                 │
                                 ▼
──────────────────────────────────────────────────────────────
                    ARC_AGENT_HUB Frontend
──────────────────────────────────────────────────────────────
React 18 • Vite • React Router • Context API • Viem

──────────────────────────────────────────────────────────────
                  Core Platform Modules
──────────────────────────────────────────────────────────────
• Mission Control Dashboard
• AI Agent Platform
• Wallet Center
• Stablecoin Payments
• Universal Token Swap
• Circle CCTP Bridge
• Reputation Center
• Validation Center
• Agent Marketplace
• Developer Tools

──────────────────────────────────────────────────────────────
               Blockchain Service Layer
──────────────────────────────────────────────────────────────
Wallet Services
Payment Services
Swap Services
Bridge Services
Smart Contract Services
RPC Services

──────────────────────────────────────────────────────────────
         Circle Developer Platform Integration
──────────────────────────────────────────────────────────────
Circle AppKit
Universal Wallet
Stablecoin Payments
Universal Token Swap
Circle CCTP V2
Iris Attestation

──────────────────────────────────────────────────────────────
                     Arc Network
──────────────────────────────────────────────────────────────
ERC-8004 Identity
ERC-8183 Agentic Commerce
Native USDC
Smart Contracts
Arc RPC
Arc Explorer
```

## Architecture Principles

-   Modular feature-based design
-   Reusable components
-   Separation of concerns
-   Blockchain abstraction
-   Scalable React architecture
-   Secure wallet integration
-   Responsive UI
-   Production-ready project structure

------------------------------------------------------------------------

# 📂 Project Structure

``` text
ARC_AGENT_HUB/

├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── assets/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── screenshots/
│   └── guides/
│
├── public/
├── server/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── app.js
│
├── src/
│   ├── app/
│   ├── assets/
│   ├── chains/
│   ├── contracts/
│   ├── features/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── ui/
│   └── utils/
│
├── package.json
├── vite.config.js
└── README.md
```

## Folder Overview

  Folder      Purpose
  ----------- -------------------------------
  app         Bootstrap, routing, providers
  assets      Images, fonts, icons
  chains      Arc Network configuration
  contracts   Smart contract ABIs
  docs        Documentation
  features    Business modules
  hooks       Custom React hooks
  services    Blockchain integrations
  ui          Shared UI components
  utils       Helper utilities
  server      Backend services

------------------------------------------------------------------------

# ⚙ Technology Stack

  Layer            Technology
  ---------------- ---------------------
  Frontend         React 18
  Build Tool       Vite 8
  Language         JavaScript (ES2023)
  Routing          React Router
  State            React Context API
  Web3             Viem
  Blockchain       ethers.js v6
  Wallets          MetaMask, Rabby
  Backend          Express.js
  Testing          Vitest
  Linting          ESLint
  Deployment       Vercel
  Source Control   Git + GitHub

## Blockchain Standards

-   ERC-8004 AI Identity
-   ERC-8183 Agentic Commerce
-   ERC-20
-   Native USDC
-   Circle CCTP V2

------------------------------------------------------------------------

# ⭕

# Circle Developer Platform Integration

ARC_AGENT_HUB demonstrates practical integration of Circle Developer
Platform products.

  Product                Purpose
  ---------------------- ---------------------------------------------
  Circle AppKit          Wallet connectivity & stablecoin operations
  Universal Wallet       Wallet management
  Stablecoin Payments    Native USDC transfers
  Universal Token Swap   Token swapping
  Circle CCTP V2         Cross-chain USDC
  Iris Attestation       Message verification

## Integration Flow

``` text
ARC_AGENT_HUB
      │
      ▼
Circle AppKit
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼
Wallet Payments   Token Swap
      │
      ▼
Circle CCTP V2
      │
      ▼
Iris Attestation
      │
      ▼
Arc Network
```

## Stablecoin Workflow

``` text
Native USDC
     │
     ▼
Transfer / Swap / Bridge
     │
     ▼
Circle Services
     │
     ▼
Arc Network
```

------------------------------------------------------------------------

# 📜 Smart Contracts

  Contract              Standard
  --------------------- ------------
  Identity Registry     ERC-8004
  Reputation Registry   ERC-8004
  Validation Registry   ERC-8004
  Agent Commerce        ERC-8183
  ANV Token             ERC-20
  Native USDC           Stablecoin

------------------------------------------------------------------------

# 🌐 Arc Network Configuration

  Property          Value
  ----------------- ---------------------------------
  Network           Arc Network (Testnet)
  Chain ID          5042002
  Native Currency   USDC
  RPC               https://rpc.testnet.arc.network
  Explorer          https://testnet.arcscan.app

------------------------------------------------------------------------

**End of README Part 2**

➡ Continue with **README_Part3.md** for installation, screenshots,
roadmap, contribution guide, security, documentation, license, and
footer.
# 🚀 Getting Started

## Prerequisites

-   Node.js 20+
-   npm
-   MetaMask or Rabby Wallet
-   Access to Arc Network (Testnet)

------------------------------------------------------------------------

## Clone the Repository

``` bash
git clone https://github.com/Jaehaerysp/arc-agent-hub-v8.git
cd arc-agent-hub-v8
```

------------------------------------------------------------------------

## Install Dependencies

``` bash
npm install
```

------------------------------------------------------------------------

## Start Development Server

``` bash
npm run dev
```

Open:

    http://localhost:5173

------------------------------------------------------------------------

## Production Build

``` bash
npm run build
```

------------------------------------------------------------------------

## Preview Production Build

``` bash
npm run preview
```

------------------------------------------------------------------------

# 🔐 Environment Variables

Create a `.env` file:

``` env
VITE_CIRCLE_KIT_KEY=YOUR_CIRCLE_APPKIT_KEY
VITE_ARC_RPC=https://rpc.testnet.arc.network
```

> For production deployments, proxy requests that require sensitive
> credentials through a backend service.

------------------------------------------------------------------------

# 📜 Available Scripts

  Command              Description
  -------------------- --------------------------
  npm run dev          Start development server
  npm run build        Production build
  npm run preview      Preview production build
  npm run lint         Lint source code
  npm test             Execute tests
  npm run test:watch   Watch mode

------------------------------------------------------------------------

# 📸 Application Preview

> Keep all of your existing screenshots in this section.

  ---------------------------------------------------------------------------
  Landing                             Dashboard
  ----------------------------------- ---------------------------------------
  ![](docs/screenshots/landing.png)   ![](docs/screenshots/dashboard.png)

  ---------------------------------------------------------------------------

  ------------------------------------------------------------------------------
  Wallet                             Marketplace
  ---------------------------------- -------------------------------------------
  ![](docs/screenshots/wallet.png)   ![](docs/screenshots/marketplace.png)

  ------------------------------------------------------------------------------

  Trust Center                      Jobs
  --------------------------------- --------------------------------
  ![](docs/screenshots/trust.png)   ![](docs/screenshots/jobs.png)

  --------------------------------------------------------------------------
  Payments                                Bridge
  --------------------------------------- ----------------------------------
  ![](docs/screenshots/payments.png)      ![](docs/screenshots/bridge.png)

  --------------------------------------------------------------------------

  ------------------------------------------------------------------------------
  Universal Swap                     Developer Tools
  ---------------------------------- -------------------------------------------
  ![](docs/screenshots/swap.png)     ![](docs/screenshots/developer-tools.png)

  ------------------------------------------------------------------------------

------------------------------------------------------------------------

# 🛣 Roadmap

  Sprint     Status   Focus
  ---------- -------- ----------------------------
  Sprint 0   ✅       Foundation
  Sprint 1   ✅       Universal Wallet
  Sprint 2   ✅       Stablecoin Payments
  Sprint 3   ✅       Circle CCTP
  Sprint 4   ✅       Universal Token Swap
  Sprint 5   🔄       AI Agent Automation
  Sprint 6   🔄       Circle Gateway Integration
  Sprint 7   🔄       Production Deployment
  Sprint 8   🔄       Analytics & AI Copilot

------------------------------------------------------------------------

# ⚠ Known Limitations

Current limitations primarily reflect the available Arc Network testnet
interfaces.

-   Some ERC-8004 registry read methods are unavailable.
-   Reputation data may rely on local aggregation where on-chain getters
    are unavailable.
-   Universal Token Swap currently demonstrates AppKit integration on
    Arc Network (Testnet).
-   Additional routing and production proxy support are planned.

------------------------------------------------------------------------

# 🤝 Contributing

Contributions are welcome.

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Push your branch.
5.  Open a Pull Request.

Please read:

-   CONTRIBUTING.md
-   CODE_OF_CONDUCT.md
-   SECURITY.md

before contributing.

------------------------------------------------------------------------

# 🧪 Quality Standards

Every release should pass:

-   ✅ ESLint
-   ✅ Production Build
-   ✅ Unit Tests
-   ✅ Responsive Layout Verification
-   ✅ Accessibility Checks
-   ✅ Arc Network validation

------------------------------------------------------------------------

# 🔒 Security

Please do not report security vulnerabilities through GitHub Issues.

See **SECURITY.md** for responsible disclosure instructions.

------------------------------------------------------------------------

# 📚 Documentation

Additional documentation:

- 📖 Architecture
- 📝 Changelog
- 🛣 Roadmap
- 📚 Developer Documentation
- 🔐 Security Policy
- 🤝 Contribution Guide

---

# 🙏 Acknowledgements

Special thanks to:

- Arc Network
- Circle
- React
- Vite
- ethers.js
- viem
- MetaMask
- Rabby Wallet
- GitHub
- Vercel

for building the tools that make modern Web3 development possible.

---

# 📄 License

Licensed under the **MIT License**.

See `LICENSE` for details.

------------------------------------------------------------------------

# ⭐ Support the Project

If ARC_AGENT_HUB helps you build on Arc Network or explore Circle
Developer Platform features, please consider starring the repository.

------------------------------------------------------------------------

# 📢 Brand Notice

ARC_AGENT_HUB is an independent open-source project built on **Arc
Network**.

Arc is a trademark of Circle.

This project is not affiliated with, endorsed by, or sponsored by Circle
unless explicitly stated.

------------------------------------------------------------------------

::: {align="center"}
## 🚀 ARC_AGENT_HUB

**AI Workforce Platform built on Arc Network**

Built with:

React • Vite • Express • Circle Developer Platform • Native USDC • Viem
• ethers.js

Made with ❤️ by the open-source community.
:::
