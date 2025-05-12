"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from "date-fns/locale"

// Función para obtener la próxima hora completa
const getNextHour = (currentTime: Date) => {
  const nextHour = new Date(currentTime)
  nextHour.setMinutes(0, 0, 0)
  nextHour.setHours(nextHour.getHours() + 1)
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

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem("reservaData")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.pickupDate) setPickupDate(new Date(data.pickupDate))
        if (data.pickupTime) setPickupTime(data.pickupTime)
        if (data.returnDate) setReturnDate(new Date(data.returnDate))
        if (data.returnTime) setReturnTime(data.returnTime)
      } catch (error) {
        console.error("Error al cargar datos guardados:", error)
      }
    }
  }, [])

  // Guardar datos cuando cambian
  useEffect(() => {
    if (pickupDate && pickupTime && returnDate && returnTime) {
      const dataToSave = {
        pickupDate: pickupDate.toISOString(),
        pickupTime,
        returnDate: returnDate.toISOString(),
        returnTime,
      }
      localStorage.setItem("reservaData", JSON.stringify(dataToSave))
    }
  }, [pickupDate, pickupTime, returnDate, returnTime])

  const handleDatesChange = useCallback(() => {
    setErrorMessage("")
    setFormValid(false)

    if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
      return
    }

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

      if (sameDay && returnTime <= pickupTime) {
        setErrorMessage("La hora de devolución debe ser posterior a la hora de recogida.")
        return
      }

      if (returnDateTime <= pickupDateTime) {
        setErrorMessage("La fecha y hora de devolución deben ser posteriores a las de recogida.")
        return
      }
    }

    setFormValid(true)
  }, [pickupDate, pickupTime, returnDate, returnTime])

  useEffect(() => {
    handleDatesChange()
  }, [handleDatesChange])

  // Limpiar todos los campos cuando se selecciona una nueva fecha de recogida
  const handlePickupDateChange = (date: Date | null) => {
    setPickupDate(date)

    if (date) {
      setReturnDate(null)
      setReturnTime("")
      setPickupTime("")
    }

    if (date && new Date(date).toDateString() === new Date().toDateString()) {
      const nextHour = getNextHour(new Date())
      const nextHourStr = `${nextHour.getHours() < 10 ? "0" + nextHour.getHours() : nextHour.getHours()}:00`
      setPickupTime(nextHourStr)
    }
  }

  const handleReturnDateChange = (date: Date | null) => {
    setReturnDate(date)
    if (pickupDate && date && pickupDate.toDateString() === date.toDateString()) {
      const nextReturnHour = new Date(pickupDate)
      nextReturnHour.setHours(nextReturnHour.getHours() + 1)
      setReturnTime(
        `${nextReturnHour.getHours() < 10 ? "0" + nextReturnHour.getHours() : nextReturnHour.getHours()}:00`,
      )
    } else {
      setReturnTime("")
    }
  }

  const generateTimeOptions = (pickupDate: Date | null) => {
    const times = []
    let startHour = 0
    const currentHour = new Date().getHours()

    if (pickupDate && new Date(pickupDate).toDateString() === new Date().toDateString()) {
      startHour = currentHour + 1
    } else {
      startHour = 0
    }

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

    const fechaInicio = new Date(pickupDate)
    const [horaInicio, minInicio] = pickupTime.split(":").map(Number)
    fechaInicio.setHours(horaInicio, minInicio || 0, 0, 0)

    const fechaFin = new Date(returnDate)
    const [horaFin, minFin] = returnTime.split(":").map(Number)
    fechaFin.setHours(horaFin, minFin || 0, 0, 0)

    onBuscarDisponibilidad(fechaInicio.toISOString(), fechaFin.toISOString())
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
              minDate={new Date()}
              locale={es}
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
              {generateTimeOptions(pickupDate)}
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
              onChange={handleReturnDateChange}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-[9999]"
              minDate={pickupDate || new Date()}
              locale={es}
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
              {generateTimeOptions(pickupDate)}
            </select>
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={handleBuscar}
          disabled={!formValid}
          className={`bg-[#FCA311] hover:bg-[#e4920b] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base h-full ${
            !formValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Buscar
        </button>
      </div>

      {errorMessage && <p className="text-red-600 mt-2 text-sm font-medium">{errorMessage}</p>}
    </div>
  )
}

export default BarraReserva