import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import { getEmail, getToken, subscribe } from './token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(subscribe, getToken)
  const email = useSyncExternalStore(subscribe, getEmail)
  const queryClient = useQueryClient()

  // Covers both logging out and a 401: the next user must never see cached data.
  useEffect(() => {
    if (!token) queryClient.clear()
  }, [token, queryClient])

  const value = useMemo(() => ({ isAuthenticated: token !== null, email }), [token, email])

  return <AuthContext value={value}>{children}</AuthContext>
}
