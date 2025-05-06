'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { MonthCalendar } from './MonthCalendar'

export const ScheduleModal = ({ onClose }: { onClose: () => void }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null)
  const year = 2025

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 rounded-xl shadow-xl p-6 w-[90%] max-w-3xl max-h-[90%] overflow-auto relative">
        {/* Botón cerrar modal completo */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-red-500"
        >
          <X size={28} />
        </button>

        {/* Título del cronograma */}
        <h2 className="text-center text-xl font-bold text-orange-500 flex items-center justify-center gap-2 mb-4">
          Cronograma <span role="img">📅</span>
        </h2>

        {/* Mostrar vista de calendario mensual si hay mes seleccionado */}
        {mesSeleccionado !== null ? (
          <MonthCalendar
            year={year}
            month={mesSeleccionado}
            onBack={() => setMesSeleccionado(null)}
          />
        ) : (
          <>
            {/* Año */}
            <div className="flex items-center justify-center mb-6">
              <span className="mr-2 text-lg font-medium">Año:</span>
              <span className="bg-white px-3 py-1 rounded-full text-blue-900 font-bold shadow">
                {year}
              </span>
            </div>

            {/* Selector de meses */}
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {[
                'Enero', 'Febrero', 'Marzo', 'Abril',
                'Mayo', 'Junio', 'Julio', 'Agosto',
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
              ].map((mes, index) => (
                <button
                  key={index}
                  onClick={() => setMesSeleccionado(index)}
                  className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white bg-blue-900 hover:bg-blue-700 transition"
                >
                  {mes}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
