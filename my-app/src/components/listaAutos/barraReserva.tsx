'use client';

import React, { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservaBarra: React.FC = () => {
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<string>("");
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDatesChange = () => {
    setErrorMessage(""); // Limpiar errores anteriores
  
    // Validación de fecha sin importar hora
    if (pickupDate && returnDate) {
      const pickupDay = new Date(pickupDate);
      pickupDay.setHours(0, 0, 0, 0);
      const returnDay = new Date(returnDate);
      returnDay.setHours(0, 0, 0, 0);
  
      if (returnDay < pickupDay) {
        setErrorMessage("La fecha de devolución debe ser posterior a la fecha de recogida.");
        return;
      }
    }
  
    // Validación completa de fecha y hora
    if (pickupDate && returnDate && pickupTime && returnTime) {
      const pickupDateTime = new Date(pickupDate);
      const [pickupHour, pickupMinute] = pickupTime.split(":").map(Number);
      pickupDateTime.setHours(pickupHour, pickupMinute || 0, 0, 0);
  
      const returnDateTime = new Date(returnDate);
      const [returnHour, returnMinute] = returnTime.split(":").map(Number);
      returnDateTime.setHours(returnHour, returnMinute || 0, 0, 0);
  
      if (pickupDateTime.getTime() === returnDateTime.getTime()) {
        setErrorMessage("La fecha y hora de recogida y devolución no pueden ser iguales.");
        return;
      }
  
      const sameDay =
        pickupDate.toISOString().split("T")[0] === returnDate.toISOString().split("T")[0];
  
      if (sameDay && returnTime <= pickupTime) {
        setErrorMessage("La hora de devolución debe ser posterior a la hora de recogida.");
        return;
      }
  
      if (returnDateTime <= pickupDateTime) {
        setErrorMessage("La fecha y hora de devolución deben ser posteriores a las de recogida.");
        return;
      }
    }
  
    // Todo válido
    setErrorMessage("");
  };

  useEffect(() => {
    handleDatesChange();
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      times.push(<option key={hour} value={hour}>{hour}</option>);
    }
    return times;
  };

  return (
    <div>
      <div className="flex items-center border rounded-lg p-2 bg-white shadow-md space-x-4">
        {/* Fecha de recogida */}
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-[60px] w-[60px] text-gray-800" />
          <div>
            <label htmlFor="pickup-date" className="text-sm font-bold text-blue-950">
              Fecha de recogida:
            </label>
            <DatePicker
              selected={pickupDate}
              onChange={(date: Date | null) => setPickupDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-[9999]"
              portalId="root-portal"
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
              {generateTimeOptions()}
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
              onChange={(date: Date | null) => setReturnDate(date)}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-[9999]"
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
              {generateTimeOptions()}
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <p className="text-red-600 mt-2 text-sm font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default ReservaBarra;
