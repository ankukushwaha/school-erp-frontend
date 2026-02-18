export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  students: '/students',
  fees: '/fees',
  settings: '/settings',
  attendance: '/attendance',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
