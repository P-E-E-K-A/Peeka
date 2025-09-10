import { LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
export function NavBar() {
    const { user, signOut } = useAuth()

    return(
        <nav className="bg-white">
            <div className="max-w-7xl mx-2 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-10">
                <div className="flex items-center">
                <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">Peeka</h1>
                </div>
                </div>
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{user?.email}</span>
                </div>
                <button
                    onClick={signOut}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                </button>
                </div>
            </div>
            </div>
        </nav>
    );
}
