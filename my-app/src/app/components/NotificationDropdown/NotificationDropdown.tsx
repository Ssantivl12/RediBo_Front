import React from "react";

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
    title: "Título de la notificación",
    description: "Descripción de una notificación pasada",
    date: "Fecha de la notificación",
  },
  {
    title: "Título de la notificación",
    description: "Descripción de una notificación pasada",
    date: "Fecha de la notificación",
  },
];

const NotificationDropdown: React.FC = () => {
  return (
    <div className="absolute top-[125px] left-[1073px] w-[719px] h-[545px] bg-white border border-black shadow-md z-50">
      {notifications.map((notif, i) => (
        <div key={i} className="flex items-start p-4 border-b border-black">
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
      <div className="text-center py-3 border-t border-black cursor-pointer hover:bg-gray-100 text-sm">
        Ver más...
      </div>
    </div>
  );
};

export default NotificationDropdown;
