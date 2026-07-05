// Temporary mock marketplace data for Arc Agent Hub v5 Sprint 1.
//
// This is NOT wired to the ERC-8004 Identity Registry — it's a static
// catalog used to drive the browse/hire UX until real on-chain agent
// discovery ships in a later sprint. Wallet addresses below are
// well-formed but not real registered agents.
//
// v6.0.0-m4: extended (additively — every field from v5 is unchanged in
// name and meaning) with the profile/portfolio fields the redesigned
// Marketplace and Agent Profile need: a plain-language specialty line,
// a short skills list, availability, and a few "terms" facts (avg.
// delivery, response rate) that were previously only implied by
// successRate. Nothing here changes what AGENTS/getAgentByWallet return
// for existing keys — computeAgentStats() and getAgentByWallet() behavior
// is unchanged.
//
// v6.0.0-m5 (Mission 5 — Agent Profile redesign): extended again,
// additively, with the identity/trust/capability/portfolio facts the
// flagship Agent Profile page needs and the dense marketplace card does
// not: on-chain identity metadata (agentId, version, network,
// registeredAt), a technical skill set distinct from the plain-language
// `skills` capability tags (`techStack`), a fixed-vocabulary
// `capabilities` set, availability detail (`timezone`, `workingHours`,
// `currentCapacity`), `pricing` terms, `chains` (supported networks),
// and small `workHistory` / `reviews` portfolio arrays. Every v5/m4 field
// keeps its exact name and meaning; nothing here changes any existing
// marketplace behavior.

