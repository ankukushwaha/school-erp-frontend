export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  academics: '/academics',
  classManagement: '/academics/class-management',
  students: '/students',
  fees: '/fees',
  setting: '/setting',
  attendance: '/attendance',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
