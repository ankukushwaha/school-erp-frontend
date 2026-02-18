import { ROUTES } from '@/app/constants/routes'
import { getMenuForRole } from '@/app/constants/sidebarMenu'
import { useAppSelector } from '@/store/hooks'
import { NavLink } from 'react-router-dom'

export function SidebarNav() {
  const role = useAppSelector((state) => state.auth.role)
  const menuItems = getMenuForRole(role)

  return (
    <nav className="flex flex-col gap-2 text-sm">
      <NavLink to={ROUTES.dashboard} className="rounded px-2 py-1 hover:bg-muted">
        Dashboard
      </NavLink>
      {menuItems.map((item) => (
        <NavLink key={item.path} to={item.path} className="rounded px-2 py-1 hover:bg-muted">
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
