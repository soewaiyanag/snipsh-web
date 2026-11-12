import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'
import { updateLinkSchema } from '@/api/schemas'
import type { Link } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatDate, formatRelative } from '@/lib/format'
import { SHORT_LINK_PREFIX, shortLinkLabel } from '@/lib/short-link'
import { cn } from '@/lib/utils'
import { CopyButton } from './CopyButton'
import { DeleteLinkButton } from './DeleteLinkButton'
import { LinkForm } from './LinkForm'
import { LinkStatus } from './LinkStatus'
import { useUpdateLink } from './queries'

export function LinkRow({ link, isNew }: { link: Link; isNew: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const updateLink = useUpdateLink(link.id)
  const label = shortLinkLabel(link.slug)

  if (isEditing) {
    return (
      <li className="rounded-xl bg-card p-5">
        <LinkForm
          schema={updateLinkSchema}
          defaultValues={{ url: link.url, slug: link.slug }}
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
      </li>
    )
  }

  return (
    <li
      className={cn(
        'grid grid-cols-[minmax(0,1fr)] gap-y-2 rounded-xl px-4 py-4 transition-colors focus-within:bg-card hover:bg-card sm:flex sm:flex-wrap sm:items-center sm:gap-x-4',
        isNew && 'animate-settle',
      )}
    >
      <div className="min-w-0 sm:flex-1 sm:basis-64">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RouterLink
            to={`/links/${link.id}`}
            className="link-text rounded-sm text-lg font-bold hover:underline"
          >
            {/* The domain is the same on every row, so it steps back and the slug leads. */}
            <span className="font-normal text-muted-foreground">{SHORT_LINK_PREFIX}</span>
            {link.slug}
          </RouterLink>
          <LinkStatus link={link} />
        </div>
        <p className="link-text mt-0.5 truncate text-sm text-muted-foreground" title={link.url}>
          <span className="sr-only">Goes to </span>
          {link.url}
        </p>
      </div>
      {/* Below sm the date and the actions share one line under the link. */}
      <div className="flex items-center justify-between gap-3 sm:contents">
        <p
          className="text-sm whitespace-nowrap text-muted-foreground"
          title={formatDate(link.createdAt)}
        >
          <span className="sr-only">Made </span>
          {formatRelative(link.createdAt)}
        </p>
        <div className="flex items-center gap-1">
          <CopyButton slug={link.slug} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${label}`}
            title="Edit"
          >
            <PencilIcon />
          </Button>
          <DeleteLinkButton link={link} iconOnly />
        </div>
      </div>
    </li>
  )
}
