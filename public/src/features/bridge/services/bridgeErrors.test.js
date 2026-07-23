import { describe, it, expect } from 'vitest'
import { classifyBridgeError, BRIDGE_ERROR_KIND, BRIDGE_ERROR_LABEL } from './bridgeErrors'

describe('classifyBridgeError', () => {
  it('classifies a user rejection', () => {
    expect(classifyBridgeError('user rejected the request').kind).toBe(BRIDGE_ERROR_KIND.USER_REJECTED)
  })

  it('classifies insufficient balance', () => {
    expect(classifyBridgeError('insufficient funds for gas').kind).toBe(BRIDGE_ERROR_KIND.INSUFFICIENT_BALANCE)
  })

  it('classifies a timeout', () => {
    expect(classifyBridgeError('request timed out').kind).toBe(BRIDGE_ERROR_KIND.TIMEOUT)
  })

  it('classifies an unavailable network', () => {
    expect(classifyBridgeError('No wallet extension detected').kind).toBe(BRIDGE_ERROR_KIND.NETWORK_UNAVAILABLE)
  })

  it('classifies an unconfigured bridge contract as an unsupported network', () => {
    expect(classifyBridgeError('Bridge contract not yet configured for Base Sepolia').kind).toBe(BRIDGE_ERROR_KIND.UNSUPPORTED_NETWORK)
  })

  it('falls back to unknown for an unrecognized message', () => {
    expect(classifyBridgeError('something totally unexpected').kind).toBe(BRIDGE_ERROR_KIND.UNKNOWN)
  })

  it('handles a null/empty message', () => {
    expect(classifyBridgeError(null).kind).toBe(BRIDGE_ERROR_KIND.UNKNOWN)
  })

  it('has a label for every kind', () => {
    for (const kind of Object.values(BRIDGE_ERROR_KIND)) {
      expect(BRIDGE_ERROR_LABEL[kind]).toBeTruthy()
    }
  })
})
