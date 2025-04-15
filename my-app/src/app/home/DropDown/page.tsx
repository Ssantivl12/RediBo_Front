'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  title: string;
  description: string;
  date: string;
}

const notifications: Notification[] = [
  {
    title: "Tiempo de renta concluido",
    description: "Tu vehículo Nissan Sentra ya concluyó su tiempo de renta con el arrendatario...",
    date: "03/31/2025, 21:00",
  },
  {
    title: "Inspección requerida",
    description: "Tu auto Toyota Yaris necesita una inspección técnica antes de su próxima renta.",
    date: "04/10/2025, 12:30",
  },
  {
    title: "Nuevo mensaje",
    description: "Has recibido un nuevo mensaje del arrendatario.",
    date: "04/09/2025, 18:45",
  },
];

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-gray-100 overflow-hidden">

      {/* Rectangle 3 (Barra superior) */}
      <div className="absolute top-0 left-0 w-[2003px] h-[136px] border-[3px] border-[#FCA311] box-border bg-white z-10" />

      {/* Bell Icon */}
      <div className="absolute top-[47px] left-[1739px] z-20">
        <button onClick={() => setOpen(!open)} className="relative">
          <Bell className="w-12 h-12 text-orange-500" />
        </button>
      </div>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute top-[125px] left-[1073px] w-[719px] h-[545px] bg-white border border-black shadow-lg z-50 rounded-lg overflow-hidden">
          {notifications.map((notif, i) => (
            <div
              key={i}
              className="flex items-start p-4 border-b border-black"
            >
              <div className="w-16 h-16 bg-gray-500 rounded-full mr-4 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{notif.title}</span>
                  <span className="text-xs">{notif.date}</span>
                </div>
                <p className="text-sm text-gray-700">{notif.description}</p>
              </div>
            </div>
          ))}
          {/* Ver más */}
          <div className="text-center py-3 border-t border-black cursor-pointer hover:bg-gray-100 text-sm font-medium">
            Ver más...
          </div>
        </div>
      )}
    </main>
  );
}

