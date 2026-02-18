import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <Outlet />
      </div>
    </main>
  )
}
