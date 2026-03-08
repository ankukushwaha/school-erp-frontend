import type { ComponentType } from 'react'
import { AcademicYearPage } from '@/pages/academics/AcademicYearPage'
import { ClassManagementPage } from '@/pages/academics/ClassManagementPage'
import { AttendancePage } from '@/pages/attendance/AttendancePage'
import { TemporaryModulePage } from '@/pages/common/TemporaryModulePage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { StudentsPage } from '@/pages/student/StudentsPage'

function normalizeRoutePath(path: string): string {
  const trimmed = path.trim().toLowerCase()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '') || '/'
}

export const routeComponentMap: Record<string, ComponentType> = {
  '/students': StudentsPage,
  '/students/list': StudentsPage,
  '/students/diary': TemporaryModulePage,
  '/students/other-details': TemporaryModulePage,
  '/academics': AcademicYearPage,
  '/academics/academic-year': AcademicYearPage,
  '/academics/classmanagement': ClassManagementPage,
  '/academics/class-management': ClassManagementPage,
  '/academics/classes': ClassManagementPage,
  '/attendance': AttendancePage,
  '/setting': SettingsPage,
  '/setting/settingspage': SettingsPage,
  '/settings': SettingsPage,
}

export function getComponentForRoute(path: string): ComponentType {
  return routeComponentMap[normalizeRoutePath(path)] ?? TemporaryModulePage
}

export function normalizeDynamicRoutePath(path: string): string {
  return normalizeRoutePath(path)
}
