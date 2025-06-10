import { useState, useEffect, useCallback, useRef } from 'react';
import NotificationService from '../app/services/NotificationService';
import { getUserId, getAuthToken } from '../app/utils/userIdentifier';
import type { Notificacion, NotificationResponse } from '@/app/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const notificationServiceRef = useRef<NotificationService | null>(null);

  const userId = getUserId();
  const token = getAuthToken();

  const fetchNotifications = useCallback(async () => {
    if (!userId || !token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Ejecutando fetchNotifications con userId:', userId);
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificaciones/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }
      
      const data = await response.json();
      setNotifications(data.notificaciones || []);
      setUnreadCount(data.notificaciones?.filter((n: NotificationResponse) => !n.leido).length || 0);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) {
      if (notificationServiceRef.current) {
        notificationServiceRef.current.disconnect();
        notificationServiceRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Inicializar el servicio de notificaciones
    const service = new NotificationService(userId);
    notificationServiceRef.current = service;

    // Configurar los callbacks
    service
      .onNewNotification((notification) => {
        console.log('Nueva notificación recibida:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(count => count + 1);
      })
      .onNotificationRead((notificationId) => {
        console.log('Notificación marcada como leída:', notificationId);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, leido: true } : n
          )
        );
        setUnreadCount(count => Math.max(0, count - 1));
      })
      .onNotificationDeleted((notificationId) => {
        console.log('Notificación eliminada:', notificationId);
        setNotifications(prev =>
          prev.filter(n => n.id !== notificationId)
        );
      })
      .onError((error) => {
        console.error('Error en SSE:', error);
        setIsConnected(false);
        setError('Error en la conexión de notificaciones');
      })
      .onConnect(() => {
        console.log('Conexión SSE establecida');
        setIsConnected(true);
        setError(null);
      });

    // Conectar el servicio
    console.log('Iniciando conexión SSE...');
    service.connect();

    // Cargar notificaciones iniciales
    fetchNotifications();

    // Limpiar al desmontar
    return () => {
      console.log('Limpiando conexión SSE');
      if (notificationServiceRef.current) {
        notificationServiceRef.current.disconnect();
        notificationServiceRef.current = null;
      }
    };
  }, [userId, token, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isConnected,
    refreshNotifications: fetchNotifications
  };
}
