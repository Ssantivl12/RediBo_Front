'use client';

import { useState } from 'react';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';
import ModalResena from './ModalResena';
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  notification: {
    titulo: string;
    descripcion: string;
    fecha: string;
    tipo: string;
    tipoEntidad: string;
    entidadId: string;
    imagenURL?: string;
    calificacion?: number;
    comentario?: string;
  };
  onClose: () => void;
  onDelete: () => void;
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

//simulado porque deberian ser por peticion del back

function extraerNombreVehiculo(descripcion: string): string {
  const match = descripcion.match(/vehículo ([^ ]+(?: [^ ]+)*) del modelo/i);
  return match ? match[1] : "Vehículo";
}

function extraerModeloVehiculo(descripcion: string): string {
  const match = descripcion.match(/del modelo ([^ ]+(?: [^ ]+)*) y con placa/i);
  return match ? match[1] : "Modelo";
}

function extraerPlacaVehiculo(descripcion: string): string {
  const match = descripcion.match(/placa ([A-Z0-9]+)/i);
  return match ? match[1] : "Placa";
}

const ModalDetallesRenta = ({ isOpen, notification, onClose, onDelete }: ModalProps) => {
  if (!isOpen) return null;
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarFallback, setMostrarFallback] = useState(false);
  const [mostrarModalResena, setMostrarModalResena] = useState(false);

  const infoVehiculo = {
    nombre: extraerNombreVehiculo(notification.descripcion),
    modelo: extraerModeloVehiculo(notification.descripcion),
    placa: extraerPlacaVehiculo(notification.descripcion),
  };

  const descripcionVehiculo = infoVehiculo.nombre + ` (modelo ${infoVehiculo.modelo} y placa ${infoVehiculo.placa})`;
  // Función para manejar el submit de la reseña
  const handleSubmitResena = (calificacion: number, comentario: string) => {
    console.log('Reseña enviada:', { calificacion, comentario });
    // Aquí puedes agregar lógica para enviar la reseña a un backend o actualizar estado

    // Cerrar el modal de reseña
    setMostrarModalResena(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded"
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold text-white text-center w-full underline">{notification.titulo}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row-reverse gap-4">
            {notification.imagenURL && !mostrarFallback ? (
              <img
                src={notification.imagenURL}
                alt="Imagen"
                className="w-full h-auto max-w-xs object-contain rounded-lg"
                onError={() => setMostrarFallback(true)}
              />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">imagen.jpg</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-800 mt-2">{formatDate(notification.fecha)}</p>
              <p className="text-gray-800 whitespace-pre-line mt-3" dangerouslySetInnerHTML={{ __html: notification.descripcion }}></p>
              {notification.titulo === "Comentario recibido" && ( 
                <div className="mt-4">
                  {/* Estrellas de calificación */}
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }, (_, i) => {
                      const isFilled = i < (notification.calificacion ?? 0);
                      return (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-6 w-6 ${
                            isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                          }`}
                          viewBox="0 0 24 24"
                          fill={isFilled ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                        </svg>
                      );
                    })}
                  </div>

                  {/* Comentario */}
                  <p className="text-sm font-semibold text-gray-700 mb-1">Comentario:</p>
                  <div className="border rounded p-2 bg-gray-50 text-gray-800 text-sm whitespace-pre-line">
                    {notification.comentario || "Sin comentario"}
                  </div>
                </div>
              )}   
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 p-4 border-t">
          <button
            onClick={() => setMostrarConfirmacion(true)}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Borrar
          </button>

          {notification.titulo === 'Renta Cancelada' && (
            <button
              onClick={onClose}
              className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Volver a rentar
            </button>
          )}

          {notification.titulo === 'Tiempo de Renta Concluido' && (
            <button
              onClick={() => setMostrarModalResena(true)}
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Comentar
            </button>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {notification.titulo === 'Calificación Recibida'
              ? "Ver calificación"
              : notification.titulo === 'Reserva Confirmada'
              ? "Ver reserva"
              : "Cerrar"}
          </button>     
        </div>
      </div>

      <AnimatePresence>
        {mostrarConfirmacion && (
          <motion.div
            key="modal-confirmacion"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
          >
            <ModalConfirmacionEliminar
              isOpen={true}
              onCancel={() => setMostrarConfirmacion(false)}
              onConfirm={() => {
                onDelete();
                setMostrarConfirmacion(false);
                onClose();
              }}
            />
          </motion.div>
        )}

        {mostrarModalResena && (
          <motion.div
            key="modal-resena"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
          >
            <ModalResena
              isOpen={true}
              onClose={() => setMostrarModalResena(false)}
              onSubmit={handleSubmitResena}
              imagenURL={notification.imagenURL}
              nombreVehiculo={descripcionVehiculo}
              rentaId={notification.entidadId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalDetallesRenta;
