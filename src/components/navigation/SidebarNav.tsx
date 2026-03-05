import { ROUTES } from '@/app/constants/routes'
import { getMenuForRole } from '@/app/constants/sidebarMenu'
import { useMenusQuery } from '@/hooks/useMenusQuery'
import { useAppSelector } from '@/store/hooks'
import type { MenuItem } from '@/services/menus'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Bus,
  CalendarCheck,
  Clock,
  CreditCard,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  Library,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Settings,
  Shield,
  UserPlus,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const ICON_BY_KEYWORD: Array<{ keyword: string; icon: LucideIcon }> = [
  { keyword: 'dashboard', icon: LayoutDashboard },
  { keyword: 'student', icon: Users },
  { keyword: 'admission', icon: UserPlus },
  { keyword: 'academic', icon: BookOpen },
  { keyword: 'teacher', icon: Briefcase },
  { keyword: 'staff', icon: Briefcase },
  { keyword: 'attendance', icon: CalendarCheck },
  { keyword: 'exam', icon: FileText },
  { keyword: 'timetable', icon: Clock },
  { keyword: 'fee', icon: CreditCard },
  { keyword: 'event', icon: CalendarCheck },
  { keyword: 'library', icon: Library },
  { keyword: 'transport', icon: Bus },
  { keyword: 'communication', icon: MessageSquare },
  { keyword: 'hostel', icon: Home },
  { keyword: 'report', icon: FileSpreadsheet },
  { keyword: 'analytics', icon: BarChart3 },
  { keyword: 'setting', icon: Settings },
  { keyword: 'role', icon: Shield },
  { keyword: 'profile', icon: GraduationCap },
]

function getItemIcon(item: MenuItem): LucideIcon {
  const key = `${item.key ?? ''} ${item.label} ${item.path ?? ''} ${item.iconName ?? ''}`.toLowerCase()
  const match = ICON_BY_KEYWORD.find((entry) => key.includes(entry.keyword))
  return match ? match.icon : FileText
}

function hasActiveChild(item: MenuItem, pathname: string): boolean {
  return item.children.some((child) => {
    const isChildMatch = child.path ? pathname === child.path : false
    return isChildMatch || hasActiveChild(child, pathname)
  })
}

export function SidebarNav() {
  const location = useLocation()
  const role = useAppSelector((state) => state.auth.role)
  const { data: apiMenuItems = [], isLoading } = useMenusQuery(role)
  const fallbackMenuItems = getMenuForRole(role)
  const fallbackTree = useMemo<MenuItem[]>(
    () =>
      fallbackMenuItems.map((item, index) => ({
        id: index + 1,
        key: item.label.toUpperCase().replace(/\s+/g, '_'),
        label: item.label,
        path: item.path,
        iconName: null,
        displayOrder: index + 1,
        children: [],
      })),
    [fallbackMenuItems],
  )
  const menuItems = apiMenuItems.length > 0 ? apiMenuItems : fallbackTree
  const dashboardItem = useMemo(() => ({ label: 'Dashboard', path: ROUTES.dashboard }), [])
  const initialExpanded = useMemo(() => {
    const activeMenu = menuItems.find((item) => hasActiveChild(item, location.pathname))
    return activeMenu?.label ?? menuItems.find((item) => item.children.length > 0)?.label ?? null
  }, [location.pathname, menuItems])
  const [expandedMenu, setExpandedMenu] = useState<string | null>(initialExpanded)

  useEffect(() => {
    setExpandedMenu(initialExpanded)
  }, [initialExpanded])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/40 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">SchoolPro</h1>
        </div>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-2 text-sm">
        <NavLink
          to={dashboardItem.path}
          end
          className={({ isActive }) =>
            `group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-gray-600 hover:bg-white/50 hover:text-indigo-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'} />
              <span className="font-medium">{dashboardItem.label}</span>
            </>
          )}
        </NavLink>

        {isLoading ? (
          <p className="rounded-lg px-4 py-2 text-xs text-gray-500">Loading menu...</p>
        ) : null}

        {menuItems.map((item) => {
          const Icon = getItemIcon(item)
          const isPathActive = item.path ? location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) : false
          const isSubActive = hasActiveChild(item, location.pathname)
          const isActive = isPathActive || isSubActive
          const isExpanded = expandedMenu === item.label

          return (
            <div key={`${item.id ?? item.label}-${item.label}`}>
              {item.children.length > 0 || !item.path ? (
                <button
                  onClick={() => setExpandedMenu((prev) => (prev === item.label ? null : item.label))}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-white/50 hover:text-indigo-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-gray-600 hover:bg-white/50 hover:text-indigo-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'} />
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )}

              {item.children.length > 0 && isExpanded ? (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-indigo-100 pl-4">
                  {item.children.map((child) => {
                    const ChildIcon = getItemIcon(child)
                    const isChildActive = child.path ? location.pathname === child.path : false

                    return child.path ? (
                      <Link
                        key={`${child.id ?? child.label}-${child.label}`}
                        to={child.path}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                          isChildActive
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        <ChildIcon size={16} className={isChildActive ? 'text-white' : 'text-gray-400'} />
                        <span className="font-medium">{child.label}</span>
                      </Link>
                    ) : (
                      <div
                        key={`${child.id ?? child.label}-${child.label}`}
                        className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-400"
                      >
                        <ChildIcon size={16} className="text-gray-400" />
                        <span className="font-medium">{child.label}</span>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

    </div>
  )
}
