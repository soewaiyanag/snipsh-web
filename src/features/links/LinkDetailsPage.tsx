import { ArrowLeftIcon, PencilIcon } from 'lucide-react'
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
      <div aria-label="Loading link" className="mx-auto grid max-w-3xl gap-4 pt-6 sm:pt-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (link.isError) {
    const isMissing = isApiError(link.error, HTTP_STATUS.notFound)
    return (
      <div role="alert" className="mx-auto max-w-3xl pt-6 sm:pt-10">
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
    <div className="mx-auto max-w-3xl pt-6 sm:pt-10">
      <Button asChild variant="ghost" className="-ml-4 text-muted-foreground">
        <RouterLink to="/links">
          <ArrowLeftIcon />
          All links
        </RouterLink>
      </Button>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="link-text text-3xl font-bold sm:text-4xl">
          <span className="font-normal text-muted-foreground">{SHORT_LINK_PREFIX}</span>
          {data.slug}
        </h1>
        <LinkStatus link={data} />
      </div>

      {isEditing ? (
        <section aria-label="Edit link" className="mt-6 rounded-xl bg-card p-5">
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
        <>
          <p className="mt-3 text-muted-foreground">
            Goes to{' '}
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="link-text rounded-sm text-foreground underline hover:no-underline"
            >
              {data.url}
            </a>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Made {formatDate(data.createdAt)}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <CopyButton slug={data.slug} variant="default" />
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <PencilIcon />
              Edit
            </Button>
            <DeleteLinkButton link={data} onDeleted={() => navigate('/links')} />
          </div>
        </>
      )}

      <LinkStats id={data.id} slug={data.slug} />
    </div>
  )
}
