import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Settings } from 'lucide-react'

interface DropdownOption {
  label: string
  value: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface DropdownProps {
  options: DropdownOption[]
  className?: string
  userEmail?: string
  onSettingsClick?: () => void
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  className = "",
  userEmail,
  onSettingsClick
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (option: DropdownOption) => {
    setIsOpen(false)
    if (option.onClick) {
      option.onClick()
    }
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    if (onSettingsClick) {
      onSettingsClick()
    }
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* Header with user email */}
          {userEmail && (
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-xs text-gray-500 font-medium">Signed in as</p>
              <p className="text-sm text-gray-900 truncate">{userEmail}</p>
            </div>
          )}
          
          {/* Settings Quick Access */}
          {onSettingsClick && (
            <div className="py-1 border-b border-gray-200">
              <button
                onClick={handleSettingsClick}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                role="menuitem"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                Settings
              </button>
            </div>
          )}
          
          {/* Menu options */}
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                role="menuitem"
              >
                {option.icon && (
                  <span className="mr-3 text-gray-400">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}