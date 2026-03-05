import { ROUTES } from '@/app/constants/routes'
import { getMenuForRole } from '@/app/constants/sidebarMenu'
import { useMenusQuery } from '@/hooks/useMenusQuery'
import { useAppSelector } from '@/store/hooks'
import { NavLink } from 'react-router-dom'

export function SidebarNav() {
  const role = useAppSelector((state) => state.auth.role)
  const { data: apiMenuItems = [], isLoading } = useMenusQuery(role)
  const fallbackMenuItems = getMenuForRole(role)
  const menuItems = apiMenuItems.length > 0 ? apiMenuItems : fallbackMenuItems

  return (
    <nav className="flex flex-col gap-2 text-sm">
      <NavLink to={ROUTES.dashboard} className="rounded px-2 py-1 hover:bg-muted">
        Dashboard
      </NavLink>
      {isLoading ? <p className="px-2 py-1 text-xs text-muted-foreground">Loading menu...</p> : null}
      {menuItems.map((item) => (
        <NavLink key={item.path} to={item.path} className="rounded px-2 py-1 hover:bg-muted">
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
