import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function getStoredTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return localStorage.getItem('theme') || 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = {
    theme,
    toggleTheme: () => setTheme(current => (current === 'dark' ? 'light' : 'dark')),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}
