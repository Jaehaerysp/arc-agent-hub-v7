import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

/**
 * Provides app-wide toast notifications. Wrap once near the root (see
 * `App.jsx`); descendants call `useToast()` to trigger or dismiss a toast.
 * Toasts auto-dismiss after `duration` ms unless `duration` is 0.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 4000 }) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, title, description, variant }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Reads the toast context. Throws if called outside a `ToastProvider` so
 * misuse fails loudly during development rather than silently no-op-ing.
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
