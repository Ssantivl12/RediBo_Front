import React from 'react';
import { Notification } from '../Context/NotificationContext';
import { X, Info, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  notification: Notification;
  onClose: () => void;
};

const iconMap = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <AlertCircle className="text-red-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
};

export default function NotificationItem({ notification, onClose }: Props) {
  const type = notification.type || 'info';

  return (
    <div
      className={`rounded-2xl border px-4 py-3 flex items-start gap-4 shadow-lg mb-4 transition-all ${bgColors[type]}`}
    >
      <div className="pt-1">{iconMap[type]}</div>
      <div className="flex-1 text-sm text-gray-800">{notification.message}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition"
        aria-label="Cerrar notificación"
      >
        <X size={18} />
      </button>
    </div>
  );
}
