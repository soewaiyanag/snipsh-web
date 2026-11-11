import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { HTTP_STATUS, isApiError } from '@/api/client'
import { updateLinkSchema } from '@/api/schemas'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LinkStats } from '@/features/stats/LinkStats'
import { formatDate } from '@/lib/format'
import { SHORT_LINK_PREFIX } from '@/lib/short-link'
import { CopyButton } from './CopyButton'
import { DeleteLinkButton } from './DeleteLinkButton'
import { LinkForm } from './LinkForm'
import { LinkStatus } from './LinkStatus'
import { useLink, useUpdateLink } from './queries'

export function LinkDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const link = useLink(id)
  const updateLink = useUpdateLink(id)
  const [isEditing, setIsEditing] = useState(false)

  if (link.isPending) {
    return (
      <div aria-label="Loading link" className="grid gap-4 pt-6 sm:pt-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (link.isError) {
    const isMissing = isApiError(link.error, HTTP_STATUS.notFound)
    return (
      <div role="alert" className="pt-6 sm:pt-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isMissing ? 'This link does not exist' : 'This link could not be loaded'}
        </h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          {isMissing
            ? 'It may have been deleted, or it may belong to another account.'
            : link.error.message}
        </p>
        <div className="mt-6 flex gap-2">
          {!isMissing && (
            <Button variant="outline" onClick={() => link.refetch()}>
              Try again
            </Button>
          )}
          <Button asChild>
            <RouterLink to="/links">Back to your links</RouterLink>
          </Button>
        </div>
      </div>
    )
  }

  const { data } = link

  return (
    <div className="pt-6 sm:pt-10">
      <RouterLink to="/links" className="rounded-sm text-sm text-muted-foreground underline hover:text-foreground">
        All links
      </RouterLink>

      <header className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="link-text text-2xl font-bold sm:text-3xl">
            <span className="font-normal text-muted-foreground">{SHORT_LINK_PREFIX}</span>
            {data.slug}
          </h1>
          <LinkStatus link={data} />
        </div>
        <div className="flex items-center gap-1">
          <CopyButton slug={data.slug} />
          <Button variant="ghost" onClick={() => setIsEditing(true)} disabled={isEditing}>
            Edit
          </Button>
          <DeleteLinkButton link={data} onDeleted={() => navigate('/links')} />
        </div>
      </header>

      {isEditing ? (
        <section aria-label="Edit link" className="sheet mt-6 p-5">
          <LinkForm
            schema={updateLinkSchema}
            defaultValues={{ url: data.url, slug: data.slug }}
            submitLabel="Save"
            submittingLabel="Saving…"
            slugLabel="Slug"
            onCancel={() => setIsEditing(false)}
            onSubmit={async (values) => {
              await updateLink.mutateAsync(values)
              toast.success('Link saved')
              setIsEditing(false)
            }}
          />
        </section>
      ) : (
        <dl className="mt-6 grid gap-x-10 gap-y-4 border-y py-5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <dt className="text-sm text-muted-foreground">Goes to</dt>
            <dd className="mt-1">
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="link-text rounded-sm underline hover:no-underline"
              >
                {data.url}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Created</dt>
            <dd className="mt-1 tabular-nums">{formatDate(data.createdAt)}</dd>
          </div>
        </dl>
      )}

      <LinkStats id={data.id} slug={data.slug} />
    </div>
  )
}
