'use client';

import React from 'react';
import NotificationItem from './NotificationItem';
import { useNotification } from '../Context/NotificationContext';

export default function NotificationList() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full">
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onClose={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
}
