import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface DarkModeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

interface DarkModeProviderProps {
  children: ReactNode
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  // Check if user has a preference stored, otherwise check system preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode')
      if (stored !== null) {
        return JSON.parse(stored)
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Store preference in localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}