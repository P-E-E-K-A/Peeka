import { useDarkMode } from '../contexts/DarkModeContext'
import { Sun, Moon } from 'lucide-react';

export function Appearance(){
    const { darkMode, toggleDarkMode } = useDarkMode()

    return(
         <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                            darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                          {darkMode ? (
                            <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Sun className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {darkMode 
                          ? "🌙 Dark mode is currently enabled. Your preference is saved automatically."
                          : "☀️ Light mode is currently enabled. Your preference is saved automatically."
                        }
                      </p>
                    </div>
                  </div>
                </div>
    );
}