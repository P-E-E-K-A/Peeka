import { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { Calendar } from "../apps/CalenderApp";

const TimeAndDateApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return { day, month, year };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <div className="flex-col min-w-1/2">
      <div className="relative w-full h-96 overflow-hidden shadow-2xl">
        {/* Green Background */}
        <div className="absolute inset-0 bg-green-400">
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="w-full max-w-2xl bg-neutral-800/30 backdrop-blur-sm p-6 text-white">
        {/* Day Display */}
        <div className="text-center mb-4">
          <p className="text-lg font-medium opacity-90">{formatDay(currentTime)}.</p>
        </div>
        
        {/* Date Card */}
        <div className="bg-neutral-700/40 backdrop-blur-sm rounded-lg p-4 mb-6 text-center max-w-32 mx-auto relative">
          <div className="text-4xl font-bold">{dateInfo.day}</div>
          <div className="text-sm opacity-80">{dateInfo.month} '{dateInfo.year}.</div>
          {/* Maximize Icon */}
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="absolute bottom-2 left-2 p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Time Display */}
        <div className="text-3xl font-light text-center">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg w-full max-w-md mx-4 pt-6 relative">
            {/* Close Button */}
            <button 
              onClick={() => setIsCalendarOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Calendar Content */}
            <div className="mt-6 text-center text-gray-800">
              <Calendar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeAndDateApp;