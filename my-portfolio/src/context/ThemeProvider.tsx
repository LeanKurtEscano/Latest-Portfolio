import { useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import ThemeContext from './ThemeContext'

function getInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    try { localStorage.setItem('portfolio-theme', theme) } catch {}
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((v) => (v === 'light' ? 'dark' : 'light')),
    [],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}