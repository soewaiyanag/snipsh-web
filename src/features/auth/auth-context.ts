import { createContext, use } from 'react'

export type AuthState = { isAuthenticated: boolean; email: string | null }

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const auth = use(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
