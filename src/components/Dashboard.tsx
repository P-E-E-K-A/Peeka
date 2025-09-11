import React, { useState } from 'react'
import { NavBar } from './NavBar'
import { WelcomeCard } from './WelcomCard'
import { CardImage } from './CardImage'
import { SideBar } from './SideBar'

//Import page components here
import { ProfileContent } from '../pages/ProfileContent'
import { AnalyticsContent } from '../pages/AnalyticsContent'

// Local dashboard content component
const DashboardContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Welcome Back!</h3>
        <p className="text-gray-600">Your dashboard is ready to use.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
        <p className="text-gray-600">View your latest metrics here.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <p className="text-gray-600">See what's been happening.</p>
      </div>
    </div>
  </div>
)

// Placeholder components for pages you haven't created yet
const DocumentsContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Documents</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Documents content will go here.</p>
    </div>
  </div>
)

const CalendarContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Calendar</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Calendar content will go here.</p>
    </div>
  </div>
)

const NotificationsContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Notifications content will go here.</p>
    </div>
  </div>
)

const SettingsContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Settings content will go here.</p>
    </div>
  </div>
)

const HelpContent = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Help content will go here.</p>
    </div>
  </div>
)

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': 
        return <DashboardContent />
      case 'profile': 
        return <ProfileContent />
      case 'analytics': 
        return <AnalyticsContent />
      case 'documents': 
        return <DocumentsContent />
      case 'calendar': 
        return <CalendarContent />
      case 'notifications': 
        return <NotificationsContent />
      case 'settings': 
        return <SettingsContent />
      case 'help': 
        return <HelpContent />
      default: 
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <main>
        <div className='flex flex-col'>
          <CardImage src="/img/default.jpg" alt="Placeholder Image" />
          <div className='flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200'>
            <WelcomeCard />
            <NavBar />
          </div>
          <div className='flex flex-row'>
            <SideBar onPageChange={setCurrentPage} />
            <section className='flex-1 w-full'>
              {renderPage()}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}