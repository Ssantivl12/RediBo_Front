'use client'
import React from 'react'
import { getWeeksInMonth, startOfWeek, addDays, format } from 'date-fns'

import { es } from 'date-fns/locale'

type Props = {
  year: number
  month: number // 0-11
  onBack: () => void
}

export const MonthCalendar = ({ year, month, onBack }: Props) => {
  const startDate = new Date(year, month, 1)
  const totalWeeks = getWeeksInMonth(startDate, { weekStartsOn: 1 })

  const weeks = Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const weekStart = startOfWeek(
      new Date(year, month, 1 + weekIndex * 7),
      { weekStartsOn: 1 }
    )

    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(weekStart, dayIndex)
      return {
        date,
        isCurrentMonth: date.getMonth() === month
      }
    })
  })

  const weekdays = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO']
  const currentWeek = format(new Date(), 'w')

  return (
    <div className="bg-gray-200 rounded-xl p-6 shadow-md max-w-xl mx-auto text-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-orange-500 flex items-center gap-2">
          Cronograma <span role="img">📅</span>
        </h3>
        <button onClick={onBack} className="text-xl font-bold">✕</button>
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="bg-white px-3 py-1 rounded-full font-semibold">
          {year}
        </div>
        <button
          onClick={onBack}
          className="bg-white px-3 py-1 rounded-full font-semibold hover:bg-gray-300"
        >
          {format(new Date(year, month), 'MMMM', { locale: es })}
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2 text-sm font-bold text-blue-900 mb-2">
        <div>Semana:</div>
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {weeks.map((week, i) => {
        const weekNumber = format(week[0].date, 'w')
        const isCurrent = weekNumber === currentWeek

        return (
          <div key={i} className="grid grid-cols-8 gap-2 items-center mb-2">
            <div
              className={`rounded-full px-2 py-1 text-sm font-bold flex items-center justify-between ${
                isCurrent ? 'bg-blue-800 text-white' : 'bg-orange-400 text-white'
              }`}
            >
              {weekNumber} <span className="ml-1">→</span>
            </div>

            {week.map((day, idx) => (
              <div
                key={idx}
                className={`h-10 flex items-center justify-center rounded border ${
                  day.isCurrentMonth
                    ? 'bg-white text-black'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
