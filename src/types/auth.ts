export type Role = 'admin' | 'student' | 'teacher' | null
export type AuthenticatedRole = Exclude<Role, null>

export type User = {
  id: string
  name: string
  email: string
}

export const AUTHENTICATED_ROLES: ReadonlyArray<AuthenticatedRole> = ['admin', 'teacher', 'student']

export function isAuthenticatedRole(value: string): value is AuthenticatedRole {
  return AUTHENTICATED_ROLES.some((role) => role === value)
}
