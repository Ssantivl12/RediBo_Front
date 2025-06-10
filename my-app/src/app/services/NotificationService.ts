import { NotificationResponse } from '../types/notification';
import { getAuthToken } from '../utils/userIdentifier';

export type Notification = NotificationResponse;

class NotificationService {
    private eventSource: EventSource | null = null;
    private usuarioId: string;
    private callbacks: {
      onNewNotification?: (notification: Notification) => void;
      onNotificationRead?: (notificationId: string) => void;
      onNotificationDeleted?: (notificationId: string) => void;
      onError?: (error: Event) => void;
      onConnect?: () => void; 
    };
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeoutId: NodeJS.Timeout | null = null;
    private isActive: boolean = false;
  
    constructor(usuarioId: string) {
      this.usuarioId = usuarioId;
      this.callbacks = {};
    }
  
    onNewNotification(callback: (notification: Notification) => void) {
      this.callbacks.onNewNotification = callback;
      return this;
    }
  
    onNotificationRead(callback: (notificationId: string) => void) {
      this.callbacks.onNotificationRead = callback;
      return this;
    }
  
    onNotificationDeleted(callback: (notificationId: string) => void) {
      this.callbacks.onNotificationDeleted = callback;
      return this;
    }
  
    onError(callback: (error: Event) => void) {
      this.callbacks.onError = callback;
      return this;
    }
  
    onConnect(callback: () => void) {
      this.callbacks.onConnect = callback;
      return this;
    }

    connect() {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.isActive = true;
      const token = getAuthToken();
      
      if (!token || !this.usuarioId) {
        console.error('No hay token o ID de usuario disponible');
        if (this.callbacks.onError) {
          this.callbacks.onError(new Event('error'));
        }
        return this;
      }

      try {
        console.log(`Intentando conectar SSE para usuario ${this.usuarioId}`);
        const url = `http://localhost:3001/api/notificaciones/sse/${this.usuarioId}`;
        console.log('URL de conexión SSE:', url);

        this.eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);
        console.log('EventSource creado');

        this.eventSource.onopen = () => {
          console.log('Conexión SSE establecida');
          this.reconnectAttempts = 0;
          if (this.callbacks.onConnect) {
            this.callbacks.onConnect();
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('Error en conexión SSE:', error);
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }

          if (this.isActive && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            this.reconnect(delay);
          }
        };

        // Event listeners para los diferentes tipos de eventos
        this.eventSource.addEventListener('nuevaNotificacion', (event) => {
          try {
            console.log('Evento nuevaNotificacion recibido:', event);
            const data = JSON.parse(event.data);
            console.log('Datos de nueva notificación:', data);
            if (this.callbacks.onNewNotification) {
              this.callbacks.onNewNotification(data);
            }
          } catch (error) {
            console.error('Error al procesar nueva notificación:', error);
          }
        });

        this.eventSource.addEventListener('notificacionLeida', (event) => {
          try {
            console.log('Evento notificacionLeida recibido:', event);
            const data = JSON.parse(event.data);
            if (this.callbacks.onNotificationRead) {
              this.callbacks.onNotificationRead(data.id);
            }
          } catch (error) {
            console.error('Error al procesar notificación leída:', error);
          }
        });

        this.eventSource.addEventListener('notificacionEliminada', (event) => {
          try {
            console.log('Evento notificacionEliminada recibido:', event);
            const data = JSON.parse(event.data);
            if (this.callbacks.onNotificationDeleted) {
              this.callbacks.onNotificationDeleted(data.id);
            }
          } catch (error) {
            console.error('Error al procesar notificación eliminada:', error);
          }
        });

      } catch (error) {
        console.error('Error al establecer conexión SSE:', error);
        if (this.isActive) {
          this.reconnect(1000);
        }
      }

      return this;
    }

    disconnect() {
      this.isActive = false;
      
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
      
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      
      return this;
    }
  
    // Reconectar con retraso exponencial
    private reconnect(delay = 1000) {
      if (!this.isActive) return;
      
      console.log(`Reconnecting to SSE in ${delay}ms...`);
      
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
      }
      
      this.reconnectTimeoutId = setTimeout(() => {
        if (this.isActive) {
          this.connect();
        }
      }, delay);
    }

    private handleError(error: Error): void {
      console.error('Error en conexión SSE:', error);
      this.reconnect();
    }
  }
  
  export default NotificationService;