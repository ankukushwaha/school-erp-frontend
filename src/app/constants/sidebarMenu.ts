import { ROUTES } from '@/app/constants/routes'
import type { RoutePath } from '@/app/constants/routes'
import type { AuthenticatedRole, Role } from '@/types/auth'

export type SidebarItem = {
  label: string
  path: RoutePath
}

const ROLE_MENU: Record<AuthenticatedRole, SidebarItem[]> = {
  admin: [
    { label: 'Students', path: ROUTES.students },
    { label: 'Fees', path: ROUTES.fees },
    { label: 'Settings', path: ROUTES.settings },
  ],
  teacher: [
    { label: 'Students', path: ROUTES.students },
    { label: 'Attendance', path: ROUTES.attendance },
  ],
  student: [
    { label: 'Profile', path: ROUTES.profile },
    { label: 'Attendance', path: ROUTES.attendance },
  ],
}

export function getMenuForRole(role: Role): SidebarItem[] {
  if (!role) return []
  return ROLE_MENU[role]
}
