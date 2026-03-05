import { useQuery } from '@tanstack/react-query'
import { getMenus } from '@/services/menus'
import type { AuthenticatedRole } from '@/types/auth'

export function useMenusQuery(role: AuthenticatedRole | null) {
  return useQuery({
    queryKey: ['menus', role],
    queryFn: () => getMenus(role),
    enabled: !!role,
  })
}

