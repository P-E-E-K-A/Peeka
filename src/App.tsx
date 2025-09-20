import React, { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { AppearanceProvider } from './contexts/appearance-context'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'

// This component handles the main app logic and route switching
const AppContent: React.FC = () => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, show Dashboard; otherwise show Login
  return user ? <Dashboard /> : <Login />
}

// Main App component that wraps everything with all providers
function App() {
  // Ensure initial theme setup (this runs once on mount)
  useEffect(() => {
    // Initialize CSS variables for primary color
    if (typeof window !== 'undefined') {
      try {
        const savedAccent = localStorage.getItem('accentColor') || 'blue';
        const colorMap: Record<string, string> = {
          blue: '#2563eb',
          green: '#16a34a',
          purple: '#7c3aed',
          red: '#dc2626',
          orange: '#ea580c'
        };
        const color = colorMap[savedAccent as keyof typeof colorMap];
        if (color) {
          document.documentElement.style.setProperty('--primary', color);
        }
      } catch (error) {
        console.warn('Failed to initialize appearance settings:', error);
      }
    }
  }, []);

  return (
    <AppearanceProvider>
      <DarkModeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <AppContent />
          </div>
        </AuthProvider>
      </DarkModeProvider>
    </AppearanceProvider>
  )
}

export default App