import React from 'react'
import { NavBar } from './NavBar'
import { WelcomeCard } from './WelcomCard'
import { CardImage } from './CardImage'


export const Dashboard: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">      
      <main >
        <div className='flex flex-col'>
          <CardImage src="/img/default.jpg" alt="Placeholder Image" />
          <div className='flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-200'>
            <WelcomeCard />
            <NavBar />
          </div>
          <div className='flex flex-row'>
            <nav>
              {/* Sidebar or navigation items can go here */}
              <p className='text-gray-700 mt-4 text-xl font-semibold'>Peeka</p>
            </nav>
            <section>
              {/* Main content goes here */}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}