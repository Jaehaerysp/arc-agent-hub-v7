import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWalletContext } from '../../../app/providers/WalletProvider'
import { useContractWrite } from '../../../hooks/useContractWrite'
import { CONTRACTS, DEFAULT_VALIDATOR } from '../../../contracts/registry'
import { Panel, FieldGroup, Input, Badge, Button } from '../../../ui/design-system'
import { Alert } from '../../../ui/Alert'
import { IconShield } from '../../../ui/icons'

const DEFAULT_REQUEST_URI = 'ipfs://validation-request'

/**
 * Request Validation — moved from `ValidationPage.jsx` verbatim in
 * business logic (same `validationRequest` call, same args, same
 * request-hash construction). Wrapped in `<div id="tv7-validation-form">`
 * so TrustQuickActions's "Validate Identity" tile can scroll straight to
 * it instead of navigating to a separate route.
 */
export function ValidationRequestPanel() {
  const { signer, agentId: sharedAgentId, addActivity, arcExplorer } = useWalletContext()

  const [agentId, setAgentId] = useState('')
  const [validator, setValidator] = useState(DEFAULT_VALIDATOR)
  const [requestURI, setRequestURI] = useState(DEFAULT_REQUEST_URI)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState(null)

  const { execute, loading, error, success, reset } = useContractWrite({
    address: CONTRACTS.VALIDATION_REGISTRY.address,
    abi: CONTRACTS.VALIDATION_REGISTRY.abi,
    signer,
    addActivity,
  })

  useEffect(() => {
    if (sharedAgentId) setAgentId(sharedAgentId.toString())
  }, [sharedAgentId])

  const clearState = () => {
    setSubmitted(false)
    setFormError(null)
    reset()
  }

  const handleRequest = async () => {
    setFormError(null)

    if (!agentId.trim()) return setFormError('Agent ID is required')
    if (!validator.trim() || !ethers.isAddress(validator.trim())) return setFormError('Valid validator address required')
    if (!requestURI.trim()) return setFormError('Request URI is required')

    const requestHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify({ agentId, validator, requestURI, timestamp: Date.now() }))
    )

    const result = await execute(
      'validationRequest',
      [validator.trim(), BigInt(agentId.trim()), requestURI.trim(), requestHash],
      { type: 'validation', label: 'Validation request', failLabel: 'Validation failed', agentId: agentId.trim(), validator }
    )

    if (result) setSubmitted(true)
  }

  return (
    <div id="tv7-validation-form">
      <Panel
        icon={<IconShield width={18} height={18} />}
        title="Request Validation"
        subtitle="Ask a validator to review your agent"
        className="tv7-form-panel"
      >
        <FieldGroup label={<>Agent ID {sharedAgentId && <Badge variant="accent">auto-filled</Badge>}</>}>
          <Input type="number" value={agentId} onChange={(e) => { clearState(); setAgentId(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <FieldGroup label={<>Validator address <Badge variant="muted">default</Badge></>}>
          <Input value={validator} onChange={(e) => { clearState(); setValidator(e.target.value) }} disabled={loading} />
        </FieldGroup>

        <FieldGroup label="Request URI">
          <Input value={requestURI} onChange={(e) => { clearState(); setRequestURI(e.target.value) }} disabled={loading} />
        </FieldGroup>

        {(formError || error) && <Alert variant="error" title="Request failed">{formError || error}</Alert>}

        {success && (
          <Alert variant="success" title="Validation request submitted">
            <a href={`${arcExplorer}/tx/${success.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link">
              View transaction ↗
            </a>
          </Alert>
        )}

        <Button variant="primary" block loading={loading} onClick={handleRequest} disabled={!signer || submitted}>
          {submitted ? '✓ Submitted' : 'Submit validation request'}
        </Button>
      </Panel>
    </div>
  )
}
