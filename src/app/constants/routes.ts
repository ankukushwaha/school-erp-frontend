export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  academicsOverview: '/academics/overview',
  academics: '/academics/academic-year',
  acedmicCalendar: '/academics/acedmic-calendar',
  classManagement: '/academics/classManagement',
  sectionManagement: '/academics/SectionManagement',
  subjectEntry: '/academics/subjectEntry',
  subjectMapping: '/academics/subject-mapping',
  students: '/students',
  fees: '/fees',
  setting: '/setting/SettingsPage',
  attendance: '/attendance',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
