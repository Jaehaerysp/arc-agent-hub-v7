// ERC-8183 job service — thin, framework-agnostic wrappers around the
// verified Agentic Commerce contract calls (createJob, setBudget, fund,
// submit, complete, getJob).
//
// Adapted from the ERC-8183 SDK's scripts/*.ts for use inside the React app:
//   - The SDK's scripts sign with raw private keys loaded from a .env file
//     (a Node-only, server-side pattern). That is intentionally NOT carried
//     over — a browser app must never hold a private key. Every write here
//     takes a `signer`, which in the UI is the connected wallet's
//     ethers.Signer from useWallet()/useWalletContext(), the same object
//     AgentsPage, ReputationPage, ValidationPage and TransferPage already use.
//   - The SDK's storage.ts persisted the last job id to a local job.json
//     file. That's replaced by simply passing/reading jobId as a normal
//     value (route param, form state, or the app's existing
//     useLocalStorage hook) — there is no filesystem in the browser.
//   - Contract addresses, ABI signatures and call arguments are otherwise
//     unchanged from the tested scripts.
//
// These functions return the raw ethers TransactionResponse/receipt, mirroring
// useContractWrite's `execute()` return shape ({ txHash, receipt }), so a
// future Sprint-2 hook can wrap them exactly like the ERC-8004 pages do.

import { getCommerceContract, getUsdcContract } from './contracts'
import { AGENTIC_COMMERCE_ADDRESS, DEFAULT_JOB_EXPIRY_SECONDS, ZERO_ADDRESS } from './constants'
import { hashText, formatJob } from './helpers'

async function sendAndWait(tx) {
  const receipt = await tx.wait()
  return { txHash: tx.hash, receipt }
}

/** Creates a new job. `expiredAt` defaults to now + 1 hour, matching the verified script. */
export async function createJob(signer, { provider, evaluator = ZERO_ADDRESS, description, hook = ZERO_ADDRESS, expiredAt } = {}) {
  const contract = getCommerceContract(signer)

  let expiry = expiredAt
  if (!expiry) {
    const block = await signer.provider.getBlock('latest')
    if (!block) throw new Error('Unable to fetch latest block')
    expiry = BigInt(block.timestamp) + DEFAULT_JOB_EXPIRY_SECONDS
  }

  const tx = await contract.createJob(provider, evaluator, expiry, description, hook)
  const { txHash, receipt } = await sendAndWait(tx)

  const event = receipt.logs
    .map((log) => {
      try {
        return contract.interface.parseLog(log)
      } catch {
        return null
      }
    })
    .find((parsed) => parsed?.name === 'JobCreated')

  const jobId = event ? event.args[0].toString() : null

  return { txHash, receipt, jobId }
}

/** Sets the budget for a job (called by the provider side). */
export async function setBudget(signer, jobId, amount) {
  const contract = getCommerceContract(signer)
  const tx = await contract.setBudget(jobId, amount, '0x')
  return sendAndWait(tx)
}

/** Approves the Agentic Commerce contract to pull `amount` of USDC on the client's behalf. */
export async function approveUsdc(signer, amount) {
  const usdc = getUsdcContract(signer)
  const tx = await usdc.approve(AGENTIC_COMMERCE_ADDRESS, amount)
  return sendAndWait(tx)
}

/** Funds a job (requires prior USDC approval). */
export async function fundJob(signer, jobId) {
  const contract = getCommerceContract(signer)
  const tx = await contract.fund(jobId, '0x')
  return sendAndWait(tx)
}

/** Submits a deliverable for a job. `deliverableText` is hashed with keccak256 before sending. */
export async function submitDeliverable(signer, jobId, deliverableText) {
  const contract = getCommerceContract(signer)
  const deliverableHash = hashText(deliverableText)
  const tx = await contract.submit(jobId, deliverableHash, '0x')
  const result = await sendAndWait(tx)
  return { ...result, deliverableHash }
}

/** Completes (approves) a job. `reasonText` is hashed with keccak256 before sending. */
export async function completeJob(signer, jobId, reasonText) {
  const contract = getCommerceContract(signer)
  const reasonHash = hashText(reasonText)
  const tx = await contract.complete(jobId, reasonHash, '0x')
  const result = await sendAndWait(tx)
  return { ...result, reasonHash }
}

/** Reads a job by id. Accepts a signer or a plain provider (read-only). */
export async function getJob(signerOrProvider, jobId) {
  const contract = getCommerceContract(signerOrProvider)
  const job = await contract.getJob(jobId)
  return formatJob(job)
}

/**
 * Reads how much USDC the Agentic Commerce contract is currently allowed to
 * pull on `owner`'s behalf — used to decide whether "Approve USDC" or
 * "Fund Job" is the correct next action for a job in the Open status.
 */
export async function getUsdcAllowance(signerOrProvider, owner) {
  const usdc = getUsdcContract(signerOrProvider)
  return usdc.allowance(owner, AGENTIC_COMMERCE_ADDRESS)
}

/**
 * Sprint 2 addition — the verified SDK has no "list jobs" call (only
 * getJob(id)), so job discovery for the Jobs dashboard/history is done by
 * reading JobCreated logs (jobId, client and provider are all indexed) for
 * jobs where the account is client OR provider, then resolving each id with
 * the same verified getJob() above. Read-only; does not touch any write path.
 */
export async function listJobsForAccount(signerOrProvider, account) {
  const contract = getCommerceContract(signerOrProvider)
  const provider = signerOrProvider.provider ?? signerOrProvider

  const latest = await provider.getBlockNumber()

  // Arc RPC allows max 10,000 blocks per request
  const fromBlock = Math.max(0, latest - 10000)

  const [clientLogs, providerLogs] = await Promise.all([
    contract.queryFilter(
      contract.filters.JobCreated(null, account),
      fromBlock,
      latest
    ),

    contract.queryFilter(
      contract.filters.JobCreated(null, null, account),
      fromBlock,
      latest
    ),
  ])

  const map = new Map()

  for (const log of [...clientLogs, ...providerLogs]) {
    const id = log.args[0].toString()

    if (!map.has(id)) {
      map.set(id, log)
    }
  }

  const jobs = []

  for (const [jobId, log] of map) {
    try {
      const job = await getJob(provider, jobId)

      jobs.push({
        ...job,
        createdTxHash: log.transactionHash,
        createdAt: null,
      })
    } catch (err) {
      console.error("Failed Job", jobId, err)
    }
  }

  jobs.sort((a, b) => Number(b.id) - Number(a.id))

  return jobs
}
