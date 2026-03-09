export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  academics: '/academics/academic-year',
  classManagement: '/academics/classManagement',
  sectionManagement: '/academics/SectionManagement',
  students: '/students',
  fees: '/fees',
  setting: '/setting/SettingsPage',
  attendance: '/attendance',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
