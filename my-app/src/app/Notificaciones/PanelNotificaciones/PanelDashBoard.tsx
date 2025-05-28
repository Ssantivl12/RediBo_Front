"use client";
import { useState, useEffect } from "react";
import api from "@/libs/axiosConfig";
import ModalDetallesRenta from "../componentes/componentsModales/ModalDetallesRenta";
import ToastNotification from "../componentes/componentsModales/ToastNotification";
import { useNotifications } from "../../hooks/useNotificaciones";
import Image from "next/image";
import Link from "next/link";
import { Notificacion } from "../../types/notification";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface PanelDashBoardProps {
  usuarioId: string;
}

export default function PanelDashBoard({ usuarioId }: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState("");
  const [toastNotification, setToastNotification] = useState<Notificacion | null>(null);
  const [nuevasNotificaciones, setNuevasNotificaciones] = useState<Set<string>>(new Set());
  const { notifications: sseNotifications, refreshNotifications } = useNotifications();

  const transformarNotificaciones = (data: unknown[]): Notificacion[] => {
    return data.map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.mensaje || item.descripcion,
      mensaje: item.mensaje || item.descripcion,
      fecha: item.creadoEn || item.fecha,
      tipo: item.tipo || "No especificado",
      tipoEntidad: item.tipoEntidad || "No especificado",
      imagenURL: item.imagenAuto || item.imagenURL || undefined,
      leida: item.leido || item.leida || false,
      creadoEn: item.creadoEn || item.fecha,
    }));
  };

  function formatDate(dateString: Date | string) {
    const fecha = new Date(dateString);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
  }

  const obtenerNotificaciones = async () => {
    try {
      setLoading(true);
      const respuesta = await api.get(`/notificaciones/panel-notificaciones/${usuarioId}`);
      if (Array.isArray(respuesta.data.notificaciones)) {
        const notis = transformarNotificaciones(respuesta.data.notificaciones);
        setNotificaciones(notis);
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, [usuarioId]);

  // Efecto para manejar las notificaciones SSE con animaciones
  useEffect(() => {
    if (sseNotifications && sseNotifications.length > 0) {
      // Convertir el array mixto a solo tipo Notificacion
      const notisTransformadas = transformarNotificaciones(sseNotifications as unknown[]);
      
      setNotificaciones((prev) => {
        // Crear un Map con las notificaciones existentes para búsqueda rápida
        const notificacionesExistentes = new Map(prev.map(n => [n.id, n]));
        
        // Filtrar solo las notificaciones que realmente son nuevas
        const nuevas = notisTransformadas.filter(nueva => {
          const existente = notificacionesExistentes.get(nueva.id);
          return !existente || JSON.stringify(existente) !== JSON.stringify(nueva);
        });

        // Si hay notificaciones nuevas
        if (nuevas.length > 0) {
          // Marcar las nuevas notificaciones para animación
          const idsNuevas = nuevas.map(n => n.id);
          setNuevasNotificaciones(new Set(idsNuevas));
          
          // Remover la marca de "nueva" después de la animación
          setTimeout(() => {
            setNuevasNotificaciones(new Set());
          }, 2000);

          const notificacionMasReciente = nuevas.reduce((masReciente, actual) => {
            return new Date(actual.creadoEn) > new Date(masReciente.creadoEn) ? actual : masReciente;
          });
          
          // Solo mostrar toast si la notificación es nueva y no leída
          if (!notificacionMasReciente.leida) {
            setToastNotification(notificacionMasReciente);
            setTimeout(() => {
              setToastNotification(null);
            }, 4000);
          }
        }

        // Combinar las notificaciones existentes con las nuevas
        const todasLasNotificaciones = [...prev];
        nuevas.forEach(nueva => {
          const index = todasLasNotificaciones.findIndex(n => n.id === nueva.id);
          if (index !== -1) {
            todasLasNotificaciones[index] = nueva;
          } else {
            todasLasNotificaciones.unshift(nueva);
          }
        });

        return todasLasNotificaciones;
      });
    }
  }, [sseNotifications]);

  const handleVerDetalles = async (notificacion: Notificacion) => {
    setSelectedNotificacion(notificacion);
  };

  const handleCloseModal = async () => {
    if (selectedNotificacion && !selectedNotificacion.leida) {
      try {
        await api.put(`/notificaciones/notificacion-leida/${selectedNotificacion.id}/${usuarioId}`);
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === selectedNotificacion.id ? { ...n, leida: true } : n))
        );
        refreshNotifications();
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }
    setSelectedNotificacion(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId },
      });
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotificacion(null);
      refreshNotifications();
      setMensajeExito("¡Se eliminó correctamente!");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al borrar notificación:", error);
    }
  };

  // Variantes de animación para las notificaciones
  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: -20,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 0.6,
        repeat: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#FCA311]"></div>

      {mensajeExito && (
        <motion.div 
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg border border-green-400 flex items-center gap-2 z-50"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{mensajeExito}</span>
        </motion.div>
      )}

      <AnimatePresence>
        {toastNotification && (
          <ToastNotification
            notificacion={toastNotification}
            onClose={() => setToastNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="pt-8 px-3 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Notificaciones</h1>
          <Link
            href="/Notificaciones/DropDown"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors border border-blue-100 hover:border-blue-300"
          >
            Volver
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#FCA311] rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {notificaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay notificaciones disponibles</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <AnimatePresence>
                  {notificaciones.map((notificacion, index) => {
                    const esNueva = nuevasNotificaciones.has(notificacion.id);
                    
                    return (
                      <motion.div
                        key={notificacion.id}
                        layout
                        variants={notificationVariants}
                        initial={esNueva ? "hidden" : "visible"}
                        animate={esNueva ? ["visible", "pulse"] : "visible"}
                        exit="hidden"
                        className={`relative p-2 sm:p-4 border rounded-lg transition-all duration-300 ${
                          notificacion.leida
                            ? "border-gray-200 bg-white"
                            : "border-[#FCA311] bg-amber-50 shadow-sm"
                        } ${esNueva ? "ring-2 ring-[#FCA311] ring-opacity-50 shadow-lg" : ""}`}
                      >
                        {/* Indicador visual de nueva notificación */}
                        {esNueva && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1]
                              }}
                              transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          </motion.div>
                        )}

                        {/* Efecto de brillo para notificaciones nuevas */}
                        {esNueva && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ 
                              duration: 1.5,
                              repeat: 3,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCA311]/20 to-transparent rounded-lg pointer-events-none"
                          />
                        )}

                        {/* Mobile layout - Ultra compacto para 375px */}
                        <div className="block sm:hidden">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-gray-800 pr-1">
                                {notificacion.titulo}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2" 
                                 dangerouslySetInnerHTML={{ __html: notificacion.descripcion }}>
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                              <p className="text-xs text-gray-500">{formatDate(notificacion.fecha)}</p>
                              {!notificacion.leida && (
                                <motion.span 
                                  initial={esNueva ? { scale: 0 } : { scale: 1 }}
                                  animate={{ scale: 1 }}
                                  className="inline-block mt-1 text-[10px] bg-amber-200 text-amber-800 px-1 py-0.5 rounded-full font-medium"
                                >
                                  Nueva
                                </motion.span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleVerDetalles(notificacion)}
                              className="cursor-pointer text-xs bg-[#FCA311] text-white px-3 py-1 rounded-lg hover:bg-[#E59400] transition-colors"
                            >
                              Ver más
                            </motion.button>
                          </div>
                        </div>

                        {/* Desktop/Tablet layout */}
                        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-2">
                          <div className="col-span-1 flex items-center justify-center">
                            {notificacion.imagenURL && (
                              <motion.div 
                                initial={esNueva ? { scale: 0, rotate: -180 } : { scale: 1, rotate: 0 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2 }}
                                className="w-12 h-12 md:w-[60px] md:h-[60px] rounded-full overflow-hidden flex-shrink-0 border"
                              >
                                <Image
                                  src={notificacion.imagenURL}
                                  alt="Imagen de auto"
                                  width={60}
                                  height={60}
                                  unoptimized
                                  className="object-cover w-full h-full"
                                />
                              </motion.div>
                            )}
                          </div>

                          <div className="col-span-2 flex items-center">
                            <motion.h3 
                              initial={esNueva ? { x: -20, opacity: 0 } : { x: 0, opacity: 1 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-base md:text-xl font-semibold text-gray-800 whitespace-pre-line"
                            >
                              {notificacion.titulo === "Tiempo de Renta Concluido"
                                ? notificacion.titulo.replace(" de ", " de\n").replace(" Renta", "\nRenta")
                                : notificacion.titulo.replace(" ", "\n")}
                            </motion.h3>
                          </div>

                          <div className="col-span-5 flex items-center -ml-4">
                            <motion.p 
                              initial={esNueva ? { y: 10, opacity: 0 } : { y: 0, opacity: 1 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-sm md:text-base text-gray-600 text-left line-clamp-2" 
                              dangerouslySetInnerHTML={{ __html: notificacion.descripcion }}
                            />
                          </div>

                          <div className="col-span-2 flex items-center justify-center">
                            <motion.p 
                              initial={esNueva ? { scale: 0 } : { scale: 1 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-sm md:text-base text-gray-500 font-medium"
                            >
                              {formatDate(notificacion.fecha)}
                            </motion.p>
                          </div>

                          <div className="col-span-2 flex flex-col items-end justify-center gap-1">
                            {!notificacion.leida && (
                              <motion.span 
                                initial={esNueva ? { scale: 0, rotate: 180 } : { scale: 1, rotate: 0 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-xs md:text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium"
                              >
                                Nueva
                              </motion.span>
                            )}
                            <motion.button
                              initial={esNueva ? { scale: 0 } : { scale: 1 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.7 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleVerDetalles(notificacion)}
                              className="cursor-pointer text-sm md:text-lg bg-[#FCA311] text-white px-3 py-1 rounded-lg hover:bg-[#E59400] transition-colors"
                            >
                              Ver más
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedNotificacion && (
          <motion.div
            key="modal-detalles"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50 p-3"
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
    </div>
  );
}