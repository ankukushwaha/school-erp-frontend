import { Header } from '@/components/Header'
import { SidebarNav } from '@/components/navigation/SidebarNav'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { Outlet } from 'react-router-dom'

export function DashboardLayout() {
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      <Header onToggleSidebar={() => dispatch(toggleSidebar())} />

      {sidebarOpen ? <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => dispatch(toggleSidebar())} /> : null}

      <div className="flex h-[calc(100vh-5rem)] w-full gap-4 overflow-hidden px-4 pb-4">
        <aside
          className={`fixed left-4 top-24 z-40 h-[calc(100vh-7rem)] w-64 shrink-0 transition-transform duration-300 md:static md:h-full md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <SidebarNav />
        </aside>

        <section className="custom-scrollbar flex-1 overflow-y-auto rounded-lg border border-border bg-card p-4 text-card-foreground">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
