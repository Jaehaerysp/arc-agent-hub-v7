// Extended ERC-20 token registry for the Wallet page.
//
// This is a superset of `src/contracts/registry.js` (which only defines the
// contracts the rest of the app writes to: Identity/Reputation/Validation +
// ANV). Wallet needs to *read* balances for the wider set of tokens deployed
// on Arc Testnet, so that list lives here instead of bloating the core
// registry's "contracts we call" shape.
//
// Addresses and decimals for the original (pre-Sprint-1) entries are carried
// over UNCHANGED from the verified multi-wallet balance-checking script
// (check-balance.ts) — do not edit without confirming against a fresh
// deployment. The AI Agent and DeFi ecosystem entries were added in Sprint 1
// (v8 Wallet Module) from the same verified source.
//
// `category` groups every token for the Wallet UI's category tabs:
//   - 'native': the network's own asset family (USDC is tracked separately
//     by `useBalances`/`walletAnalytics.computeAssetBalances` since it's the
//     gas token, not an ERC-20 read — EURC and cirBTC live here as the
//     ERC-20 members of that same family).
//   - 'custom': the original general-purpose token set. ANV is also part of
//     this category conceptually, but — like native USDC — it's tracked
//     separately via `useBalances`/`CONTRACTS.ANV_TOKEN` since the rest of
//     the app already reads/writes it there; it is not duplicated into this
//     list. See `walletAnalytics.computeAssetBalances`.
//   - 'ai': the AI Agent ecosystem tokens.
//   - 'defi': the DeFi ecosystem tokens.
//
// The native gas token and ANV are intentionally excluded from this array:
// they're already tracked by `useBalances`/`walletAnalytics.computeAssetBalances`
// and stay that way so existing behavior (and its tests) are untouched.

