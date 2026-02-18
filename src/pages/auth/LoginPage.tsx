import { ROUTES } from '@/app/constants/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { isAuthenticatedRole, type AuthenticatedRole } from '@/types/auth'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAppSelector((state) => state.auth.token)
  const [name, setName] = useState('Alex Student')
  const [email, setEmail] = useState('alex@student.com')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AuthenticatedRole>('student')

  const fromPath = location.state?.from?.pathname ?? ROUTES.dashboard

  if (token) {
    return <Navigate to={fromPath} replace />
  }

  const handleRoleChange = (value: string) => {
    if (isAuthenticatedRole(value)) {
      setRole(value)
    }
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    dispatch(
      login({
        user: {
          id: 'u-101',
          name,
          email,
        },
        token: `fake-token-${Date.now()}`,
        role,
      }),
    )

    navigate(fromPath, { replace: true })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate-600">Enter demo credentials to access protected routes.</p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Any value for demo"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </div>
  )
}
