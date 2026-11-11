import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import type { Link } from '@/api/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { shortLinkLabel } from '@/lib/short-link'
import { useDeleteLink } from './queries'

type DeleteLinkButtonProps = { link: Link; onDeleted?: () => void; iconOnly?: boolean }

export function DeleteLinkButton({ link, onDeleted, iconOnly }: DeleteLinkButtonProps) {
  const deleteLink = useDeleteLink()
  const label = shortLinkLabel(link.slug)

  function confirmDelete() {
    deleteLink.mutate(link.id, {
      onSuccess: () => {
        toast.success('Link deleted', { description: label })
        onDeleted?.()
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? 'icon' : 'default'}
          disabled={deleteLink.isPending}
          aria-label={`Delete ${label}`}
          title={iconOnly ? 'Delete' : undefined}
          className="hover:bg-destructive/15 hover:text-destructive"
        >
          {iconOnly ? <Trash2Icon /> : deleteLink.isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this link?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="link-text font-semibold text-foreground">{label}</span> will stop
            working and its click history will be lost. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep link</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmDelete}>
            Delete link
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
