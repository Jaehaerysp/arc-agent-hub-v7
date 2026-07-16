export async function listJobsForAccount(signerOrProvider, account) {
  const contract = getCommerceContract(signerOrProvider)
  const provider = signerOrProvider.provider ?? signerOrProvider

  // Configurable lookback (default: 2000 blocks)
  const LOOKBACK_BLOCKS =
    Number(import.meta.env.VITE_LOG_LOOKBACK) || 2000

  try {
    const latest = await provider.getBlockNumber()
    const fromBlock = Math.max(0, latest - LOOKBACK_BLOCKS)

    // Simple retry helper
    async function retry(fn, retries = 3) {
      let delay = 500

      for (let i = 0; i < retries; i++) {
        try {
          return await fn()
        } catch (err) {
          if (i === retries - 1) throw err

          console.warn(
            `Retry ${i + 1}/${retries} after RPC error...`
          )

          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2
        }
      }
    }

    // Fetch logs in parallel with retry
    const [clientLogs, providerLogs] = await Promise.all([
      retry(() =>
        contract.queryFilter(
          contract.filters.JobCreated(null, account),
          fromBlock,
          latest
        )
      ),

      retry(() =>
        contract.queryFilter(
          contract.filters.JobCreated(null, null, account),
          fromBlock,
          latest
        )
      ),
    ])

    // Remove duplicate jobs
    const jobMap = new Map()

    for (const log of [...clientLogs, ...providerLogs]) {
      const jobId = log.args[0].toString()

      if (!jobMap.has(jobId)) {
        jobMap.set(jobId, log)
      }
    }

    // Fetch all job details concurrently
    const jobs = (
      await Promise.all(
        [...jobMap.entries()].map(async ([jobId, log]) => {
          try {
            const job = await getJob(provider, jobId)

            return {
              ...job,
              createdTxHash: log.transactionHash,
              createdAt: null,
            }
          } catch (err) {
            console.error(`Failed to load job ${jobId}`, err)
            return null
          }
        })
      )
    ).filter(Boolean)

    // Latest jobs first
    jobs.sort((a, b) => Number(b.id) - Number(a.id))

    return jobs
  } catch (err) {
    console.error("Unable to load jobs:", err)

    // Return an empty array so the dashboard
    // stays functional instead of crashing.
    return []
  }
}
