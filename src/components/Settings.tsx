import React, { useState } from 'react'
import { X, User, Bell, Shield, Palette, Package } from 'lucide-react'
//import { useAuth } from '../contexts/AuthContext'


import { SettingsProfile } from '../sections/SettingsProfile'
import { Notifications } from '../sections/Notifications'
import { Security } from '../sections/Security'
import { Appearance } from '../sections/Appearance'
import { AddOns } from '../sections/AddOns'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile')
  
 
  if (!isOpen) return null

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { id: 'addons', label: 'Add-ons', icon:  <Package className='h-4 w-4'/> },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal - Wider and Fixed Height */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Close settings"
              aria-label="Close settings"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content Area - Fixed Height with Scroll */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Wider */}
            <div className="w-50 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              <nav className="p-6 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                    }`}
                  >
                    <span className={`mr-3 flex-shrink-0 transition-colors ${activeTab === tab.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {tab.icon}
                    </span>
                    <span className="flex-1 text-left">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-8">
              {activeTab === 'profile' && (
                <SettingsProfile />
              )}

              {activeTab === 'notifications' && (
                <Notifications/>
              )}

              {activeTab === 'security' && (
                <Security/>
              )}

              {activeTab === 'appearance' && (
                <Appearance />
              )}

              {activeTab === 'addons' && (
                <AddOns />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}