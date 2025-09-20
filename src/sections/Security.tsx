export function Security() {
    return(
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
    );
}