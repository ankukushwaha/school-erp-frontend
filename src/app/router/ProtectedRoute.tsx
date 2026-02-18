import { ROUTES } from '@/app/constants/routes'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import type { AuthenticatedRole } from '@/types/auth'

type ProtectedRouteProps = {
  allowedRoles?: ReadonlyArray<AuthenticatedRole>
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = useAppSelector((state) => state.auth.token)
  const role = useAppSelector((state) => state.auth.role)
  const location = useLocation()

  if (!token) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <Outlet />
}
