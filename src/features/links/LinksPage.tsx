import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import type { Link } from '@/api/types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import { SHORT_LINK_PREFIX } from '@/lib/short-link'
import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'
import { CreateLinkBar } from './CreateLinkBar'
import { LinkRow } from './LinkRow'
import { LINKS_PAGE_SIZE, useLinks } from './queries'

const FIRST_PAGE = 1
const SKELETON_ROWS = 6

export function LinksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(FIRST_PAGE, Number(searchParams.get('page')) || FIRST_PAGE)
  const links = useLinks(page)
  const [madeLink, setMadeLink] = useState<Link | null>(null)

  function goToPage(next: number) {
    setSearchParams(next === FIRST_PAGE ? {} : { page: String(next) })
  }

  const total = links.data?.total ?? 0
  const lastPage = Math.max(FIRST_PAGE, Math.ceil(total / LINKS_PAGE_SIZE))

  // Deleting the last link on a page leaves it empty; step back to a page that exists.
  if (links.data && !links.isPlaceholderData && page > lastPage) {
    return <Navigate to={lastPage === FIRST_PAGE ? '/links' : `/links?page=${lastPage}`} replace />
  }

  return (
    <div className="mx-auto max-w-3xl pt-8 sm:pt-14">
      <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Shorten a link</h1>

      <section aria-label="Make a short link" className="mt-7">
        <CreateLinkBar
          onCreated={(link) => {
            setMadeLink(link)
            goToPage(FIRST_PAGE)
          }}
        />
        {madeLink && (
          <p
            key={madeLink.id}
            role="status"
            className="mx-auto mt-6 flex w-fit max-w-full animate-in flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-ring bg-card py-2 pr-2 pl-5 shadow-field duration-200 zoom-in-95 fade-in-0"
          >
            <span className="link-text text-lg font-bold">
              <span className="font-normal text-muted-foreground">{SHORT_LINK_PREFIX}</span>
              {madeLink.slug}
            </span>
            <CopyButton slug={madeLink.slug} variant="default" />
          </p>
        )}
      </section>

      <section aria-labelledby="links-heading" aria-busy={links.isFetching} className="mt-14">
        <div className="mb-2 flex items-baseline justify-between gap-4 px-4">
          <h2 id="links-heading" className="text-xl font-semibold tracking-tight">
            Your links
          </h2>
          {total > 0 && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatNumber(total)}, newest first
            </p>
          )}
        </div>
        {links.isPending ? (
          <ul aria-label="Loading links" className="px-4">
            {Array.from({ length: SKELETON_ROWS }, (_, row) => (
              <li key={row} className="flex items-center gap-6 py-5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="hidden h-4 flex-1 md:block" />
                <Skeleton className="h-4 w-24" />
              </li>
            ))}
          </ul>
        ) : links.isError ? (
          <div role="alert" className="px-4 py-8">
            <p className="font-semibold">Your links could not be loaded.</p>
            <p className="mt-1 text-muted-foreground">{links.error.message}</p>
            <Button variant="outline" className="mt-5" onClick={() => links.refetch()}>
              Try again
            </Button>
          </div>
        ) : total === 0 ? (
          <div className="px-4 py-8">
            <p className="text-xl font-semibold">No links yet.</p>
            <p className="mt-2 max-w-prose text-muted-foreground">
              Paste a long URL into the bar above and press Shorten. Your short link will appear
              here, ready to copy.
            </p>
            <Button
              className="mt-6"
              onClick={() => document.getElementById('create-url')?.focus()}
            >
              Make your first link
            </Button>
          </div>
        ) : (
          <>
            <ul
              aria-label="Your links"
              className={cn('grid gap-1', links.isPlaceholderData && 'opacity-60')}
            >
              {links.data.items.map((link) => (
                <LinkRow key={link.id} link={link} isNew={link.id === madeLink?.id} />
              ))}
            </ul>
            {lastPage > FIRST_PAGE && (
              <nav aria-label="Pages" className="flex items-center justify-between gap-4 px-4 pt-6">
                <Button variant="outline" disabled={page === FIRST_PAGE} onClick={() => goToPage(page - 1)}>
                  Previous
                </Button>
                <p className="text-sm text-muted-foreground tabular-nums">
                  Page {page} of {lastPage}
                </p>
                <Button variant="outline" disabled={page === lastPage} onClick={() => goToPage(page + 1)}>
                  Next
                </Button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  )
}
