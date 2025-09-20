import React, { useState } from 'react'

// Import shared components here
import { NavBar } from './NavBar'
import { CardImage } from './CardImage'
import { SideBar } from './SideBar'
import { Logo } from './Logo'

// Import page components here
import { ProfileContent } from '../pages/ProfileContent'
import { AnalyticsContent } from '../pages/AnalyticsContent'
import { DashboardContent } from '../pages/DashboardContent'
import { DocumentsContent } from '../pages/DocumentsContent'
import { CalendarContent } from '../pages/CalendarContent'
import { NotificationsContent } from '../pages/NotificationsContent'
import { SettingsContent } from '../pages/SettingsContent' // Make sure this path is correct
import { HelpContent } from '../pages/HelpContent'

// Page routing component that switches between different page components
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
    <div className="min-h-screen ">      
      <main>
        <div className='flex flex-col bg-custom-dark'>
          <CardImage src="/img/default.jpg" alt="Placeholder Image" />
          <div className='flex justify-between items-center p-4 bg-neutral-800 border-gray-200'>
            <Logo />
            <NavBar />
          </div>
          <div className='flex flex-row bg-neutral-800 text-white '>
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