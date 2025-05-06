import React from 'react'

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril',
  'Mayo', 'Junio', 'Julio', 'Agosto',
  'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const MonthSelector = ({
  year,
  onSelectMonth
}: {
  year: number
  onSelectMonth: (monthIndex: number) => void
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 items-center">
        <span className="font-bold text-black">Año:</span>
        <div className="bg-white px-3 py-1 rounded shadow">{year}</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {months.map((name, index) => (
          <button
            key={index}
            onClick={() => onSelectMonth(index)}
            className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
