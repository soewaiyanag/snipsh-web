import { env } from '@/env'

export function shortLinkUrl(slug: string) {
  return `${env.shortDomain}/${slug}`
}

// What people read and say: the short link without its scheme.
export function shortLinkLabel(slug: string) {
  return shortLinkUrl(slug).replace(/^https?:\/\//, '')
}

export const SHORT_LINK_PREFIX = shortLinkLabel('')

const RANDOM_SLUG_LENGTH = 5
const SLUG_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function randomSlug() {
  return Array.from(
    { length: RANDOM_SLUG_LENGTH },
    () => SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)],
  ).join('')
}
