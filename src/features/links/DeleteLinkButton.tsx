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

export function DeleteLinkButton({ link, onDeleted }: { link: Link; onDeleted?: () => void }) {
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
        <Button variant="ghost" disabled={deleteLink.isPending} aria-label={`Delete ${label}`}>
          {deleteLink.isPending ? 'Deleting…' : 'Delete'}
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
