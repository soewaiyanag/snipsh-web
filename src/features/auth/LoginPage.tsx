import { Link, Navigate, useLocation, type Path } from 'react-router'
import { login } from '@/api/auth'
import { loginSchema } from '@/api/schemas'
import { env } from '@/env'
import { DEMO_CREDENTIALS } from '@/mocks/demo'
import { AuthForm } from './AuthForm'
import { useAuth } from './auth-context'
import { setToken } from './token'

const HOME_AFTER_LOGIN = '/links'

export function LoginPage() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: Path } | null)?.from

  // Also runs right after a successful login, which is what returns the user to their page.
  if (isAuthenticated) return <Navigate to={from ?? HOME_AFTER_LOGIN} replace />

  return (
    <AuthForm
      title="Log in"
      intro={from ? 'Log in to continue where you left off.' : 'Welcome back.'}
      submitLabel="Log in"
      submittingLabel="Logging in…"
      schema={loginSchema}
      passwordAutoComplete="current-password"
      demo={env.useMocks ? DEMO_CREDENTIALS : undefined}
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground underline hover:no-underline">
            Create an account
          </Link>
        </>
      }
      onSubmit={async (credentials) => {
        const { accessToken } = await login(credentials)
        setToken(accessToken, credentials.email)
      }}
    />
  )
}
