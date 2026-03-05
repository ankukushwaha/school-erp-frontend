import { Header } from '@/components/Header'
import { SidebarNav } from '@/components/navigation/SidebarNav'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onToggleSidebar={() => dispatch(toggleSidebar())} />

      {sidebarOpen ? <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => dispatch(toggleSidebar())} /> : null}

      <div className="flex w-full gap-4 px-4 pb-4">
        <aside
          className={`fixed left-4 top-24 z-40 h-[calc(100vh-7rem)] w-64 shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <SidebarNav />
        </aside>

        <section className="flex-1 rounded-lg border border-border bg-card p-4 text-card-foreground">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
