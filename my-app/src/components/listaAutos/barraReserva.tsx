'use client';

import React, { useState } from "react";
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos del calendario

interface ReservaBarraProps {
  onDatesChange?: (pickupDate: string, pickupTime: string, returnDate: string, returnTime: string) => void;
}

const ReservaBarra: React.FC<ReservaBarraProps> = ({ onDatesChange }) => {
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [returnTime, setReturnTime] = useState("14:00");

  const handleDatesChange = () => {
    if (onDatesChange && pickupDate && returnDate) {
      onDatesChange(
        pickupDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        pickupTime,
        returnDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
        returnTime
      );
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
    <div className="flex flex-wrap items-center border rounded-lg p-4 bg-white shadow-md space-x-4 z-10 relative">
      {/* Fecha de recogida */}
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <div>
          <label htmlFor="pickup-date" className="text-sm font-medium text-black">
            Fecha de recogida
          </label>
          <DatePicker
            selected={pickupDate}
            onChange={(date: Date | null) => {
              setPickupDate(date); // Aquí manejamos el valor como Date o null
              handleDatesChange();
            }}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            popperClassName="z-50" // Asegura que el calendario esté por encima de otros elementos
          />
        </div>
      </div>

      {/* Hora de recogida */}
      <div className="flex items-center space-x-2">
        <ClockIcon className="h-5 w-5 text-gray-500" />
        <div>
          <label htmlFor="pickup-time" className="text-sm font-medium text-black">
            Hora de recogida
          </label>
          <select
            id="pickup-time"
            value={pickupTime}
            onChange={(e) => {
              setPickupTime(e.target.value);
              handleDatesChange();
            }}
            className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          >
            {generateTimeOptions()}
          </select>
        </div>
      </div>

      {/* Fecha de devolución */}
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <div>
          <label htmlFor="return-date" className="text-sm font-medium text-black">
            Fecha de devolución
          </label>
          <DatePicker
            selected={returnDate}
            onChange={(date: Date | null) => {
              setReturnDate(date); // Aquí manejamos el valor como Date o null
              handleDatesChange();
            }}
            dateFormat="yyyy-MM-dd"
            className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            popperClassName="z-50" // Asegura que el calendario esté por encima de otros elementos
          />
        </div>
      </div>

      {/* Hora de devolución */}
      <div className="flex items-center space-x-2">
        <ClockIcon className="h-5 w-5 text-gray-500" />
        <div>
          <label htmlFor="return-time" className="text-sm font-medium text-black">
            Hora de devolución
          </label>
          <select
            id="return-time"
            value={returnTime}
            onChange={(e) => {
              setReturnTime(e.target.value);
              handleDatesChange();
            }}
            className="border rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          >
            {generateTimeOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReservaBarra;
