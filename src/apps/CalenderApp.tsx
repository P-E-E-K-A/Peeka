import { useState } from 'react';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month and total days in the month
  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, firstDay, daysInMonth };
  };

  const { year, month, firstDay, daysInMonth } = getMonthData(currentDate);

  // Generate array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  // Add empty slots for days before the first day of the month
  const paddingDays = Array.from({ length: firstDay }, () => null);

  // Handle navigation to previous/next month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Format month and year for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formattedMonth = `${monthNames[month]} ${year}`;

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="w-full h-full bg-neutral-800/50 backdrop-blur-sm shadow-xl p-4 flex flex-col text-white">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4 ">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-100">{formattedMonth}</h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-200 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-10" />
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`h-auto p-1 flex items-center justify-center rounded-full transition-colors ${
              isToday(day)
                ? 'bg-purple-500 text-white font-semibold'
                : 'hover:bg-gray-700 text-gray-200'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}