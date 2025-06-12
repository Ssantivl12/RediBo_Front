import { NotificationResponse } from '../types/notification';

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
        this.disconnect();
      }
  
      this.isActive = true;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token de autenticación disponible');
        }

        console.log(`Intentando conectar SSE para usuario ${this.usuarioId}`);
        const url = `http://localhost:3001/api/notificaciones/sse?token=${token}`;
        console.log('URL de conexión SSE:', url);
        
        // Crear EventSource con el token como parámetro de consulta
        this.eventSource = new EventSource(url, {
          withCredentials: true
        });

        this.eventSource.onopen = () => {
          console.log('Conexión SSE establecida');
          this.isActive = true;
          this.reconnectAttempts = 0;
          if (this.callbacks.onConnect) {
            this.callbacks.onConnect();
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('Error en la conexión SSE:', error);
          this.isActive = false;
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          this.eventSource?.close();
          
          if (this.isActive && this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            this.reconnect(delay);
            this.reconnectAttempts++;
          }
        };

        this.eventSource.onmessage = (event) => {
          try {
            console.log('Mensaje recibido:', event.data);
            const data = JSON.parse(event.data);
            if (this.callbacks.onNewNotification) {
              this.callbacks.onNewNotification(data);
            }
          } catch (error) {
            console.error('Error al procesar mensaje:', error);
          }
        };

        // Añadir listeners para eventos específicos
        this.eventSource.addEventListener('nuevaNotificacion', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (this.callbacks.onNewNotification) {
              this.callbacks.onNewNotification(data);
            }
          } catch (error) {
            console.error('Error al procesar nueva notificación:', error);
          }
        });

        this.eventSource.addEventListener('notificacionLeida', (event) => {
          try {
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
            const data = JSON.parse(event.data);
            if (this.callbacks.onNotificationDeleted) {
              this.callbacks.onNotificationDeleted(data.id);
            }
          } catch (error) {
            console.error('Error al procesar notificación eliminada:', error);
          }
        });

      } catch (error) {
        console.error('Error al crear EventSource:', error);
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

    private connectSSE(token: string) {
      try {
        console.log('Intentando conectar SSE para usuario', token);
        const baseUrl = 'http://localhost:3001/api/notificaciones/sse';
        console.log('URL de conexión SSE:', baseUrl);

        // Crear EventSource con el token como query parameter
        const eventSourceUrl = new URL(baseUrl);
        eventSourceUrl.searchParams.append('token', token);
        
        this.eventSource = new EventSource(eventSourceUrl.toString(), {
          withCredentials: true
        });

        console.log('EventSource creado con URL:', eventSourceUrl.toString());

        this.eventSource.onopen = () => {
          console.log('Conexión SSE establecida');
          this.isActive = true;
          this.reconnectAttempts = 0;
        };

        this.eventSource.onerror = () => {
          console.error('Error en conexión SSE');
          this.isActive = false;
          this.handleError(new Error('Error en conexión SSE'));
        };

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Notificación recibida:', data);
            this.onNewNotification(data);
          } catch (error) {
            console.error('Error al procesar mensaje SSE:', error);
          }
        };
      } catch (error) {
        console.error('Error al crear EventSource:', error);
        this.handleError(new Error('Error al crear EventSource'));
      }
    }
}
  
export default NotificationService;