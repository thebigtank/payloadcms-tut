'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

const STORAGE_KEY = 'theme'

const apply = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  // Sync state with whatever InitTheme already set on <html> before paint.
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null
    if (current === 'light' || current === 'dark') setThemeState(current)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    apply(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      apply(next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
