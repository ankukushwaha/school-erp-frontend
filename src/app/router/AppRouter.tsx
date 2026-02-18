import { ADMIN_ONLY, STUDENT_ONLY, STUDENT_OR_TEACHER, TEACHER_OR_ADMIN } from '@/app/constants/roleAccess'
import { ROUTES } from '@/app/constants/routes'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AttendancePage } from '@/pages/attendance/AttendancePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { FeesPage } from '@/pages/fees/FeesPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { StudentsPage } from '@/pages/student/StudentsPage'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { Navigate, BrowserRouter, Route, Routes } from 'react-router-dom'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route element={<ProtectedRoute allowedRoles={TEACHER_OR_ADMIN} />}>
              <Route path={ROUTES.students} element={<StudentsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={ADMIN_ONLY} />}>
              <Route path={ROUTES.fees} element={<FeesPage />} />
              <Route path={ROUTES.settings} element={<SettingsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={STUDENT_OR_TEACHER} />}>
              <Route path={ROUTES.attendance} element={<AttendancePage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={STUDENT_ONLY} />}>
              <Route path={ROUTES.profile} element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
