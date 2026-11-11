import { request } from './client'
import type { CreateLinkInput, UpdateLinkInput } from './schemas'
import type { Link, Paginated } from './types'

export function listLinks({ page, limit }: { page: number; limit: number }) {
  return request<Paginated<Link>>(`/links?page=${page}&limit=${limit}`)
}

export function createLink(input: CreateLinkInput) {
  return request<Link>('/links', { method: 'POST', body: input })
}

export function getLink(id: string) {
  return request<Link>(`/links/${encodeURIComponent(id)}`)
}

export function updateLink(id: string, input: Partial<UpdateLinkInput>) {
  return request<Link>(`/links/${encodeURIComponent(id)}`, { method: 'PATCH', body: input })
}

export function deleteLink(id: string) {
  return request<void>(`/links/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
