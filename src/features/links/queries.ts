import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLink, deleteLink, getLink, listLinks, updateLink } from '@/api/links'
import type { UpdateLinkInput } from '@/api/schemas'
import { getLinkStats } from '@/api/stats'

export const LINKS_PAGE_SIZE = 20

export const linkKeys = {
  lists: ['links', 'list'] as const,
  list: (page: number) => [...linkKeys.lists, page] as const,
  detail: (id: string) => ['links', 'detail', id] as const,
  stats: (id: string) => [...linkKeys.detail(id), 'stats'] as const,
}

export function useLinks(page: number) {
  return useQuery({
    queryKey: linkKeys.list(page),
    queryFn: () => listLinks({ page, limit: LINKS_PAGE_SIZE }),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })
}

export function useLink(id: string) {
  return useQuery({ queryKey: linkKeys.detail(id), queryFn: () => getLink(id) })
}

export function useLinkStats(id: string) {
  return useQuery({ queryKey: linkKeys.stats(id), queryFn: () => getLinkStats(id) })
}

export function useCreateLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linkKeys.lists }),
  })
}

export function useUpdateLink(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateLinkInput) => updateLink(id, input),
    onSuccess: (link) => {
      queryClient.setQueryData(linkKeys.detail(id), link)
      return queryClient.invalidateQueries({ queryKey: linkKeys.lists })
    },
  })
}

export function useDeleteLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLink,
    onSuccess: (_, id) => {
      // Removed, not invalidated: refetching a deleted link would only produce a 404.
      queryClient.removeQueries({ queryKey: linkKeys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: linkKeys.lists })
    },
  })
}
