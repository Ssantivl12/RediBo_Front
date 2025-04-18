'use client';

import { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Renta finalizada',
    message: 'Tu Nissan Sentra ya finalizó su renta con el arrendatario.',
    date: '11/04/2025',
    read: false,
  },
  {
    id: 2,
    title: 'Pago recibido',
    message: 'Hemos recibido tu pago mensual.',
    date: '09/04/2025',
    read: true,
  },
  {
    id: 3,
    title: 'Nuevo mensaje',
    message: 'Tienes un nuevo mensaje del arrendatario.',
    date: '08/04/2025',
    read: false,
  },
];

const NotificationList = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
      <h2 className="text-base font-semibold mb-2">Notificaciones</h2>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          onClick={() => markAsRead(notif.id)}
          className={`p-2 mb-2 rounded cursor-pointer ${
            notif.read ? 'bg-gray-100' : 'bg-blue-100'
          }`}
        >
          <h3 className="font-medium text-sm">{notif.title}</h3>
          <p className="text-xs">{notif.message}</p>
          <span className="text-[10px] text-gray-500">{notif.date}</span>
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm w-full text-center hover:underline">
        Ver más...
      </button>
    </div>
  );
};

export default NotificationList;
