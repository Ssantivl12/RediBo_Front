'use client'

import { useState } from 'react'
import { FiCalendar } from 'react-icons/fi'
import { ScheduleModal } from './ScheduleModal'

export default function CalendarIconPanel() {
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <div className="relative">
      <div className="absolute top-16 right-0 z-50">
        <button
          className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 shadow-md transition transform hover:scale-105"
          onClick={() => setShowCalendar(true)}
        >
          <FiCalendar className="text-xl" />
        </button>
      </div>

      {showCalendar && (
        <ScheduleModal onClose={() => setShowCalendar(false)} />
      )}
    </div>
  )
}
