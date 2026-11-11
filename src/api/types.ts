export type User = { id: string; email: string; createdAt: string }

export type AuthToken = { accessToken: string }

export type Link = {
  id: string
  slug: string
  url: string
  createdAt: string
  isActive?: boolean
  expiresAt?: string | null
}

export type Paginated<T> = { items: T[]; total: number; page: number; limit: number }

export type LinkStats = {
  total: number
  perDay: { date: string; count: number }[]
  topReferrers: { referrer: string; count: number }[]
}

export type ApiError = { statusCode: number; message: string | string[]; error?: string }
