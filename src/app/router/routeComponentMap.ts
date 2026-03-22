import type { ComponentType } from 'react'
import { AcademicsOverviewPage } from '@/pages/academics/AcademicsOverviewPage'
import { AcademicYearPage } from '@/pages/academics/AcademicYearPage'
import { AcedmicCalendarPage } from '@/pages/academics/AcedmicCalendarPage'
import { ClassManagementPage } from '@/pages/academics/ClassManagementPage'
import { SectionManagementPage } from '@/pages/academics/SectionManagementPage'
import { SubjectMasterPage } from '@/pages/academics/SubjectMasterPage'
import { SubjectMappingPage } from '@/pages/academics/SubjectMappingPage'
import {AdmissionDashboard} from '@/pages/admission/AdmissionDashboard'
import {AdmissionsOverviewPage} from '@/pages/admission/AdmissionOverview'
import {EnquiryFormPage} from '@/pages/admission/EnquiryFormPage'
import {EnquiryListPage} from '@/pages/admission/EnquiryListPage'
import {StudentRegistrationFormPage} from '@/pages/admission/StudentRegistration'
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
  '/academics/overview': AcademicsOverviewPage,
  '/academics/academic-year': AcademicYearPage,
  '/academics/calendar': AcedmicCalendarPage,
  '/academics/classManagement': ClassManagementPage,
  '/academics/sectionManagement': SectionManagementPage,
  '/academics/subjectentry': SubjectMasterPage,
  '/academics/subject-mapping': SubjectMappingPage,
  '/admission/dashboard': AdmissionDashboard,
  '/admission/overview': AdmissionsOverviewPage,
  '/admission/enquiry-form': EnquiryFormPage,
  '/admission/enquiries-list': EnquiryListPage,
  '/admission/student-registration': StudentRegistrationFormPage,
  '/attendance': AttendancePage,
  '/setting/SettingsPage': SettingsPage,
}

export function getComponentForRoute(path: string): ComponentType {
  return routeComponentMap[normalizeRoutePath(path)] ?? TemporaryModulePage
}

export function normalizeDynamicRoutePath(path: string): string {
  return normalizeRoutePath(path)
}
