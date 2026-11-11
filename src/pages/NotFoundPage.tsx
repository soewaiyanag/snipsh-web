import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

// Placeholder until the 404 page is built in step 6.
export function NotFoundPage() {
  return (
    <section className="pt-10 sm:pt-20">
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-1.5 text-muted-foreground">There is nothing at this address.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to the start</Link>
      </Button>
    </section>
  )
}