const CUSTOM_TOKENS = [
  { key: 'eurc', symbol: 'EURC', name: 'EURC Token', address: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a', decimals: 6, category: 'native' },
  { key: 'cirbtc', symbol: 'cirBTC', name: 'Circle Bitcoin', address: '0xf0C4a4CE82A5746AbAAd9425360Ab04fbBA432BF', decimals: 8, category: 'native' },
  { key: 'bpk', symbol: 'BPK', name: 'BPK Token', address: '0x652EFa511CA70B5a412f669ba05f93255d8138E8', decimals: 18, category: 'custom' },
  { key: 'crp', symbol: 'CRP', name: 'CRP Token', address: '0xec3402d049794Dcc0a86B6882181CccfD9641b50', decimals: 18, category: 'custom' },
  { key: 'dtc', symbol: 'DTC', name: 'DTC Token', address: '0x2B43415E3Bf2848cD447A5B5846fE2312E3886C5', decimals: 18, category: 'custom' },
  { key: 'evm', symbol: 'EVM', name: 'EVM Token', address: '0x7f418AB683563233711C350D18595C481e22C666', decimals: 18, category: 'custom' },
  { key: 'flx', symbol: 'FLX', name: 'FLX Token', address: '0xed0b4A0C936751E78f3bb63C1F5263536BA15936', decimals: 18, category: 'custom' },
  { key: 'gld', symbol: 'GLD', name: 'GLD Token', address: '0x3eE04DD9F2992154c13eC3f709541B927676D21E', decimals: 18, category: 'custom' },
  { key: 'hvt', symbol: 'HVT', name: 'HVT Token', address: '0x4e4469285349E8b6a2a604aa6DecAA36D39fa424', decimals: 18, category: 'custom' },
  { key: 'nvs', symbol: 'NVS', name: 'NVS Token', address: '0x3dA47435C9896022c16e51ac8191ff67C307d707', decimals: 18, category: 'custom' },
  { key: 'znp', symbol: 'ZNP', name: 'ZNP Token', address: '0x9fea503bB76C52A861fEEAdaCb8317F72a3F696a', decimals: 18, category: 'custom' },
]

// AI Agent ecosystem — added Sprint 1 (v8 Wallet Module).
const AI_TOKENS = [
  { key: 'agc', symbol: 'AGC', name: 'AgentCore', address: '0x1DBf068f5FB37aB1ECBD1d5d97DaaB6b23c82d06', decimals: 18, category: 'ai' },
  { key: 'nnt', symbol: 'NNT', name: 'NeuralNet', address: '0xc0a505D16969bF1DFFE9565E687453D74bF3aA02', decimals: 18, category: 'ai' },
  { key: 'pmx', symbol: 'PMX', name: 'PromptX', address: '0x83bba4AD2Fa9a392A22896f59C3eBe7Ad56F5A70', decimals: 18, category: 'ai' },
  { key: 'vai', symbol: 'VAI', name: 'VectorAI', address: '0x692685947431a1b797552E0900a5a26FEB6FaAA6', decimals: 18, category: 'ai' },
  { key: 'lgf', symbol: 'LGF', name: 'LogicFlow', address: '0x38d882424C29dfaB4Db851d0608c0fCEC939ca6a', decimals: 18, category: 'ai' },
  { key: 'dtm', symbol: 'DTM', name: 'DataMind', address: '0x3140395cbf1258F164d9AD60d7aB0f070C77f6fd', decimals: 18, category: 'ai' },
  { key: 'cbn', symbol: 'CBN', name: 'ChainBrain', address: '0x9435a8f45c87739E8be9f436F84Bb05C33a934B3', decimals: 18, category: 'ai' },
  { key: 'nxa', symbol: 'NXA', name: 'NexusAgent', address: '0xCFbE96d8222906581a79531548d6Bb32FdC02A5b', decimals: 18, category: 'ai' },
  { key: 'qai', symbol: 'QAI', name: 'QuantumAI', address: '0x63dd4505BbcB0b1DF26A822009625952911F2566', decimals: 18, category: 'ai' },
  { key: 'oag', symbol: 'OAG', name: 'OmniAgent', address: '0x7e81d5735AF86DB8bfAdEAF64D9DFCB901E83Bbe', decimals: 18, category: 'ai' },
]

// DeFi ecosystem — added Sprint 1 (v8 Wallet Module).
const DEFI_TOKENS = [
  { key: 'lqs', symbol: 'LQS', name: 'LiquiSwap', address: '0x5F83d88C4fd78B08B28Df1d01fad4EfbA12C826d', decimals: 18, category: 'defi' },
  { key: 'ymx', symbol: 'YMX', name: 'YieldMax', address: '0xC709C12f8C072610ceb0a7A5F1bE119F4F02908c', decimals: 18, category: 'defi' },
  { key: 'stf', symbol: 'STF', name: 'StableFlow', address: '0xDa15D2Ca86B986aeF64F3F7BA43326FbdA2D1cd6', decimals: 18, category: 'defi' },
  { key: 'dxb', symbol: 'DXB', name: 'DexBridge', address: '0x35cF481F8d6F192A1b3149d0EF6eae9177392fF9', decimals: 18, category: 'defi' },
  { key: 'vct', symbol: 'VCT', name: 'VaultCore', address: '0x0E48820772937937F5aedeC503073A6a8EFA04e2', decimals: 18, category: 'defi' },
  { key: 'fch', symbol: 'FCH', name: 'FarmChain', address: '0xbC908c30185E1554eb3BB18b7EFbdf1B6203Ab71', decimals: 18, category: 'defi' },
  { key: 'sth', symbol: 'STH', name: 'StakeHub', address: '0x6C5AD9E0440A74f4cbe7EB64713C98D1139eA8d4', decimals: 18, category: 'defi' },
  { key: 'pfi', symbol: 'PFI', name: 'PoolFi', address: '0x4193ca08eD1aD1f5e5F254717d67018A08C3027a', decimals: 18, category: 'defi' },
  { key: 'swe', symbol: 'SWE', name: 'SwapEngine', address: '0xe67e5d61CDC42846813FE70dcBe478dBB9b9eE9a', decimals: 18, category: 'defi' },
  { key: 'odx', symbol: 'ODX', name: 'OmniDEX', address: '0x941F1635831d9E0C860BdecF0204bD6fbACd4250', decimals: 18, category: 'defi' },
]

/** Full read registry: every ERC-20 the Wallet page displays via `useTokenBalances`. */
export const WALLET_TOKENS = [...CUSTOM_TOKENS, ...AI_TOKENS, ...DEFI_TOKENS]

/** Human labels for the category tabs, in display order. `all` is synthetic (not a real category value). */
export const WALLET_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'native', label: 'Native' },
  { id: 'custom', label: 'Custom' },
  { id: 'ai', label: 'AI Agents' },
  { id: 'defi', label: 'DeFi' },
]
