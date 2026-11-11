import { Link, Outlet, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from '@/features/auth/auth-context'
import { clearToken } from '@/features/auth/token'
import { Wordmark } from './Wordmark'

function Header() {
  const { isAuthenticated, email } = useAuth()
  const navigate = useNavigate()

  // Leave the protected page first, so the route guard does not remember it for the next user.
  async function logOut() {
    await navigate('/')
    clearToken()
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4">
      <Link to={isAuthenticated ? '/links' : '/'} aria-label="SnipShort home" className="rounded-lg">
        <Wordmark />
      </Link>
      {isAuthenticated ? (
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-sm text-muted-foreground">{email}</span>
          <Button variant="outline" onClick={logOut}>
            Log out
          </Button>
        </div>
      ) : (
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 sm:px-6">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-16">
        <Outlet />
      </main>
      <Toaster position="bottom-center" />
    </div>
  )
}
