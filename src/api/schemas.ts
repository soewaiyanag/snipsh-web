import { z } from 'zod'
import { env } from '@/env'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 72
const URL_MAX_LENGTH = 2048
const SLUG_MIN_LENGTH = 3
const SLUG_MAX_LENGTH = 32
const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/
const SLUG_MESSAGE = `Use ${SLUG_MIN_LENGTH} to ${SLUG_MAX_LENGTH} letters, digits, "-" or "_"`
const PRODUCTION_HOST = 'snipsh.com'

const email = z.email('Enter a valid email address')

function isHttpUrl(value: string) {
  return URL.canParse(value) && /^https?:$/.test(new URL(value).protocol)
}

function isShortLink(value: string) {
  if (!URL.canParse(value)) return false
  const { host, hostname } = new URL(value)
  return (
    hostname === PRODUCTION_HOST ||
    hostname.endsWith(`.${PRODUCTION_HOST}`) ||
    host === new URL(env.shortDomain).host
  )
}

function isSlug(value: string) {
  return (
    value.length >= SLUG_MIN_LENGTH && value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value)
  )
}

export const urlSchema = z
  .string()
  .trim()
  .max(URL_MAX_LENGTH, `Keep the URL under ${URL_MAX_LENGTH} characters`)
  .refine(isHttpUrl, 'Enter a valid http:// or https:// URL')
  .refine((value) => !isShortLink(value), 'That is already a short link')

export const registerSchema = z.object({
  email,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
})

// What the create form holds: the slug is always a string, and empty means "generate one".
export const createLinkFormSchema = z.object({
  url: urlSchema,
  slug: z
    .string()
    .trim()
    .refine((value) => value === '' || isSlug(value), SLUG_MESSAGE),
})

// What the API accepts: the slug may also be left out.
export const createLinkSchema = createLinkFormSchema.partial({ slug: true })

export const updateLinkSchema = z.object({
  url: urlSchema,
  slug: z.string().trim().refine(isSlug, SLUG_MESSAGE),
})

export type Credentials = z.infer<typeof registerSchema>
export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>
