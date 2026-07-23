// Bridge Center — destination network registry.
//
// Same convention as chains/arc.js: this is the single source of truth for
// every non-Arc network the Bridge Center can move USDC/EURC to or from.
// Nothing outside this file should hardcode a destination chain id, RPC, or
// explorer URL.
//
// Scope is deliberately limited to the networks the reference CLI scripts
// (bridge-usdc.ts, Bridge-usdc-arc-base.ts, arc-to-solana-bridge.ts,
// solana-bridge.ts) actually exercise: Base Sepolia (both directions) and
// Solana Devnet (both directions) are proven by a script; the remaining EVM
// testnets are listed per the Sprint 3 brief as networks to enable, using
// each chain's well-known public testnet RPC/explorer, and are marked
// `provenByScript: false` so the UI and services can be honest about which
// paths have actually been exercised against Circle's bridge before.
//
// `kind: 'evm'` networks work with the same `window.ethereum` signer the
// rest of this app already uses (see hooks/useWallet.js). `kind: 'solana'`
// networks do not — this app has no Solana wallet integration, so Solana
// Devnet is listed (per the brief's supported-networks list) but bridging
// to/from it is intentionally disabled in the UI. See bridgeService.js.

export const BRIDGE_NETWORKS = [
  {
    id: 'base-sepolia',
    kind: 'evm',
    name: 'Base Sepolia',
    chainId: 84532,
    chainIdHex: '0x14a34',
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    provenByScript: true, // Bridge-usdc-arc-base.ts / bridge-usdc.ts
  },
  {
    id: 'ethereum-sepolia',
    kind: 'evm',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    chainIdHex: '0xaa36a7',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    provenByScript: false,
  },
  {
    id: 'arbitrum-sepolia',
    kind: 'evm',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    chainIdHex: '0x66eee',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    provenByScript: false,
  },
  {
    id: 'optimism-sepolia',
    kind: 'evm',
    name: 'Optimism Sepolia',
    chainId: 11155420,
    chainIdHex: '0xaa37dc',
    rpcUrl: 'https://sepolia.optimism.io',
    explorerUrl: 'https://sepolia-optimism.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    provenByScript: false,
  },
  {
    id: 'avalanche-fuji',
    kind: 'evm',
    name: 'Avalanche Fuji',
    chainId: 43113,
    chainIdHex: '0xa869',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://testnet.snowtrace.io',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    provenByScript: false,
  },
  {
    id: 'polygon-amoy',
    kind: 'evm',
    name: 'Polygon Amoy',
    chainId: 80002,
    chainIdHex: '0x13882',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    provenByScript: false,
  },
  {
    id: 'solana-devnet',
    kind: 'solana',
    name: 'Solana Devnet',
    explorerUrl: 'https://explorer.solana.com',
    explorerCluster: '?cluster=devnet',
    provenByScript: true, // arc-to-solana-bridge.ts / solana-bridge.ts
  },
]

export function getBridgeNetwork(id) {
  return BRIDGE_NETWORKS.find((n) => n.id === id) || null
}

/** Networks the connected EVM wallet (window.ethereum) can actually sign for. */
export const EVM_BRIDGE_NETWORKS = BRIDGE_NETWORKS.filter((n) => n.kind === 'evm')

export function bridgeNetworkExplorerTxUrl(network, hash) {
  if (!network || !hash) return null
  if (network.kind === 'solana') return `${network.explorerUrl}/tx/${hash}${network.explorerCluster || ''}`
  return `${network.explorerUrl}/tx/${hash}`
}
