// ERC-8183 helpers — small pure functions shared by the job service and UI.
// The hashing pattern (keccak256 of a UTF-8 string) matches scripts/submitJob.ts
// and scripts/completeJob.ts in the verified SDK.

import { ethers } from 'ethers'
import { jobStatusLabel } from './constants'

/** Hashes free-text (a deliverable description or an approval/rejection reason) into bytes32. */
export function hashText(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text))
}

/**
 * Normalizes the tuple returned by getJob() into a plain object the UI can
 * render directly, with the numeric status resolved to its label.
 */
export function formatJob(job) {
  return {
    id: job.id.toString(),
    client: job.client,
    provider: job.provider,
    evaluator: job.evaluator,
    description: job.description,
    budget: job.budget,
    budgetFormatted: ethers.formatUnits(job.budget, 6),
    expiredAt: job.expiredAt.toString(),
    status: Number(job.status),
    statusLabel: jobStatusLabel(job.status),
    hook: job.hook,
  }
}
