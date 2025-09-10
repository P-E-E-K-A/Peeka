import React from 'react'
import { NavBar } from './NavBar'
import { PurpleDashboard } from './PurpleDashboard'


export const Dashboard: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">      
      <main >
        <NavBar />
        <div className='flex flex-row'>
          <PurpleDashboard />
        </div>
      </main>
    </div>
  )
}