import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { shortLinkLabel, shortLinkUrl } from '@/lib/short-link'

export function CopyButton({ slug }: { slug: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(shortLinkUrl(slug))
      toast.success('Copied', { description: shortLinkLabel(slug) })
    } catch {
      toast.error('Could not copy. Select the link and copy it by hand.')
    }
  }

  return (
    <Button variant="secondary" onClick={copy} aria-label={`Copy ${shortLinkLabel(slug)}`}>
      Copy
    </Button>
  )
}
