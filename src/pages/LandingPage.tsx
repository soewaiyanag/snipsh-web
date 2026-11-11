import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

// Placeholder until the landing page is built in step 6.
export function LandingPage() {
  return (
    <section className="pt-10 sm:pt-20">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Long links, cut short.</h1>
      <p className="mt-4 max-w-prose text-lg text-muted-foreground">
        SnipShort turns a long URL into a short link and counts every click.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/register">Get started</Link>
      </Button>
    </section>
  )
}
