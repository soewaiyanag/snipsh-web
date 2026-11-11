import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { createLinkFormSchema } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import { shortLinkLabel } from '@/lib/short-link'
import { cn } from '@/lib/utils'
import { LinkForm } from './LinkForm'
import { LinkRow } from './LinkRow'
import { LINKS_PAGE_SIZE, useCreateLink, useLinks } from './queries'

const FIRST_PAGE = 1
const SKELETON_ROWS = 6

export function LinksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(FIRST_PAGE, Number(searchParams.get('page')) || FIRST_PAGE)
  const links = useLinks(page)
  const createLink = useCreateLink()
  const [newLinkId, setNewLinkId] = useState<string | null>(null)

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
    <div className="pt-6 sm:pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Your links</h1>
        {total > 0 && (
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatNumber(total)} {total === 1 ? 'link' : 'links'}, newest first
          </p>
        )}
      </div>

      <section aria-label="Make a short link" className="sheet mt-6 p-5">
        <LinkForm
          schema={createLinkFormSchema}
          defaultValues={{ url: '', slug: '' }}
          submitLabel="Shorten"
          submittingLabel="Shortening…"
          slugLabel="Slug (optional)"
          slugPlaceholder="made for you if empty"
          onSubmit={async ({ url, slug }) => {
            const link = await createLink.mutateAsync({ url, slug: slug || undefined })
            setNewLinkId(link.id)
            goToPage(FIRST_PAGE)
            toast.success('Short link made', { description: shortLinkLabel(link.slug) })
          }}
        />
      </section>

      <section aria-label="Links" aria-busy={links.isFetching} className="mt-10">
        {links.isPending ? (
          <ul aria-label="Loading links" className="divide-y border-y">
            {Array.from({ length: SKELETON_ROWS }, (_, row) => (
              <li key={row} className="flex items-center gap-6 py-5">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="hidden h-4 flex-1 md:block" />
                <Skeleton className="h-4 w-24" />
              </li>
            ))}
          </ul>
        ) : links.isError ? (
          <div role="alert" className="border-y py-10">
            <p className="font-semibold">Your links could not be loaded.</p>
            <p className="mt-1 text-muted-foreground">{links.error.message}</p>
            <Button variant="outline" className="mt-5" onClick={() => links.refetch()}>
              Try again
            </Button>
          </div>
        ) : total === 0 ? (
          <div className="border-y py-12">
            <p className="text-xl font-semibold">No links yet.</p>
            <p className="mt-2 max-w-prose text-muted-foreground">
              Paste a long URL into the form above and press Shorten. Your short link will appear
              here, ready to copy.
            </p>
            <Button
              className="mt-6"
              onClick={() => document.querySelector<HTMLInputElement>('input[name="url"]')?.focus()}
            >
              Make your first link
            </Button>
          </div>
        ) : (
          <>
            <ul
              aria-label="Your links"
              className={cn('-mx-4 divide-y border-y', links.isPlaceholderData && 'opacity-60')}
            >
              {links.data.items.map((link) => (
                <LinkRow key={link.id} link={link} isNew={link.id === newLinkId} />
              ))}
            </ul>
            {lastPage > FIRST_PAGE && (
              <nav aria-label="Pages" className="flex items-center justify-between gap-4 pt-5">
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
