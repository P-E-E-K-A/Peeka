import React, { useState } from 'react'
import { X, User, Bell, Shield, Palette, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDarkMode } from '../contexts/DarkModeContext'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState(true)
 
  if (!isOpen) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Close settings"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <nav className="space-y-1 p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-3">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 bg-white dark:bg-gray-900">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        placeholder="Your email"
                        title="Email"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about yourself"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Update your password to keep your account secure</p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                        Change Password
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Add an extra layer of security to your account</p>
                      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
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
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}