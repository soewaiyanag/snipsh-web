import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'
import { updateLinkSchema } from '@/api/schemas'
import type { Link } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { PencilIcon } from 'lucide-react'
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
      <li className="px-4 py-5">
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
        'grid gap-x-6 gap-y-2 px-4 py-4 transition-colors hover:bg-card md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto_auto] md:items-center',
        isNew && 'animate-settle',
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
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
      <p className="link-text truncate text-sm text-muted-foreground" title={link.url}>
        {link.url}
      </p>
      <p className="text-sm whitespace-nowrap text-muted-foreground tabular-nums md:w-28 md:text-right">
        {formatDate(link.createdAt)}
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
    </li>
  )
}
