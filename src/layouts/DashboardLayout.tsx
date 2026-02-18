import { ROUTES } from '@/app/constants/routes'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/navigation/SidebarNav'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { toggleSidebar, toggleTheme } from '@/store/slices/uiSlice'
import { Outlet, useNavigate } from 'react-router-dom'

export function DashboardLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { sidebarOpen, theme } = useAppSelector((state) => state.ui)
  const { user, role } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 text-card-foreground">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => dispatch(toggleSidebar())}>
            Toggle Sidebar
          </Button>
          <p className="text-sm text-muted-foreground">
            Welcome, {user?.name ?? 'User'} ({role ?? '-'})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => dispatch(toggleTheme())}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-4 p-4">
        {sidebarOpen ? (
          <aside className="w-64 rounded-lg border border-border bg-card p-3 text-card-foreground">
            <SidebarNav />
          </aside>
        ) : null}

        <section className="flex-1 rounded-lg border border-border bg-card p-4 text-card-foreground">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
