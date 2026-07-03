import { describe, it, expect } from 'vitest'
import {
  shortAddr,
  shortHash,
  formatTime,
  formatDate,
  formatTokenAmount,
  formatExpiry,
  isExpired,
} from './format'

describe('shortAddr', () => {
  it('returns an empty string for a falsy address', () => {
    expect(shortAddr(null)).toBe('')
    expect(shortAddr(undefined)).toBe('')
    expect(shortAddr('')).toBe('')
  })

  it('truncates to first 6 and last 4 characters', () => {
    const addr = '0x2473c34e4079b239e32559f9ad3bdfc6ea82ed14'
    expect(shortAddr(addr)).toBe('0x2473…ed14')
  })
})

describe('shortHash', () => {
  it('returns an empty string for a falsy hash', () => {
    expect(shortHash(null)).toBe('')
    expect(shortHash(undefined)).toBe('')
  })

  it('truncates to first 10 and last 6 characters', () => {
    const hash = '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567'
    expect(shortHash(hash)).toBe(`${hash.slice(0, 10)}…${hash.slice(-6)}`)
  })
})

describe('formatTime / formatDate', () => {
  it('return an empty string for a falsy timestamp', () => {
    expect(formatTime(0)).toBe('')
    expect(formatTime(null)).toBe('')
    expect(formatDate(0)).toBe('')
    expect(formatDate(null)).toBe('')
  })

  it('return a non-empty, locale-formatted string for a real timestamp', () => {
    const ts = new Date('2026-01-15T10:30:00Z').getTime()
    expect(formatTime(ts)).toEqual(expect.any(String))
    expect(formatTime(ts).length).toBeGreaterThan(0)
    expect(formatDate(ts)).toEqual(expect.any(String))
    expect(formatDate(ts).length).toBeGreaterThan(0)
  })
})

describe('formatTokenAmount', () => {
  it('renders a placeholder for null, undefined, or NaN', () => {
    expect(formatTokenAmount(null)).toBe('—')
    expect(formatTokenAmount(undefined)).toBe('—')
    expect(formatTokenAmount(NaN)).toBe('—')
  })

  it('formats a numeric value using the requested decimal precision', () => {
    // Matches the implementation's own toLocaleString call so the test
    // stays correct across locales/environments while still exercising
    // the decimals plumbing and thousands-separator behavior.
    expect(formatTokenAmount(1234.5678, 2)).toBe(
      Number(1234.5678).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    )
    expect(formatTokenAmount(1000, 4)).toBe(
      Number(1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })
    )
  })

  it('defaults to 2 decimal places when none is given', () => {
    expect(formatTokenAmount(1.005)).toBe(
      Number(1.005).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    )
  })
})

describe('formatExpiry', () => {
  it('renders a placeholder for a falsy or zero expiry', () => {
    expect(formatExpiry(0)).toBe('—')
    expect(formatExpiry(null)).toBe('—')
    expect(formatExpiry(undefined)).toBe('—')
  })

  it('renders a formatted date/time string for a real unix-seconds expiry', () => {
    const seconds = Math.floor(new Date('2027-06-01T00:00:00Z').getTime() / 1000)
    const result = formatExpiry(seconds)
    expect(result).not.toBe('—')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('isExpired', () => {
  it('returns false for a falsy expiry', () => {
    expect(isExpired(0)).toBe(false)
    expect(isExpired(null)).toBe(false)
    expect(isExpired(undefined)).toBe(false)
  })

  it('returns true for a unix-seconds timestamp in the past', () => {
    const past = Math.floor(new Date('2020-01-01T00:00:00Z').getTime() / 1000)
    expect(isExpired(past)).toBe(true)
  })

  it('returns false for a unix-seconds timestamp in the future', () => {
    const future = Math.floor(new Date('2099-01-01T00:00:00Z').getTime() / 1000)
    expect(isExpired(future)).toBe(false)
  })
})
