import { env } from '@/env'
import { clearToken, getToken } from '@/features/auth/token'
import type { ApiError } from './types'

export const HTTP_STATUS = {
  noContent: 204,
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
} as const

const NETWORK_ERROR_STATUS = 0
const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'
const NETWORK_MESSAGE = 'Could not reach the server. Check your connection and try again.'

export class ApiRequestError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export function isApiError(error: unknown, status: number): error is ApiRequestError {
  return error instanceof ApiRequestError && error.status === status
}

// NestJS sends a string; class-validator sends an array of strings.
export function normalizeMessage(body: unknown): string {
  const message = (body as Partial<ApiError> | null)?.message
  if (Array.isArray(message)) return message.join('. ') || FALLBACK_MESSAGE
  return typeof message === 'string' && message ? message : FALLBACK_MESSAGE
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  authenticated?: boolean
}

export async function request<T>(
  path: string,
  { method = 'GET', body, authenticated = true }: RequestOptions = {},
): Promise<T> {
  const token = authenticated ? getToken() : null
  const headers = new Headers()
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiRequestError(NETWORK_ERROR_STATUS, NETWORK_MESSAGE)
  }

  // Clearing the token flips the auth state, and the route guard sends the user to /login.
  if (authenticated && response.status === HTTP_STATUS.unauthorized) clearToken()

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null)
    throw new ApiRequestError(response.status, normalizeMessage(errorBody))
  }

  if (response.status === HTTP_STATUS.noContent) return undefined as T
  return (await response.json()) as T
}
