import { describe, it, expect } from 'vitest'
import { classifySwapError, SWAP_ERROR_KIND, SWAP_ERROR_LABEL, SWAP_ERROR_DESCRIPTION } from './swapErrors'

describe('classifySwapError', () => {
  it('classifies a user rejection', () => {
    expect(classifySwapError('User rejected the request').kind).toBe(SWAP_ERROR_KIND.USER_REJECTED)
  })

  it('classifies insufficient balance', () => {
    expect(classifySwapError('insufficient funds for transfer').kind).toBe(SWAP_ERROR_KIND.INSUFFICIENT_BALANCE)
  })

  it('classifies a missing kit key', () => {
    expect(classifySwapError('KIT_KEY missing in .env').kind).toBe(SWAP_ERROR_KIND.KIT_KEY_MISSING)
  })

  it('classifies an unavailable quote', () => {
    expect(classifySwapError('quote unavailable for this pair').kind).toBe(SWAP_ERROR_KIND.QUOTE_UNAVAILABLE)
  })

  it('classifies an unsupported network', () => {
    expect(classifySwapError('Unsupported network for this token').kind).toBe(SWAP_ERROR_KIND.UNSUPPORTED_NETWORK)
  })

  it('classifies an RPC failure', () => {
    expect(classifySwapError('could not detect network').kind).toBe(SWAP_ERROR_KIND.RPC_FAILURE)
  })

  it('classifies a disconnected wallet', () => {
    expect(classifySwapError('No wallet extension detected. Install MetaMask or Rabby to continue.').kind).toBe(
      SWAP_ERROR_KIND.WALLET_NOT_CONNECTED
    )
  })

  it('falls back to a generic swap failure for an unrecognized message', () => {
    expect(classifySwapError('something totally unexpected').kind).toBe(SWAP_ERROR_KIND.SWAP_FAILED)
  })

  it('handles a null/empty message', () => {
    expect(classifySwapError(null).kind).toBe(SWAP_ERROR_KIND.UNKNOWN)
  })

  it('has a label and description for every kind', () => {
    for (const kind of Object.values(SWAP_ERROR_KIND)) {
      expect(SWAP_ERROR_LABEL[kind]).toBeTruthy()
      expect(SWAP_ERROR_DESCRIPTION[kind]).toBeTruthy()
    }
  })
})
