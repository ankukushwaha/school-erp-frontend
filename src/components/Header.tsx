import { useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Search, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NotificationCenter } from '@/components/NotificationCenter'
import { ROUTES } from '@/app/constants/routes'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

type HeaderProps = {
  onToggleSidebar: () => void
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, role } = useAppSelector((state) => state.auth)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/20 bg-white/40 px-4 backdrop-blur-md transition-all md:px-8">
        <div className="flex max-w-xl flex-1 items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="-ml-2 rounded-lg p-2 text-gray-600 hover:bg-white/50 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>

          <div className="group relative hidden w-full max-w-md sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for students, teachers, documents..."
              className="w-full rounded-full border border-white/30 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-gray-700 shadow-sm transition-all placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="p-2 text-gray-500 sm:hidden" aria-label="Search">
            <Search size={20} />
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-white/50 hover:text-indigo-600"
            aria-label="Open notifications"
          >
            <Bell size={22} />
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="relative flex items-center gap-3 border-l border-gray-200/50 pl-2 md:pl-6">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name ?? 'Guest User'}</p>
              <p className="text-xs capitalize text-gray-500">{role ?? 'Guest'}</p>
            </div>
            <button onClick={() => setShowProfileMenu((prev) => !prev)} className="group flex items-center gap-2" aria-label="Toggle profile menu">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 md:h-10 md:w-10">
                <img
                  src="https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY5ODE2OTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt={user?.name ?? 'User'}
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                />
              </div>
              <ChevronDown size={16} className="hidden text-gray-400 group-hover:text-gray-600 md:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/20 bg-white/90 py-2 shadow-xl backdrop-blur-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">{user?.name ?? 'Guest User'}</p>
                  <p className="text-xs text-gray-500">{user?.email ?? 'guest@example.com'}</p>
                </div>
                <button
                  onClick={() => navigate(ROUTES.profile)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
