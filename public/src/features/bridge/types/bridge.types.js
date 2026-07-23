// Bridge Center — shared shape documentation.
//
// This app is JS + JSDoc (no TypeScript build step — see vite.config.js),
// so "types" here means the same thing `usdcPaymentService.js`'s token
// descriptor comment does: a documented, agreed-upon object shape every
// bridge module reads/writes, not a compiled type. Nothing in this file
// runs; it exists so `bridgeService.js`/hooks/components can `@typedef`
// against it in editor tooltips.

/**
 * @typedef {Object} BridgeAsset
 * @property {string} key
 * @property {string} symbol
 * @property {string} name
 * @property {string} address
 * @property {number} decimals
 */

/**
 * @typedef {Object} BridgeNetwork
 * @property {string} id
 * @property {'evm'|'solana'} kind
 * @property {string} name
 * @property {number} [chainId]
 * @property {string} [chainIdHex]
 * @property {string} rpcUrl
 * @property {string} explorerUrl
 * @property {boolean} provenByScript
 */

/**
 * @typedef {'pending'|'submitted'|'confirming'|'completed'|'failed'} BridgeStatus
 */

/**
 * @typedef {Object} BridgeHistoryEntry
 * @property {string|number} id
 * @property {string} [hash]
 * @property {string} detail
 * @property {BridgeStatus} status
 * @property {string} sourceNetwork
 * @property {string} destinationNetwork
 * @property {string} amount
 * @property {string} tokenSymbol
 * @property {string} timestamp
 */

export {}
