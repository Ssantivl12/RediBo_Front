"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from "date-fns/locale" // Establecer idioma en español

// Función para obtener la próxima hora completa
const getNextHour = (currentTime: Date) => {
  const nextHour = new Date(currentTime)
  nextHour.setMinutes(0, 0, 0) // Set minutos, segundos y milisegundos a 0
  nextHour.setHours(nextHour.getHours() + 1) // Añadir una hora
  return nextHour
}

interface BarraReservaProps {
  onBuscarDisponibilidad: (fechaInicio: string, fechaFin: string) => void
}

const BarraReserva: React.FC<BarraReservaProps> = ({ onBuscarDisponibilidad }) => {
  const [pickupDate, setPickupDate] = useState<Date | null>(null)
  const [pickupTime, setPickupTime] = useState<string>("")
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [returnTime, setReturnTime] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [formValid, setFormValid] = useState<boolean>(false)

  // Limpiar todos los campos cuando se selecciona una nueva fecha de recogida
  const handlePickupDateChange = (date: Date | null) => {
    setPickupDate(date)

    // Limpiar los campos de hora y fecha de devolución si la fecha de recogida cambia
    if (date) {
      setReturnDate(null)
      setReturnTime("")
      setPickupTime("") // Limpiar la hora de recogida
    }

    // Si la fecha de recogida es hoy, ajustamos la hora de recogida
    if (date && new Date(date).toDateString() === new Date().toDateString()) {
      const nextHour = getNextHour(new Date())
      const nextHourStr = `${nextHour.getHours() < 10 ? "0" + nextHour.getHours() : nextHour.getHours()}:00`
      setPickupTime(nextHourStr) // Actualizamos la hora de recogida
    }
  }

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date)
    // Si la fecha de recogida y devolución son el mismo día, ajustar la hora de devolución
    if (pickupDate && date && pickupDate.toDateString() === date.toDateString()) {
      const nextReturnHour = new Date(pickupDate)
      nextReturnHour.setHours(nextReturnHour.getHours() + 1)
      setReturnTime(
        `${nextReturnHour.getHours() < 10 ? "0" + nextReturnHour.getHours() : nextReturnHour.getHours()}:00`,
      )
    } else {
      setReturnTime("") // Si las fechas son diferentes, dejamos que se seleccione cualquier hora
    }
  }

  const handleDatesChange = () => {
    setErrorMessage("") // Limpiar errores anteriores
    setFormValid(false) // Reiniciar validación

    // Verificar que todos los campos estén completos
    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      return
    }

    // Validación de fecha sin importar hora
    if (pickupDate && returnDate) {
      const pickupDay = new Date(pickupDate)
      pickupDay.setHours(0, 0, 0, 0)
      const returnDay = new Date(returnDate)
      returnDay.setHours(0, 0, 0, 0)

      if (returnDay < pickupDay) {
        setErrorMessage("La fecha de devolución debe ser posterior a la fecha de recogida.")
        return
      }
    }

    // Validación completa de fecha y hora
    if (pickupDate && returnDate && pickupTime && returnTime) {
      const pickupDateTime = new Date(pickupDate)
      const [pickupHour, pickupMinute] = pickupTime.split(":").map(Number)
      pickupDateTime.setHours(pickupHour, pickupMinute || 0, 0, 0)

      const returnDateTime = new Date(returnDate)
      const [returnHour, returnMinute] = returnTime.split(":").map(Number)
      returnDateTime.setHours(returnHour, returnMinute || 0, 0, 0)

      if (pickupDateTime.getTime() === returnDateTime.getTime()) {
        setErrorMessage("La fecha y hora de recogida y devolución no pueden ser iguales.")
        return
      }

      const sameDay = pickupDate.toISOString().split("T")[0] === returnDate.toISOString().split("T")[0]

      // Restricción de una hora de margen entre recogida y devolución cuando es el mismo día
      if (sameDay && returnTime <= pickupTime) {
        setErrorMessage("La hora de devolución debe ser posterior a la hora de recogida.")
        return
      }

      if (returnDateTime <= pickupDateTime) {
        setErrorMessage("La fecha y hora de devolución deben ser posteriores a las de recogida.")
        return
      }
    }

    // Todo válido
    setFormValid(true)
  }

  useEffect(() => {
    handleDatesChange()
  }, [pickupDate, pickupTime, returnDate, returnTime])

  const generateTimeOptions = (pickupDate: Date | null) => {
    const times = []
    let startHour = 0
    const currentHour = new Date().getHours()

    // Si la fecha de recogida es hoy, comenzamos desde la siguiente hora disponible
    if (pickupDate && new Date(pickupDate).toDateString() === new Date().toDateString()) {
      startHour = currentHour + 1 // La primera hora disponible sería la siguiente a la hora actual
    } else {
      startHour = 0 // Si no es hoy, permitimos todas las horas
    }

    // Crear las opciones de tiempo
    for (let i = startHour; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`
      times.push(
        <option key={hour} value={hour}>
          {hour}
        </option>,
      )
    }
    return times
  }

  const handleBuscar = () => {
    if (!formValid || !pickupDate || !returnDate || !pickupTime || !returnTime) {
      setErrorMessage("Por favor complete todos los campos correctamente.")
      return
    }

    // Crear fechas completas con hora
    const fechaInicio = new Date(pickupDate)
    const [horaInicio, minInicio] = pickupTime.split(":").map(Number)
    fechaInicio.setHours(horaInicio, minInicio || 0, 0, 0)

    const fechaFin = new Date(returnDate)
    const [horaFin, minFin] = returnTime.split(":").map(Number)
    fechaFin.setHours(horaFin, minFin || 0, 0, 0)

    // Convertir a formato ISO para la API
    const fechaInicioISO = fechaInicio.toISOString()
    const fechaFinISO = fechaFin.toISOString()

    // Llamar a la función de búsqueda pasada como prop
    onBuscarDisponibilidad(fechaInicioISO, fechaFinISO)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center border rounded-lg p-2 bg-white shadow-md space-y-2 md:space-y-0 md:space-x-4">
        {/* Fecha de recogida */}
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-[60px] w-[60px] text-gray-800" />
          <div>
            <label htmlFor="pickup-date" className="text-sm font-bold text-blue-950">
              Fecha de recogida:
            </label>
            <DatePicker
              selected={pickupDate}
              onChange={handlePickupDateChange}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-[9999]"
              portalId="root-portal"
              minDate={new Date()} // No permitir fechas anteriores a hoy
              locale={es} // Establecer el idioma a español
            />
          </div>
        </div>

        {/* Hora de recogida */}
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-[60px] w-[60px] text-gray-800" />
          <div>
            <label htmlFor="pickup-time" className="text-sm font-bold text-blue-950">
              Hora de recogida:
            </label>
            <select
              id="pickup-time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
            >
              <option value=""></option>
              {generateTimeOptions(pickupDate)} {/* Pasamos la fecha de recogida para generar las opciones */}
            </select>
          </div>
        </div>

        {/* Fecha de devolución */}
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-[60px] w-[60px] text-gray-800" />
          <div>
            <label htmlFor="return-date" className="text-sm font-bold text-blue-950">
              Fecha de devolución:
            </label>
            <DatePicker
              selected={returnDate}
              onChange={handleReturnDateChange} // Este manejador se encarga de ajustar la hora de devolución
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-[9999]"
              minDate={pickupDate || new Date()} // No permitir fechas antes de la fecha de recogida
              locale={es} // Establecer el idioma a español
            />
          </div>
        </div>

        {/* Hora de devolución */}
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-[60px] w-[60px] text-gray-800" />
          <div>
            <label htmlFor="return-time" className="text-sm font-bold text-blue-950">
              Hora de devolución:
            </label>
            <select
              id="return-time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
            >
              <option value=""></option>
              {generateTimeOptions(pickupDate)} {/* Pasamos la fecha de recogida para generar las opciones */}
            </select>
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleBuscar}
          disabled={!formValid}
          className={`bg-[#FCA311] hover:bg-[#e4920b] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base h-full ${!formValid ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Buscar
        </button>
      </div>

      {/* Mensaje de error */}
      {errorMessage && <p className="text-red-600 mt-2 text-sm font-medium">{errorMessage}</p>}
    </div>
  )
}

export default BarraReserva
