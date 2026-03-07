import type { ComponentType } from 'react'
import { AcademicYearPage } from '@/pages/academics/AcademicYearPage'
import { AttendancePage } from '@/pages/attendance/AttendancePage'
import { TemporaryModulePage } from '@/pages/common/TemporaryModulePage'
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
  '/acedmics/acedmicyear': AcademicYearPage,
  '/attendance': AttendancePage,
}

export function getComponentForRoute(path: string): ComponentType {
  return routeComponentMap[normalizeRoutePath(path)] ?? TemporaryModulePage
}

export function normalizeDynamicRoutePath(path: string): string {
  return normalizeRoutePath(path)
}
