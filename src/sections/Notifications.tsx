// import { useState } from "react";
export function Notifications(){
   // const [notifications, setNotifications] = useState(true)

    return(
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
                  
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <div className="text-gray-500 flex text-left p-8 max-w-2/3 ">
                        <p>This is set to Email by default, In the nearby future, more options would be implemented</p>
                    </div>
                </div>
            </div>
        </div>
    );
}