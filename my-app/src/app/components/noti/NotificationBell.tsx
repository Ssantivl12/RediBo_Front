"use client";

import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";

// Tipo para notificaciones
type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
};

export default function Home() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications: Notification[] = [
    {
      id: 1,
      title: "Tiempo de renta concluido",
      message: "Tu vehículo Nissan Sentra ya concluyó su tiempo de renta.",
      date: "03/31/2025, 21:00",
    },
    {
      id: 2,
      title: "Inspección pendiente",
      message: "Tu vehículo necesita pasar inspección técnica.",
      date: "04/10/2025, 14:20",
    },
    {
      id: 3,
      title: "Nueva solicitud",
      message: "Tienes una nueva solicitud de renta en curso.",
      date: "04/11/2025, 08:45",
    },
  ];

  return (
    <div className="flex justify-center bg-white min-h-screen">
      {/* Contenedor móvil */}
      <div className="w-full max-w-[375px] min-h-screen relative bg-white border border-black">
        
        {/* Header */}
        <header className="w-full flex flex-col items-center">
          {/* Línea naranja arriba */}
          <div className="w-full h-2 bg-[#FCA311]" />

          {/* Icono campana */}
          <div className="w-full flex justify-end items-center p-4 relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <BellIcon className="h-7 w-7 text-[#FCA311]" />
              {/* Circulito rojo indicador */}
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-3 w-3" />
            </button>
          </div>
        </header>

        {/* Lista de Notificaciones */}
        {showNotifications && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-xs z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`w-full flex items-center p-3 rounded-md border ${
                  index === 0 ? "bg-[#EFE1CB]" : "bg-white"
                } shadow-sm`}
              >
                {/* Círculo gris */}
                <div className="w-12 h-12 bg-gray-400 rounded-full flex-shrink-0" />

                {/* Texto de notificación */}
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-sm text-black">{notification.title}</h3>   {/* Negro */}
                  <p className="text-[11px] text-black">{notification.date}</p>               {/* Negro */}
                  <p className="text-[11px] text-black">{notification.message}</p>            {/* Negro */}
                </div>
              </div>
            ))}

            {/* Botón Ver más */}
            <button className="w-full border rounded-md py-2 text-sm font-medium text-gray-700 mt-2 hover:bg-gray-100">
              Ver más...
            </button>
          </div>
        )}

        {/* Contenido principal */}
        <main className="pt-24 p-6">
          <p className="text-center text-gray-600">
            Bienvenido a tu panel de control.
          </p>
        </main>
      </div>
    </div>
  );
}