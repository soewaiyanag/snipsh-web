import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'

export function NotFoundPage() {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  return (
    <section className="pt-10 sm:pt-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Nothing at this address</h1>
      <p className="mt-4 max-w-prose text-lg text-muted-foreground">
        There is no page at{' '}
        <span className="link-text text-foreground line-through decoration-destructive">{pathname}</span>
        . The address may be mistyped, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link to={isAuthenticated ? '/links' : '/'}>
            {isAuthenticated ? 'Back to your links' : 'Back to the start'}
          </Link>
        </Button>
      </div>
    </section>
  )
}
