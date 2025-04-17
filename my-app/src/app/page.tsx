'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'Revisión pendiente del vehículo',
    message: 'Tu vehículo Toyota Corolla necesita revisión antes del próximo alquiler.',
    icon: <AlertTriangle className="text-yellow-500" size={24} />,
    action: 'Revisar ahora',
  },
  {
    id: 2,
    title: 'Error en el pago',
    message: 'No se pudo procesar el pago de la reserva N° 3421.',
    icon: <XCircle className="text-red-500" size={24} />,
    action: 'Reintentar',
  },
  {
    id: 3,
    title: 'Reserva confirmada',
    message: 'Tu reserva para el Nissan Versa ha sido confirmada con éxito.',
    icon: <CheckCircle className="text-green-500" size={24} />,
    action: 'Ver detalles',
  },
  {
    id: 4,
    title: 'Recordatorio de documentos',
    message: 'Por favor, asegúrate de tener tu licencia de conducir válida al momento del retiro.',
    icon: <Info className="text-blue-500" size={24} />,
    action: 'Subir documentos',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">
        Notificaciones
      </h1>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="border rounded-lg p-4 shadow-sm flex justify-between items-start"
          >
            <div className="flex gap-4">
              <div className="pt-1">{n.icon}</div>
              <div>
                <h2 className="font-bold text-lg">{n.title}</h2>
                <p className="text-gray-700 mt-1">{n.message}</p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between ml-4">
              <button className="bg-amber-500 text-white px-4 py-1 rounded hover:bg-amber-600 mt-2">
                {n.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}






