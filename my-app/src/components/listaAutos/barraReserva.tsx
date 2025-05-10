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
        pickupDate.toISOString().split('T')[0],
        pickupTime,
        returnDate.toISOString().split('T')[0],
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
            dateFormat="dd/MM/yyyy" // Cambiado a formato dd/MM/yyyy
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
            dateFormat="dd/MM/yyyy" // Cambiado a formato dd/MM/yyyy
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
            {generateTimeOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReservaBarra;
