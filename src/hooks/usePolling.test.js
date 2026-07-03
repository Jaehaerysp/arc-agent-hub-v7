import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePolling } from './usePolling'

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls fn immediately on mount', () => {
    const fn = vi.fn()
    renderHook(() => usePolling(fn, 1000))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('calls fn again after each interval when enabled', () => {
    const fn = vi.fn()
    renderHook(() => usePolling(fn, 1000, true))

    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(2000)
    expect(fn).toHaveBeenCalledTimes(4)
  })

  it('still calls fn once immediately but never repeats when disabled', () => {
    const fn = vi.fn()
    renderHook(() => usePolling(fn, 1000, false))

    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(5000)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('clears the interval on unmount', () => {
    const fn = vi.fn()
    const { unmount } = renderHook(() => usePolling(fn, 1000, true))

    unmount()
    vi.advanceTimersByTime(5000)
    // Only the initial mount call — no ticks after unmount.
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
