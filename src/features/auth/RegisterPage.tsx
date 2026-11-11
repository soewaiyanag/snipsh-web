import { Link, Navigate } from 'react-router'
import { login, register } from '@/api/auth'
import { registerSchema } from '@/api/schemas'
import { AuthForm } from './AuthForm'
import { useAuth } from './auth-context'
import { setToken } from './token'

export function RegisterPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/links" replace />

  return (
    <AuthForm
      title="Create your account"
      intro="An email and a password are all it takes."
      submitLabel="Create account"
      submittingLabel="Creating account…"
      schema={registerSchema}
      passwordAutoComplete="new-password"
      passwordHint="8 to 72 characters."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground underline hover:no-underline">
            Log in
          </Link>
        </>
      }
      onSubmit={async (credentials) => {
        await register(credentials)
        const { accessToken } = await login(credentials)
        setToken(accessToken, credentials.email)
      }}
    />
  )
}
