import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { shortLinkLabel, shortLinkUrl } from '@/lib/short-link'

const COPIED_FEEDBACK_MS = 1600

type CopyButtonProps = { slug: string; variant?: 'secondary' | 'default' }

export function CopyButton({ slug, variant = 'secondary' }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(shortLinkUrl(slug))
      toast.success('Copied', { description: shortLinkLabel(slug) })
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      toast.error('Could not copy. Select the link and copy it by hand.')
    }
  }

  return (
    // A fixed minimum width keeps the row still while the label changes.
    <Button variant={variant} onClick={copy} aria-label={`Copy ${shortLinkLabel(slug)}`} className="min-w-24">
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      {isCopied ? 'Copied' : 'Copy'}
    </Button>
  )
}
