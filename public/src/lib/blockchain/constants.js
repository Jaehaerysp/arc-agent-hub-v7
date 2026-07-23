// ERC-8183 Agentic Commerce — contract addresses and job constants.
// Network-level values (chain id, RPC, explorer) are NOT duplicated here —
// they live in a single place at src/chains/arc.js and are imported instead.
// Addresses below are carried over UNCHANGED from the verified ERC-8183 SDK.

export const AGENTIC_COMMERCE_ADDRESS = '0x0747EEf0706327138c69792bF28Cd525089e4583'
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// Order matches the on-chain Job.status uint8 exactly — do not reorder.
export const JOB_STATUS = ['Open', 'Funded', 'Submitted', 'Completed', 'Rejected', 'Expired']

export function jobStatusLabel(statusIndex) {
  return JOB_STATUS[Number(statusIndex)] ?? 'Unknown'
}

// Default job expiry window used by the "Create job" form (1 hour), matching
// the value used during SDK verification on Arc Testnet.
export const DEFAULT_JOB_EXPIRY_SECONDS = 3600n
