import { delay, http, HttpResponse } from 'msw'
import type { z } from 'zod'
import { HTTP_STATUS } from '@/api/client'
import { createLinkSchema, loginSchema, registerSchema, updateLinkSchema } from '@/api/schemas'
import type { ApiError, AuthToken, Link, Paginated } from '@/api/types'
import { env } from '@/env'
import { randomSlug } from '@/lib/short-link'
import { db, EMPTY_STATS } from './db'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const STATUS = { ...HTTP_STATUS, created: 201, found: 302, badRequest: 400 } as const

const api = (path: string) => `${env.apiUrl}${path}`

function errorResponse(statusCode: number, message: string | string[], error: string) {
  return HttpResponse.json({ statusCode, message, error } satisfies ApiError, { status: statusCode })
}

const unauthorized = () => errorResponse(STATUS.unauthorized, 'Unauthorized', 'Unauthorized')
const linkNotFound = () => errorResponse(STATUS.notFound, 'Link not found', 'Not Found')
const slugTaken = () => errorResponse(STATUS.conflict, 'Slug already taken', 'Conflict')

const tokenFor = (userId: string) => `mock-token-${userId}`

function authenticate(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '')
  return db.users.find(({ user }) => tokenFor(user.id) === token)?.user
}

// Mirrors class-validator: a 400 with an array of messages.
async function parseBody<T>(request: Request, schema: z.ZodType<T>) {
  const result = schema.safeParse(await request.json().catch(() => null))
  if (result.success) return { data: result.data }
  const messages = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
  return { error: errorResponse(STATUS.badRequest, messages, 'Bad Request') }
}

function findOwnLink(request: Request, id: unknown) {
  const user = authenticate(request)
  if (!user) return { error: unauthorized() }
  const stored = db.links.find(({ userId, link }) => userId === user.id && link.id === id)
  return stored ? { stored } : { error: linkNotFound() }
}

function isSlugTaken(slug: string, exceptId?: string) {
  return db.links.some(({ link }) => link.slug === slug && link.id !== exceptId)
}

function generateSlug() {
  let slug: string
  do {
    slug = randomSlug()
  } while (isSlugTaken(slug))
  return slug
}

export const handlers = [
  http.post(api('/auth/register'), async ({ request }) => {
    await delay()
    const { data, error } = await parseBody(request, registerSchema)
    if (error) return error
    if (db.users.some(({ user }) => user.email === data.email)) {
      return errorResponse(STATUS.conflict, 'Email already in use', 'Conflict')
    }
    const user = { id: crypto.randomUUID(), email: data.email, createdAt: new Date().toISOString() }
    db.users.push({ user, password: data.password })
    return HttpResponse.json(user, { status: STATUS.created })
  }),

  http.post(api('/auth/login'), async ({ request }) => {
    await delay()
    const { data, error } = await parseBody(request, loginSchema)
    const found = db.users.find(
      ({ user, password }) => user.email === data?.email && password === data.password,
    )
    if (error || !found) {
      return errorResponse(STATUS.unauthorized, 'Invalid email or password', 'Unauthorized')
    }
    return HttpResponse.json({ accessToken: tokenFor(found.user.id) } satisfies AuthToken)
  }),

  http.get(api('/links'), async ({ request }) => {
    await delay()
    const user = authenticate(request)
    if (!user) return unauthorized()
    const params = new URL(request.url).searchParams
    const page = Math.max(DEFAULT_PAGE, Number(params.get('page')) || DEFAULT_PAGE)
    const limit = Math.max(1, Number(params.get('limit')) || DEFAULT_LIMIT)
    const own = db.links.filter(({ userId }) => userId === user.id).map(({ link }) => link)
    const start = (page - 1) * limit
    return HttpResponse.json({
      items: own.slice(start, start + limit),
      total: own.length,
      page,
      limit,
    } satisfies Paginated<Link>)
  }),

  http.post(api('/links'), async ({ request }) => {
    await delay()
    const user = authenticate(request)
    if (!user) return unauthorized()
    const { data, error } = await parseBody(request, createLinkSchema)
    if (error) return error
    if (data.slug && isSlugTaken(data.slug)) return slugTaken()
    const link: Link = {
      id: crypto.randomUUID(),
      slug: data.slug || generateSlug(),
      url: data.url,
      createdAt: new Date().toISOString(),
    }
    db.links.unshift({ userId: user.id, link })
    return HttpResponse.json(link, { status: STATUS.created })
  }),

  http.get(api('/links/:id'), async ({ request, params }) => {
    await delay()
    const { stored, error } = findOwnLink(request, params.id)
    return error ?? HttpResponse.json(stored.link)
  }),

  http.patch(api('/links/:id'), async ({ request, params }) => {
    await delay()
    const { stored, error } = findOwnLink(request, params.id)
    if (error) return error
    const body = await parseBody(request, updateLinkSchema.partial())
    if (body.error) return body.error
    if (body.data.slug && isSlugTaken(body.data.slug, stored.link.id)) return slugTaken()
    Object.assign(stored.link, body.data)
    return HttpResponse.json(stored.link)
  }),

  http.delete(api('/links/:id'), async ({ request, params }) => {
    await delay()
    const { stored, error } = findOwnLink(request, params.id)
    if (error) return error
    db.links.splice(db.links.indexOf(stored), 1)
    db.stats.delete(stored.link.id)
    return new HttpResponse(null, { status: STATUS.noContent })
  }),

  http.get(api('/links/:id/stats'), async ({ request, params }) => {
    await delay()
    const { stored, error } = findOwnLink(request, params.id)
    return error ?? HttpResponse.json(db.stats.get(stored.link.id) ?? EMPTY_STATS)
  }),

  // Last, so it does not shadow GET /links. The app never calls it.
  http.get(api('/:slug'), ({ params }) => {
    const stored = db.links.find(({ link }) => link.slug === params.slug)
    if (!stored) return errorResponse(STATUS.notFound, 'Short link not found', 'Not Found')
    return new HttpResponse(null, { status: STATUS.found, headers: { Location: stored.link.url } })
  }),
]
