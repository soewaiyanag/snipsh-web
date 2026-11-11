import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { urlSchema } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import { env } from '@/env'
import { useAuth } from '@/features/auth/auth-context'
import { randomSlug, shortLinkLabel } from '@/lib/short-link'

type Preview = { slug: string } | { error: string }

const FEATURES = [
  {
    title: 'Short links',
    text: 'Paste a URL of any length and get a link that is a few characters long.',
  },
  {
    title: 'Your own slugs',
    text: `Name the link yourself, like ${shortLinkLabel('launch')}, or let SnipShort pick one.`,
  },
  {
    title: 'Click counts',
    text: 'See total clicks, clicks per day and where they came from, for every link.',
  },
]

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)

  // Nothing is saved here: this only shows what a short link would look like.
  function showPreview(event: FormEvent) {
    event.preventDefault()
    const result = urlSchema.safeParse(url)
    setPreview(result.success ? { slug: randomSlug() } : { error: result.error.issues[0].message })
  }

  const start = isAuthenticated
    ? { to: '/links', label: 'Go to your links' }
    : { to: '/register', label: 'Get started' }

  return (
    <div className="relative">
      {/* One soft light behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 left-1/2 -z-10 h-112 w-screen -translate-x-1/2 bg-[radial-gradient(42%_52%_at_50%_48%,var(--glow),transparent_72%)]"
      />

      <section className="mx-auto flex max-w-4xl flex-col items-center pt-14 text-center sm:pt-24">
        <h1 className="text-[2.6rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-7xl">
          Long links, cut short.
        </h1>

        <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
          SnipShort turns any long URL into a short link you can share, and counts every click it
          gets.
        </p>

        <form onSubmit={showPreview} noValidate className="mt-8 w-full max-w-2xl">
          <div className="flex items-center gap-2 rounded-full border border-input bg-card p-1.5 pl-5 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
            <label htmlFor="preview-url" className="sr-only">
              Long URL to preview
            </label>
            <input
              id="preview-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste a long URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              aria-invalid={preview && 'error' in preview ? true : undefined}
              aria-describedby="preview-result"
              className="link-text h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:font-sans placeholder:text-muted-foreground"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Shorten
            </Button>
          </div>

          <div id="preview-result" aria-live="polite" className="mt-4 min-h-10">
            {preview && 'error' in preview && (
              <p className="text-sm text-destructive">{preview.error}</p>
            )}
            {preview && 'slug' in preview && (
              <p className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl border bg-card px-5 py-3">
                <span className="link-text text-xl font-bold">{shortLinkLabel(preview.slug)}</span>
                <span className="text-sm text-muted-foreground">
                  A preview only.{' '}
                  <Link to={start.to} className="font-medium text-foreground underline hover:no-underline">
                    {isAuthenticated ? 'Make it for real' : 'Create an account'}
                  </Link>{' '}
                  to make it work.
                </span>
              </p>
            )}
          </div>
        </form>

        <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/85">
          {env.useMocks && !isAuthenticated ? (
            <Link to="/login">Explore the demo account</Link>
          ) : (
            <Link to={start.to}>{start.label}</Link>
          )}
        </Button>
      </section>

      <section aria-labelledby="what-it-does" className="mt-24 sm:mt-32">
        <h2 id="what-it-does" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What it does
        </h2>
        <dl className="mt-8 grid gap-x-10 sm:grid-cols-3">
          {FEATURES.map(({ title, text }) => (
            <div key={title} className="border-t py-6">
              <dt className="font-semibold">{title}</dt>
              <dd className="mt-2 max-w-[38ch] text-muted-foreground">{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-20 flex flex-col items-start gap-6 border-t pt-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Make your first short link.
        </p>
        <Button asChild size="lg">
          <Link to={start.to}>{start.label}</Link>
        </Button>
      </section>
    </div>
  )
}
