'use client';

import React, { useState } from "react";
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos del calendario


const ReservaBarra: React.FC = () => {
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<string>(""); // Inicializado en blanco
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState<string>(""); // Inicializado en blanco
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDatesChange = () => {
    if (pickupDate && returnDate) {
      const pickupDateTime = new Date(
        `${pickupDate.toISOString().split('T')[0]}T${pickupTime}`
      );
      const returnDateTime = new Date(
        `${returnDate.toISOString().split('T')[0]}T${returnTime}`
      );

      // Validación 1: Fecha de devolución no debe ser antes que la de recogida
      if (returnDateTime < pickupDateTime) {
        setErrorMessage("La fecha de devolución no puede ser anterior a la fecha de recogida.");
        return;
      }

      // Validación 2: Si las fechas son iguales, la hora de devolución debe ser posterior a la hora de recogida
      if (
        pickupDate.toISOString().split('T')[0] === returnDate.toISOString().split('T')[0] &&
        returnTime <= pickupTime
      ) {
        setErrorMessage("La hora de devolución debe ser posterior a la hora de recogida.");
        return;
      }

      // Si no hay errores
      setErrorMessage(""); // Limpia los errores

      console.log('Fecha de recogida:', pickupDate.toISOString().split('T')[0]);
      console.log('Hora de recogida:', pickupTime);
      console.log('Fecha de devolución:', returnDate.toISOString().split('T')[0]);
      console.log('Hora de devolución:', returnTime);

    }
  };

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
              onChange={(date: Date | null) => {
                setPickupDate(date);
                handleDatesChange();
              }}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-50"
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
              onChange={(e) => {
                setPickupTime(e.target.value);
                handleDatesChange();
              }}
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
            >
              <option value=""></option> {/* Opción vacía */}
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
              onChange={(date: Date | null) => {
                setReturnDate(date);
                handleDatesChange();
              }}
              dateFormat="dd/MM/yyyy"
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-28"
              popperClassName="z-50"
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
              onChange={(e) => {
                setReturnTime(e.target.value);
                handleDatesChange();
              }}
              className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black w-20"
            >
              <option value=""></option> {/* Opción vacía */}
              {generateTimeOptions()}
            </select>
          </div>
        </div>
      </div>

      {/* Mostrar mensaje de error */}
      {errorMessage && (
        <p className="text-red-600 mt-2 text-sm font-medium">{errorMessage}</p>
      )}
    </div>
  );
};

export default ReservaBarra;
