import { LogOut, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Dropdown } from './Dropdown'
import { Settings } from './Settings'
import { useState } from 'react'

export function NavBar() {
    const { user, signOut } = useAuth()
    const [showSettings, setShowSettings] = useState(false)

    // Define dropdown options with proper signOut function
    const userMenuOptions = [
        {
            label: 'Sign out',
            value: 'signout',
            icon: <LogOut className="h-4 w-4" />,
            onClick: () => {
                console.log('Signing out...')
                signOut() // This calls the same signOut function from useAuth
            }
        }
    ]

    const handleSettingsClick = () => {
        console.log('Settings clicked')
        setShowSettings(true)
    }

    return(
        <>
            <nav className="bg-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* User Menu */}
                        <div className="flex items-center space-x-4 ">
                            {/* Settings Icon */}
                            <SettingsIcon 
                                className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" 
                                onClick={handleSettingsClick}
                            />

                            {/* Dropdown Menu */}
                            <Dropdown 
                                options={userMenuOptions}
                                className="w-16"
                                userEmail={user?.email}
                                onSettingsClick={handleSettingsClick}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Settings Modal */}
            <Settings 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
            />
        </>
    );
}