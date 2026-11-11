import { http, HttpResponse, type JsonBodyType } from 'msw'
import { describe, expect, it } from 'vitest'
import { env } from '@/env'
import { getToken, setToken } from '@/features/auth/token'
import { server } from '@/mocks/server'
import { ApiRequestError, HTTP_STATUS, normalizeMessage, request } from './client'

const PATH = '/client-test'
const url = `${env.apiUrl}${PATH}`

function respondWith(status: number, body: JsonBodyType) {
  server.use(http.get(url, () => HttpResponse.json(body, { status })))
}

describe('normalizeMessage', () => {
  it("keeps NestJS's string message", () => {
    expect(normalizeMessage({ statusCode: 409, message: 'Slug already taken' })).toBe(
      'Slug already taken',
    )
  })

  it("joins class-validator's array of messages", () => {
    const body = { statusCode: 400, message: ['email must be an email', 'password is too short'] }
    expect(normalizeMessage(body)).toBe('email must be an email. password is too short')
  })

  it.each([null, undefined, 'not an object', {}, { message: '' }, { message: [] }, { message: 42 }])(
    'falls back to a generic message for %j',
    (body) => {
      expect(normalizeMessage(body)).toBe('Something went wrong. Please try again.')
    },
  )
})

describe('request', () => {
  it('throws an ApiRequestError carrying the status and the normalized message', async () => {
    respondWith(400, { statusCode: 400, message: ['url must be a URL address'], error: 'Bad Request' })

    const error = await request(PATH).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiRequestError)
    expect(error).toMatchObject({ status: 400, message: 'url must be a URL address' })
  })

  it('survives an error body that is not JSON', async () => {
    server.use(http.get(url, () => new HttpResponse('<html>Bad gateway</html>', { status: 502 })))

    await expect(request(PATH)).rejects.toMatchObject({
      status: 502,
      message: 'Something went wrong. Please try again.',
    })
  })

  it('reports a network failure with status 0', async () => {
    server.use(http.get(url, () => HttpResponse.error()))

    await expect(request(PATH)).rejects.toMatchObject({ status: 0 })
  })

  it('returns nothing for 204', async () => {
    server.use(http.get(url, () => new HttpResponse(null, { status: HTTP_STATUS.noContent })))

    await expect(request(PATH)).resolves.toBeUndefined()
  })

  it('sends the bearer token, and clears it when the API answers 401', async () => {
    setToken('a-token', 'someone@example.com')
    let sentHeader: string | null = null
    server.use(
      http.get(url, ({ request: sent }) => {
        sentHeader = sent.headers.get('Authorization')
        return HttpResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 })
      }),
    )

    await expect(request(PATH)).rejects.toMatchObject({ status: HTTP_STATUS.unauthorized })

    expect(sentHeader).toBe('Bearer a-token')
    expect(getToken()).toBeNull()
  })

  it('leaves the token alone when a public request answers 401', async () => {
    setToken('a-token', 'someone@example.com')
    respondWith(401, { statusCode: 401, message: 'Invalid email or password' })

    await expect(request(PATH, { authenticated: false })).rejects.toMatchObject({
      message: 'Invalid email or password',
    })

    expect(getToken()).toBe('a-token')
  })
})
