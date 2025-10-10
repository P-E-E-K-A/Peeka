import React, { useState } from 'react';
import { SettingsProfile } from '../sections/SettingsProfile';
import { Appearance } from '../sections/Appearance';
import { User, Sun, Shield, Bell, PackageXIcon } from 'lucide-react';
import {AddOns} from '../sections/AddOns';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
  { id: 'appearance', label: 'Appearance', icon: Sun, description: 'Display preferences' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Account security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert preferences' },
  { id: 'addons', label:'Add-ons', icon: PackageXIcon, description: 'Manage add-ons' },
];

export const SettingsContent: React.FC = () => { // Make sure this is exported!
  const [activeSection, setActiveSection] = useState('profile');

  const renderSettingsSection = () => {
    switch (activeSection) {
      case 'profile':
        return <SettingsProfile />;
      case 'appearance':
        return <Appearance />;
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Security Settings</h3>
            <div className="bg-gray-700 rounded-lg p-6 space-y-4">
              <p className="text-gray-300">Password management and 2FA coming soon...</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Notification Settings</h3>
            <div className="bg-gray-700 rounded-lg p-6 space-y-4">
              <p className="text-gray-300">Email and push notification preferences coming soon...</p>
            </div>
          </div>
        );
      case 'addons':
        return <AddOns />;
      default:
        return <SettingsProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 sticky top-6">
              {/* Navigation Header */}
              <div className="px-4 py-3 border-b border-gray-600">
                <h2 className="text-sm font-semibold text-white flex items-center">
                  <span className="w-6 h-6 mr-2">⚙️</span>
                  Account Settings
                </h2>
              </div>

              {/* Navigation Items */}
              <nav className="divide-y divide-gray-600">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-4 text-sm font-medium transition-colors group ${
                        activeSection === section.id
                          ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-400'
                          : 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0 opacity-75 group-hover:opacity-100" />
                      <div className="flex-1 text-left">
                        <span>{section.label}</span>
                        {activeSection === section.id && (
                          <span className="block text-xs text-blue-400 mt-0.5">Active</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-700 rounded-lg shadow-sm border border-gray-600 min-h-[600px]">
              {renderSettingsSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};