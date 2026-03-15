import { ROUTES } from '@/app/constants/routes'
import { getComponentForRoute, normalizeDynamicRoutePath } from '@/app/router/routeComponentMap'
import { useMenusQuery } from '@/hooks/useMenusQuery'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AcademicYearPage } from '@/pages/academics/AcademicYearPage'
import { AcedmicCalendarPage } from '@/pages/academics/AcedmicCalendarPage'
import { ClassManagementPage } from '@/pages/academics/ClassManagementPage'
import { SectionManagementPage } from '@/pages/academics/SectionManagementPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { TemporaryModulePage } from '@/pages/common/TemporaryModulePage'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import type { MenuItem } from '@/services/menus'
import { useAppSelector } from '@/store/hooks'
import { useMemo } from 'react'
import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom'

function collectRoutePaths(paths: Set<string>, items: MenuItem[]) {
  items.forEach((item) => {
    if (item.path) {
      paths.add(normalizeDynamicRoutePath(item.path))
    }
    if (item.children.length > 0) {
      collectRoutePaths(paths, item.children)
    }
  })
}

export function AppRouter() {
  const role = useAppSelector((state) => state.auth.role)
  const { data: menuItems = [] } = useMenusQuery(role)

  const dynamicRoutePaths = useMemo(() => {
    const paths = new Set<string>()
    collectRoutePaths(paths, menuItems)
    return [...paths].filter(
      (path) =>
        path !== ROUTES.dashboard &&
        path !== ROUTES.login &&
        path !== ROUTES.profile &&
        path !== ROUTES.setting &&
        path !== ROUTES.acedmicCalendar &&
        path !== ROUTES.classManagement &&
        path !== ROUTES.sectionManagement 
    )
  }, [menuItems])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.academics} element={<AcademicYearPage />} />
            <Route path={ROUTES.acedmicCalendar} element={<AcedmicCalendarPage />} />
            <Route path={ROUTES.classManagement} element={<ClassManagementPage />} />
            <Route path={ROUTES.sectionManagement} element={<SectionManagementPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
            <Route path={ROUTES.setting} element={<SettingsPage />} />
            {dynamicRoutePaths.map((path) => {
              const DynamicComponent = getComponentForRoute(path)
              return <Route key={path} path={path} element={<DynamicComponent />} />
            })}
            <Route path="*" element={<TemporaryModulePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
