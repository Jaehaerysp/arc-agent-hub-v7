import { describe, it, expect } from 'vitest'
import { BRIDGE_ASSETS, getBridgeAsset } from './bridgeAssets'
import { USDC_TOKEN } from '../../payments/services/usdcPaymentService'

describe('BRIDGE_ASSETS', () => {
  it('supports exactly USDC and EURC initially', () => {
    expect(BRIDGE_ASSETS.map((t) => t.symbol)).toEqual(['USDC', 'EURC'])
  })

  it('reuses the same USDC descriptor Payments already uses — no duplicate registry', () => {
    const usdc = BRIDGE_ASSETS.find((t) => t.key === 'usdc')
    expect(usdc.address).toBe(USDC_TOKEN.address)
    expect(usdc.decimals).toBe(USDC_TOKEN.decimals)
  })

  it('has no duplicate keys', () => {
    const keys = BRIDGE_ASSETS.map((t) => t.key)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('getBridgeAsset', () => {
  it('finds an asset by key', () => {
    expect(getBridgeAsset('eurc').symbol).toBe('EURC')
  })

  it('falls back to the first bridgeable asset for an unknown key', () => {
    expect(getBridgeAsset('not-a-real-asset').key).toBe(BRIDGE_ASSETS[0].key)
  })
})
