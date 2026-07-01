<div align="center">

<img src=".github/assets/banner.png" alt="Arc Agent Hub — ERC-8004 Dashboard for Arc Testnet" width="100%" />

# 🚀 Arc Agent Hub

### A Production-Ready Open-Source Dashboard for ERC-8004 AI Agents on Arc Testnet

Build, manage, validate, and monitor AI Agent identities with a modern Web3 dashboard built using **React**, **Vite**, **ethers.js**, and **Arc Testnet**.

<p align="center">

[![Build](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/build.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/build.yml)

[![Lint](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/lint.yml/badge.svg)](https://github.com/Jaehaerysp/arc-agent-hub-v3/actions/workflows/lint.yml)

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[![Arc Testnet](https://img.shields.io/badge/Built%20for-Arc%20Testnet-7c3aed?style=flat-square)](https://docs.arc.network)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)

[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

[![ethers.js](https://img.shields.io/badge/ethers.js-v6-2535A0)](https://docs.ethers.org)

[![Live Demo](https://img.shields.io/badge/Live-Demo-22c55e?logo=vercel)](https://YOUR-VERCEL-URL.vercel.app)

</p>

### 🌐 Links

**🚀 Live Demo** • **📖 Documentation** • **💻 GitHub** • **🐛 Report Bug** • **💡 Request Feature**

- **Live Demo:** https://YOUR-VERCEL-URL.vercel.app
- **GitHub:** https://github.com/Jaehaerysp/arc-agent-hub-v3
- **Architecture:** ./ARCHITECTURE.md
- **Changelog:** ./CHANGELOG.md

---

</div>

# ✨ Why Arc Agent Hub?

Arc Agent Hub is a **production-ready reference implementation** demonstrating how developers can build modern Web3 applications on **Arc Testnet** using the **ERC-8004 AI Identity Protocol**.

Instead of being just another demo project, Arc Agent Hub provides a complete developer experience featuring:

- Modern React architecture
- Feature-based folder structure
- Glassmorphism UI
- Centralized smart contract registry
- Responsive dashboard
- Developer tools
- Documentation
- GitHub Actions
- Open-source best practices

Whether you're building AI Agents, experimenting with ERC-8004, or learning Arc development, this project serves as a complete starting point.

---

# 🎯 Features

| Feature | Description |
|----------|-------------|
| 🤖 AI Agent Identity | Register ERC-8004 AI Agents on-chain |
| ⭐ Reputation | Submit and manage reputation feedback |
| 🛡 Validation | Request validator reviews and monitor status |
| 💸 ANV Wallet | Send ANV tokens with live balances |
| 📊 Dashboard | Wallet overview, analytics and activity |
| 🛠 Developer Tools | Chain information, contracts, RPC and explorer |
| ⚙ Settings | Theme, network info and application settings |
| 🎨 Design System | Reusable components with glassmorphism styling |
| 📱 Responsive | Desktop, Tablet and Mobile support |

---

# 🏗 Architecture

```mermaid
flowchart LR
    User(("Wallet"))
        --> App

    App --> Landing["Landing Page"]

    App --> Dashboard

    Dashboard --> Identity

    Dashboard --> Reputation

    Dashboard --> Validation

    Dashboard --> Transfer

    Dashboard --> Settings

    Dashboard --> DeveloperTools

    Dashboard --> Wallet

    Wallet --> ArcRPC

    ArcRPC --> Contracts
```

For complete architecture details, see:

**📖 ARCHITECTURE.md**

---

# 📸 Screenshots

| Landing Page | Dashboard | Developer Tools |
|---------------|-----------|-----------------|
| ![](.github/assets/screenshot-landing.png) | ![](.github/assets/screenshot-dashboard.png) | ![](.github/assets/screenshot-devtools.png) |

---

# 🎬 Demo

> Replace with an actual screen recording.

![](.github/assets/demo.gif)

---

# ⚙ Technology Stack

- React 18
- Vite
- React Router
- ethers.js v6
- Arc Testnet
- ERC-8004
- JavaScript
- CSS
- GitHub Actions
- Vercel

---

# 🚀 Installation

Requirements

- Node.js 18+
- npm
- MetaMask or Rabby Wallet

Clone

```bash
git clone https://github.com/Jaehaerysp/arc-agent-hub-v3.git
cd arc-agent-hub-v3
```

Install

```bash
npm install
```

Run

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Preview

```bash
npm run preview
```

Lint

```bash
npm run lint
```

---

# ⚙ Configuration

| Item | Location |
|------|----------|
| Chain Configuration | src/chains/arc.js |
| Contract Registry | src/contracts/registry.js |
| Design Tokens | src/styles/tokens.css |
| Navigation | src/app/nav.js |

No environment variables are required.

---

# 📜 Smart Contracts

| Contract | Address |
|----------|---------|
| Identity Registry | `0x8004A818BFB912233c491871b3d84c89A494BD9e` |
| Reputation Registry | `0x8004B663056A597Dffe9eCcC1965A193B7388713` |
| Validation Registry | `0x8004Cb1BF31DAf7788923b405b754f57acEB4272` |
| ANV Token | `0x736223037D622ed365fa641a116daAcED7A5be96` |

---

# 🌐 Arc Testnet

| Property | Value |
|----------|-------|
| Network | Arc Testnet |
| Chain ID | 5042002 |
| RPC | https://rpc.testnet.arc.network |
| Explorer | https://testnet.arcscan.app |
| Native Currency | USDC |

---

# 🚀 Deployment

Deploy easily using:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Build

```bash
npm run build
```

Output folder

```
dist
```

---

# 🛣 Roadmap

- ✅ ERC-8004 Identity
- ✅ Reputation
- ✅ Validation
- ✅ ANV Transfers
- ✅ Developer Tools
- ✅ Responsive Dashboard
- ✅ Landing Page
- 🔄 Agent Discovery
- 🔄 Analytics Dashboard
- 🔄 Multi-chain Support
- 🔄 WalletConnect Support

---

# 🤝 Contributing

Contributions are welcome!

Please read:

- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md

before submitting a Pull Request.

---

# 📄 License

Licensed under the **MIT License**.

See the LICENSE file for details.

---

# 🙏 Acknowledgements

Built with ❤️ for the Arc Developer Community.

Special thanks to:

- Arc Network
- ERC-8004 Contributors
- Open Source Community

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a Star on GitHub!

**Built with React • Vite • ethers.js • Arc Testnet**

</div>