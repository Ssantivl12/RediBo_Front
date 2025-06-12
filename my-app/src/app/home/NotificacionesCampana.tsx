import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/hooks/useNotificaciones';
import NotificationIcon from '@/app/home/notificacionIcon';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '@/app/utils/userIdentifier';
import api from '@/libs/axiosConfig';
import ModalDetallesRenta from '@/app/components/modals/ModalDetallesRenta';
import ToastNotification from '@/app/components/modals/ToastNotification';
import type { Notificacion } from '@/app/types/notification';
import type { Notification } from '@/app/services/NotificationService';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export function NotificacionesCampana() {
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [toastNotification, setToastNotification] = useState<Notificacion | null>(null);
  const prevNotificationsRef = useRef<Notificacion[]>([]);
  const bellControls = useAnimation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    notifications,
    unreadCount,
    loading: cargando,
    isConnected,
    refreshNotifications: cargarNotificaciones,
    setNotifications,
    markAsRead,
  } = useNotifications();

  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const userId = getUserId();
  const [isProcessingRead, setIsProcessingRead] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mostrarPanel && !target.closest('.notificaciones-panel')) {
        setMostrarPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarPanel]);

  const togglePanel = () => {
    if (!mostrarPanel) {
      cargarNotificaciones();
    }
    setMostrarPanel(!mostrarPanel);
  };

  const obtenerDetalleNotificacion = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(
        `${API_URL}/notificaciones/detalle-notificacion/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle de notificación:', error);
      throw error;
    }
  };

  const handleVerDetalles = async (notificacion: Notificacion) => {
    try {
      const detalle = await obtenerDetalleNotificacion(notificacion.id);
      if (detalle) {
        setSelectedNotificacion(notificacion);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  const handleMarcarComoLeido = async (notificacion: Notificacion) => {
    if (!notificacion.id) {
      console.error('No se puede marcar como leída una notificación sin ID');
      return;
    }
    await markAsRead(notificacion.id);
  };

  const handleNotificacionClick = async (notificacion: Notificacion) => {
    console.log('Notificación clickeada:', notificacion);
    
    if (!notificacion.leido) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token disponible');
        }

        await axios.put(
          `${API_URL}/notificaciones/notificacion-leida/${notificacion.id}/${userId}`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        await markAsRead(notificacion.id);
      } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
      }
    }
    
    setSelectedNotificacion(notificacion);
    setMostrarPanel(false); // Cerramos el panel después de mostrar el modal
  };

  const handleCloseModal = () => {
    setSelectedNotificacion(null);
    cargarNotificaciones(); // Recargamos las notificaciones para actualizar el estado
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId: userId },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotificacion(null);
      cargarNotificaciones();
    } catch (error) {
      console.error("Error al borrar notificación:", error);
    }
  };

  const transformarNotificacion = (item: Notificacion | Notification): Notificacion => {
    console.log('Transformando notificación en componente:', item);
    if (!item.id) {
      console.error('Notificación sin ID:', item);
      throw new Error('Notificación sin ID');
    }
    return {
      id: item.id,
      titulo: item.titulo,
      descripcion: 'descripcion' in item ? item.descripcion : item.mensaje,
      mensaje: item.mensaje,
      fecha: 'fecha' in item ? item.fecha : item.creadoEn,
      tipo: item.tipo || "No especificado",
      tipoEntidad: item.tipoEntidad || "No especificado",
      imagenURL: 'imagenURL' in item ? item.imagenURL : ('imagenAuto' in item ? item.imagenAuto : undefined),
      leido: 'leido' in item ? item.leido : false,
      creadoEn: item.creadoEn,
    };
  };

  const notisTransformadas = notifications.map(transformarNotificacion);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const notisTransformadas = notifications.map(transformarNotificacion);
      
      if (prevNotificationsRef.current.length === 0) {
        prevNotificationsRef.current = notisTransformadas;
        return;
      }
      
      const notificacionesExistentes = new Map(prevNotificationsRef.current.map(n => [n.id, n]));
      const nuevas = notisTransformadas.filter(nueva => !notificacionesExistentes.has(nueva.id));

      if (nuevas.length > 0) {
        const notificacionMasReciente = nuevas.reduce((masReciente, actual) => {
          return new Date(actual.creadoEn) > new Date(masReciente.creadoEn) ? actual : masReciente;
        });
        
        setToastNotification(notificacionMasReciente);
        
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => {
          console.warn('Error reproduciendo sonido:', err);
          });
        }

        bellControls.start({
          rotate: [0, -15, 15, -10, 10, -5, 5, 0],
          transition: { duration: 0.6 },
        });

        setTimeout(() => {
          setToastNotification(null);
        }, 3000);
      }
      
      prevNotificationsRef.current = notisTransformadas;
    }
  }, [notifications , bellControls]);

  // Agregar un useEffect para monitorear el estado del modal
  useEffect(() => {
    console.log('Estado del modal:', { selectedNotificacion, mostrarPanel });
  }, [selectedNotificacion, mostrarPanel]);

  return (    
    <>
      <audio ref={audioRef} src="/sonidos/notificacion.mp4" preload="auto" />      
      <div className="relative notificaciones-panel">
        <button
          onClick={togglePanel}
          className="cursor-pointer relative p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Ver notificaciones"
        >
          <motion.div animate={bellControls}>
            <BellIcon className="w-6 h-6 text-orange-500" />
          </motion.div>
          
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {mostrarPanel && (
            <motion.div
              key="panel-notificaciones"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 w-80 mt-2 bg-white rounded-md shadow-lg z-40 notificaciones-panel"
            >           
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Notificaciones
                </h3>
                  {!isConnected && (
                    <span className="text-xs text-yellow-600 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                      Reconectando...
                    </span>
                  )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {cargando ? (
                  <div className="p-4 text-center text-gray-500">Cargando...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No tienes notificaciones</div>
                ) : (
                  <ul>
                    {notifications.slice(0, 3).map((notificacion) => (
                      <li
                        key={notificacion.id}
                        onClick={() => handleNotificacionClick(transformarNotificacion(notificacion))}
                        className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        notificacion.leido ? 'bg-white' : 'bg-amber-50'
                        }`}
                      >
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 flex items-center justify-center">
                            <NotificationIcon tipo={notificacion.tipo}/>
                          </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{notificacion.titulo}</p>
                            {!notificacion.leido && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Nueva
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{notificacion.mensaje}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="w-full text-xs text-gray-400 text-right">
                              {formatDate(notificacion.creadoEn)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-2 border-t border-gray-200 flex">
              <Link href="/home/homePage/PanelNotificaciones" className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 p-2">
                Ver todas
              </Link>
              <Link href="/home/homePage/PanelNotificaciones" className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 p-2">
                Alertas
              </Link>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toastNotification && (
          <ToastNotification
            notificacion={toastNotification}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNotificacion && (
          <motion.div
            key="modal-detalles"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/1"
          >
            <ModalDetallesRenta
              isOpen={true}
              notification={selectedNotificacion}
              onClose={handleCloseModal}
              onDelete={() => handleDelete(selectedNotificacion.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function formatDate(dateString: Date | string) {
  const fecha = new Date(dateString);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
}