export const AGENTS = [
  {
    id: 'agent-research',
    name: 'Research Agent',
    category: 'Research',
    wallet: '0x2473c34e4079b239e32559f9ad3bdfc6ea82ed14',
    description:
      'Gathers, synthesizes, and summarizes information from on-chain and off-chain sources. Ideal for market research, due diligence, and competitive analysis jobs.',
    specialty: 'Market research and on-chain due diligence',
    skills: ['Due diligence', 'Competitive analysis', 'Data synthesis'],
    reputation: 4.8,
    completedJobs: 214,
    successRate: 97,
    averageBudget: 42,
    avgDeliveryHours: 5,
    responseRate: 98,
    availability: 'available',
    registered: true,
    avatarColor: '#7c5cff',
    agentId: 'AGT-0142',
    version: 'v2.3.0',
    network: 'Arc Testnet',
    registeredAt: '2024-11-02',
    timezone: 'UTC',
    workingHours: '08:00–20:00 UTC',
    currentCapacity: 35,
    techStack: ['Python', 'LangChain', 'Vector Search', 'On-chain Data'],
    capabilities: ['Research', 'Analytics'],
    chains: ['Arc Testnet', 'Ethereum', 'Base', 'Polygon'],
    pricing: { hourly: 15, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2041', client: '0x91a…3fce', result: 'Delivered a 40-page due-diligence report ahead of schedule', status: 'completed', date: '2026-06-18' },
      { jobId: 'JOB-1988', client: '0x4c2…09ab', result: 'Competitive analysis across 12 protocols, flagged 3 risks', status: 'completed', date: '2026-05-30' },
      { jobId: 'JOB-1904', client: '0x77d…e412', result: 'Market sizing brief for a new stablecoin launch', status: 'completed', date: '2026-05-11' },
    ],
    reviews: [
      { name: 'Treasury DAO', comment: 'Thorough sourcing and clear synthesis — exactly the due-diligence depth we needed before allocating.', job: 'Protocol due diligence', date: '2026-06-19', score: 5 },
      { name: 'Nova Ventures', comment: 'Fast turnaround on a dense competitive landscape brief, with sources cited throughout.', job: 'Market research', date: '2026-05-31', score: 4.5 },
    ],
  },
  {
    id: 'agent-writing',
    name: 'Writing Agent',
    category: 'Content',
    wallet: '0x2c0ec47f413b0c4a329eabfbc0396352e8576a05',
    description:
      'Produces long- and short-form written content — articles, documentation, marketing copy — tuned to a brief and tone of voice you provide.',
    specialty: 'Long-form content tuned to a brief and tone',
    skills: ['Technical writing', 'Marketing copy', 'Editing'],
    reputation: 4.6,
    completedJobs: 356,
    successRate: 95,
    averageBudget: 28,
    avgDeliveryHours: 8,
    responseRate: 96,
    availability: 'available',
    registered: true,
    avatarColor: '#ff6bcb',
    agentId: 'AGT-0098',
    version: 'v3.1.2',
    network: 'Arc Testnet',
    registeredAt: '2024-08-14',
    timezone: 'UTC',
    workingHours: '08:00–20:00 UTC',
    currentCapacity: 40,
    techStack: ['NLP', 'GPT-4 Tooling', 'SEO', 'Editorial Review'],
    capabilities: ['Content', 'Automation'],
    chains: ['Arc Testnet', 'Ethereum', 'Base', 'Polygon'],
    pricing: { hourly: 10, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2117', client: '0x1ab…7d2c', result: 'Full documentation rewrite across 18 product pages', status: 'completed', date: '2026-06-22' },
      { jobId: 'JOB-2002', client: '0x9f3…c810', result: 'Launch campaign copy for a wallet integration', status: 'completed', date: '2026-06-02' },
      { jobId: 'JOB-1876', client: '0x662…44be', result: 'Technical blog series on validator economics', status: 'completed', date: '2026-05-08' },
    ],
    reviews: [
      { name: 'Arc Labs', comment: 'Matched our tone guide precisely and needed almost no editing before publishing.', job: 'Documentation rewrite', date: '2026-06-23', score: 5 },
      { name: 'Meridian Finance', comment: 'Delivered on time with a voice that felt genuinely on-brand.', job: 'Campaign copy', date: '2026-06-03', score: 4.5 },
    ],
  },
  {
    id: 'agent-trading',
    name: 'Trading Agent',
    category: 'Finance',
    wallet: '0x848ee74c84cc5f365bd6dae6472f53182bf3adc3',
    description:
      'Executes and reports on trading strategies within parameters you set, with a focus on risk-managed, rules-based execution rather than discretionary calls.',
    specialty: 'Rules-based, risk-managed strategy execution',
    skills: ['Risk management', 'Strategy execution', 'Reporting'],
    reputation: 4.3,
    completedJobs: 128,
    successRate: 89,
    averageBudget: 165,
    avgDeliveryHours: 3,
    responseRate: 91,
    availability: 'busy',
    registered: true,
    avatarColor: '#34d399',
    agentId: 'AGT-0271',
    version: 'v1.9.4',
    network: 'Arc Testnet',
    registeredAt: '2025-01-27',
    timezone: 'UTC',
    workingHours: '24/7',
    currentCapacity: 82,
    techStack: ['Solidity', 'TypeScript', 'Risk Models', 'Foundry'],
    capabilities: ['Trading', 'Analytics'],
    chains: ['Arc Testnet', 'Ethereum', 'Base'],
    pricing: { hourly: 45, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2205', client: '0x3d8…91fa', result: 'Executed a 30-day rules-based rebalancing strategy', status: 'completed', date: '2026-06-27' },
      { jobId: 'JOB-2098', client: '0x0e5…2c77', result: 'Risk-managed execution report across 4 pairs', status: 'completed', date: '2026-06-05' },
      { jobId: 'JOB-1955', client: '0x8b1…f603', result: 'Strategy backtest and live execution handoff', status: 'completed', date: '2026-05-14' },
    ],
    reviews: [
      { name: 'Solstice Capital', comment: 'Execution stayed strictly within the risk parameters we set, with clear reporting throughout.', job: 'Rebalancing strategy', date: '2026-06-28', score: 4.5 },
      { name: 'Ferro Digital', comment: 'Reliable, rules-based execution — no discretionary surprises.', job: 'Execution reporting', date: '2026-06-06', score: 4 },
    ],
  },
  {
    id: 'agent-monitoring',
    name: 'Monitoring Agent',
    category: 'Infrastructure',
    wallet: '0x9e11e2c2762aaa50f8b79bbffadc39d4fb0a00ec',
    description:
      'Watches contracts, wallets, and endpoints for defined conditions and reports anomalies in real time. Well suited to uptime and treasury-safety jobs.',
    specialty: 'Real-time contract and endpoint monitoring',
    skills: ['Uptime monitoring', 'Treasury safety', 'Alerting'],
    reputation: 4.9,
    completedJobs: 502,
    successRate: 99,
    averageBudget: 18,
    avgDeliveryHours: 1,
    responseRate: 99,
    availability: 'available',
    registered: true,
    avatarColor: '#38bdf8',
    agentId: 'AGT-0053',
    version: 'v4.0.1',
    network: 'Arc Testnet',
    registeredAt: '2024-05-09',
    timezone: 'UTC',
    workingHours: '24/7',
    currentCapacity: 22,
    techStack: ['Rust', 'Prometheus', 'Webhooks', 'Anomaly Detection'],
    capabilities: ['Infrastructure', 'Security'],
    chains: ['Arc Testnet', 'Ethereum', 'Base', 'Polygon'],
    pricing: { hourly: 8, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2231', client: '0x5a9…10dd', result: 'Zero missed alerts across a 90-day treasury watch', status: 'completed', date: '2026-06-29' },
      { jobId: 'JOB-2140', client: '0x2f7…8b19', result: 'Caught and reported an endpoint anomaly within 40 seconds', status: 'completed', date: '2026-06-11' },
      { jobId: 'JOB-2011', client: '0xc46…5ee2', result: 'Set up uptime monitoring across 6 contracts', status: 'completed', date: '2026-05-19' },
    ],
    reviews: [
      { name: 'Vault Systems', comment: 'Caught an anomaly the night before a scheduled audit — genuinely saved us time.', job: 'Endpoint monitoring', date: '2026-06-12', score: 5 },
      { name: 'Harbor DAO', comment: 'Consistent, low-noise alerting over a full quarter with no missed conditions.', job: 'Treasury watch', date: '2026-06-30', score: 5 },
    ],
  },
  {
    id: 'agent-translation',
    name: 'Translation Agent',
    category: 'Language',
    wallet: '0x4ec2bc0f2d4d67d24d7eecbcdec12b340a601d96',
    description:
      'Translates documents, interfaces, and support content across major world languages while preserving tone, terminology, and formatting.',
    specialty: 'Multilingual translation, tone-preserving',
    skills: ['Localization', 'Terminology consistency', 'QA review'],
    reputation: 4.7,
    completedJobs: 189,
    successRate: 96,
    averageBudget: 22,
    avgDeliveryHours: 6,
    responseRate: 95,
    availability: 'available',
    registered: true,
    avatarColor: '#fbbf24',
    agentId: 'AGT-0176',
    version: 'v2.6.0',
    network: 'Arc Testnet',
    registeredAt: '2024-12-20',
    timezone: 'UTC',
    workingHours: '08:00–20:00 UTC',
    currentCapacity: 45,
    techStack: ['NLP', 'Transformer Models', 'i18n Tooling', 'QA Review'],
    capabilities: ['Content', 'Automation'],
    chains: ['Arc Testnet', 'Ethereum', 'Base', 'Polygon'],
    pricing: { hourly: 9, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2076', client: '0xd21…4a90', result: 'Localized an interface into 9 languages with QA pass', status: 'completed', date: '2026-06-15' },
      { jobId: 'JOB-1962', client: '0x77c…b032', result: 'Translated support docs preserving product terminology', status: 'completed', date: '2026-05-22' },
      { jobId: 'JOB-1889', client: '0x1e4…9c67', result: 'Tone-matched marketing translation for 3 markets', status: 'completed', date: '2026-05-02' },
    ],
    reviews: [
      { name: 'Kestrel App', comment: 'Terminology stayed consistent across every language, which is rare to get right.', job: 'Interface localization', date: '2026-06-16', score: 5 },
      { name: 'Pico Studio', comment: 'Tone-preserving translation that read naturally in every target market.', job: 'Marketing translation', date: '2026-05-03', score: 4.5 },
    ],
  },
  {
    id: 'agent-review',
    name: 'Review Agent',
    category: 'Quality Assurance',
    wallet: '0x74e3103816b29e8c56dd936277bdb25c8283af71',
    description:
      'Independently reviews deliverables — code, documents, or datasets — against a checklist or spec and returns a structured pass/fail report.',
    specialty: 'Independent deliverable review against spec',
    skills: ['Code review', 'Spec compliance', 'Structured reporting'],
    reputation: 4.5,
    completedJobs: 97,
    successRate: 93,
    averageBudget: 35,
    avgDeliveryHours: 4,
    responseRate: 94,
    availability: 'at_capacity',
    registered: true,
    avatarColor: '#f87171',
    agentId: 'AGT-0209',
    version: 'v1.4.3',
    network: 'Arc Testnet',
    registeredAt: '2025-02-11',
    timezone: 'UTC',
    workingHours: '08:00–20:00 UTC',
    currentCapacity: 100,
    techStack: ['Solidity', 'TypeScript', 'Static Analysis', 'Foundry'],
    capabilities: ['Development', 'Security'],
    chains: ['Arc Testnet', 'Ethereum', 'Base'],
    pricing: { hourly: 14, customAvailable: true, escrowSupported: true },
    workHistory: [
      { jobId: 'JOB-2168', client: '0x63f…2a1d', result: 'Structured pass/fail review of a contract upgrade', status: 'completed', date: '2026-06-20' },
      { jobId: 'JOB-2054', client: '0xaa2…7409', result: 'Spec-compliance audit across 3 datasets', status: 'completed', date: '2026-06-01' },
      { jobId: 'JOB-1931', client: '0x9d0…e857', result: 'Code review flagged 2 spec deviations before ship', status: 'completed', date: '2026-05-13' },
    ],
    reviews: [
      { name: 'Cinder Labs', comment: 'Structured report made it easy to see exactly what passed and what needed changes.', job: 'Contract upgrade review', date: '2026-06-21', score: 4.5 },
      { name: 'Delta Audits', comment: 'Caught spec deviations our own team had missed on first pass.', job: 'Code review', date: '2026-05-14', score: 4.5 },
    ],
  },
]

export function getAgentByWallet(wallet) {
  if (!wallet) return null
  return AGENTS.find((a) => a.wallet.toLowerCase() === wallet.toLowerCase()) || null
}
