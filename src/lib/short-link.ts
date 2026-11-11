import { env } from '@/env'

export function shortLinkUrl(slug: string) {
  return `${env.shortDomain}/${slug}`
}

// What people read and say: the short link without its scheme.
export function shortLinkLabel(slug: string) {
  return shortLinkUrl(slug).replace(/^https?:\/\//, '')
}

export const SHORT_LINK_PREFIX = shortLinkLabel('')
