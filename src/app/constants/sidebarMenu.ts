import { ROUTES } from '@/app/constants/routes'
import type { RoutePath } from '@/app/constants/routes'
import type { AuthenticatedRole, Role } from '@/types/auth'

export type SidebarItem = {
  label: string
  path: RoutePath
}

export const ROLE_MENU: Record<AuthenticatedRole, { id: number; items: SidebarItem[] }> = {
  admin: {
    id: 1,
    items: [
      { label: 'Academics', path: ROUTES.academics },
      { label: 'Students', path: ROUTES.students },
      { label: 'Fees', path: ROUTES.fees },
      { label: 'Settings', path: ROUTES.settings },
    ],
  },
  teacher: {
    id: 2,
    items: [
      { label: 'Academics', path: ROUTES.academics },
      { label: 'Students', path: ROUTES.students },
      { label: 'Attendance', path: ROUTES.attendance },
    ],
  },
  student: {
    id: 3,
    items: [
      { label: 'Profile', path: ROUTES.profile },
      { label: 'Attendance', path: ROUTES.attendance },
    ],
  },
}

export function getMenuForRole(role: Role): SidebarItem[] {
  if (!role) return []
  return ROLE_MENU[role].items
}
