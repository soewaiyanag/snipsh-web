import { request } from './client'
import type { CreateLinkInput, UpdateLinkInput } from './schemas'
import type { Link, Paginated } from './types'

// The API returns every link, newest first. Pages are cut here so nothing else needs to know.
export async function listLinks({ page, limit }: { page: number; limit: number }): Promise<Paginated<Link>> {
  const links = await request<Link[]>('/links')
  const start = (page - 1) * limit
  return { items: links.slice(start, start + limit), total: links.length, page, limit }
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
