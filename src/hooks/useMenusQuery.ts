import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/services/menus'
import type { AuthenticatedRole } from '@/types/auth'

export function useMenusQuery(role: AuthenticatedRole | null) {
  return useQuery({
    queryKey: ['menus', role],
    queryFn: () => getMenus(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

