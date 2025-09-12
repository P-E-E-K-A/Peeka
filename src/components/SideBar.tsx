import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home, 
  User, 
  Settings, 
  BarChart3, 
  FileText, 
  Calendar,
  Bell,
  HelpCircle,
  ChevronRight
} from 'lucide-react'


interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  badge?: number
}

interface SidebarProps {
  onPageChange?: (page: string) => void
}




export function SideBar({ onPageChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')
  const { user } = useAuth()

  const UserNameCheck = () => {
    // Try user_metadata first, then extract from email, fallback to "Sudo"
    return user?.user_metadata?.full_name || 
         user?.user_metadata?.name || 
         user?.email?.split('@')[0] || 
         "Sudo";
    }

  const handleItemClick = (item: SidebarItem) => {
    setActiveItem(item.id)
    item.onClick()
    if (onPageChange) {
      onPageChange(item.id)
    }
  }

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Dashboard')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Profile')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Analytics')
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Documents')
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Calendar')
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Notifications'),
      badge: 3
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Settings')
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle className="h-5 w-5" />,
      onClick: () => console.log('Navigate to Help')
    }
  ]

  return (
    <nav className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}


      {/* Navigation Items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-200 group ${
                  activeItem === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${
                    activeItem === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                    activeItem === item.id ? 'text-blue-600 rotate-90' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
                { UserNameCheck() }
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}