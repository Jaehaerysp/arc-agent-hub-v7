// ABIs carried over UNCHANGED from the verified ERC-8183 SDK (abi/AgenticCommerce.ts, abi/ERC20.ts).
// Do not edit signatures without re-verifying against a fresh deployment.

export const AGENTIC_COMMERCE_ABI = [
  'function createJob(address provider,address evaluator,uint256 expiredAt,string description,address hook) returns(uint256)',
  'function setBudget(uint256 jobId,uint256 amount,bytes optParams)',
  'function fund(uint256 jobId,bytes optParams)',
  'function submit(uint256 jobId,bytes32 deliverable,bytes optParams)',
  'function complete(uint256 jobId,bytes32 reason,bytes optParams)',
  'function getJob(uint256 jobId) view returns(tuple(uint256 id,address client,address provider,address evaluator,string description,uint256 budget,uint256 expiredAt,uint8 status,address hook))',
  'event JobCreated(uint256 indexed jobId,address indexed client,address indexed provider,address evaluator,uint256 expiredAt,address hook)',
]

// Superset of src/contracts/abis/erc20.js (which only covers the ANV token's
// read/transfer needs). USDC funding requires approve/allowance too, so this
// lives separately rather than changing the working ANV ABI.
export const USDC_ABI = [
  'function approve(address spender,uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner,address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]
