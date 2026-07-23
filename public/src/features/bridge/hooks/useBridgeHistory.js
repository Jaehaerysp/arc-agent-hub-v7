import { useMemo } from 'react'
import { computeBridgeHistory } from '../services/bridgeHistoryService'

/** Thin memoized wrapper over `computeBridgeHistory`, same pattern as Payments reading `activity` inline via `useMemo`. */
export function useBridgeHistory(activity, limit = 8) {
  return useMemo(() => computeBridgeHistory(activity, limit), [activity, limit])
}
