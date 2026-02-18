import { useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { useAppSelector } from '@/store/hooks'

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    window.localStorage.setItem('theme', theme)
  }, [theme])

  return children
}
