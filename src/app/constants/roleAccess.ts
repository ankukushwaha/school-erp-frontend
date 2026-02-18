import type { AuthenticatedRole } from '@/types/auth'

export const ADMIN_ONLY: ReadonlyArray<AuthenticatedRole> = ['admin']
export const TEACHER_OR_ADMIN: ReadonlyArray<AuthenticatedRole> = ['teacher', 'admin']
export const STUDENT_ONLY: ReadonlyArray<AuthenticatedRole> = ['student']
export const STUDENT_OR_TEACHER: ReadonlyArray<AuthenticatedRole> = ['student', 'teacher']
