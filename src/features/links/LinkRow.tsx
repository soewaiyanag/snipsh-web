import { useState } from 'react'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'
import { updateLinkSchema } from '@/api/schemas'
import type { Link } from '@/api/types'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { shortLinkLabel } from '@/lib/short-link'
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
      <li className="py-5">
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
        'grid gap-x-6 gap-y-2 py-4 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto_auto] md:items-center',
        isNew && 'animate-settle',
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <RouterLink
          to={`/links/${link.id}`}
          className="link-text rounded-sm text-lg font-bold hover:underline"
        >
          {label}
        </RouterLink>
        <LinkStatus link={link} />
      </div>
      <p className="link-text truncate text-sm text-muted-foreground" title={link.url}>
        {link.url}
      </p>
      <p className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
        {formatDate(link.createdAt)}
      </p>
      <div className="flex items-center gap-1">
        <CopyButton slug={link.slug} />
        <Button variant="ghost" onClick={() => setIsEditing(true)} aria-label={`Edit ${label}`}>
          Edit
        </Button>
        <DeleteLinkButton link={link} />
      </div>
    </li>
  )
}
