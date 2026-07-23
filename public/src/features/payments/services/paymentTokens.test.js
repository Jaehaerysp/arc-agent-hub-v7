import { describe, it, expect } from 'vitest'
import { PAYMENT_TOKENS, getPaymentToken } from './paymentTokens'
import { WALLET_TOKENS } from '../../wallet/services/tokenRegistry'
import { USDC_TOKEN } from './usdcPaymentService'

describe('PAYMENT_TOKENS', () => {
  it('includes USDC, ANV, and every token in the Wallet registry — no duplicate registry', () => {
    expect(PAYMENT_TOKENS.length).toBe(WALLET_TOKENS.length + 2)
  })

  it('includes the same USDC descriptor Payments has always used', () => {
    expect(PAYMENT_TOKENS.some((t) => t.key === USDC_TOKEN.key && t.address === USDC_TOKEN.address)).toBe(true)
  })

  it('includes ANV alongside the Wallet registry tokens', () => {
    expect(PAYMENT_TOKENS.some((t) => t.symbol === 'ANV')).toBe(true)
  })

  it('automatically picks up every Custom/AI Agent/DeFi token from the Wallet registry', () => {
    for (const token of WALLET_TOKENS) {
      expect(PAYMENT_TOKENS.some((t) => t.key === token.key && t.address === token.address)).toBe(true)
    }
  })

  it('has no duplicate keys', () => {
    const keys = PAYMENT_TOKENS.map((t) => t.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('getPaymentToken', () => {
  it('finds a token by key', () => {
    expect(getPaymentToken('anv').symbol).toBe('ANV')
  })

  it('falls back to USDC for an unknown key', () => {
    expect(getPaymentToken('not-a-real-token').key).toBe(USDC_TOKEN.key)
  })
})
