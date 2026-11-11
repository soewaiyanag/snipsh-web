import { request } from './client'
import type { LinkStats } from './types'

export function getLinkStats(id: string) {
  return request<LinkStats>(`/links/${encodeURIComponent(id)}/stats`)
}
