import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { toast } from "react-hot-toast";
import api from '@/libs/axiosConfig';
import Image from 'next/image';

interface ModalResenaProps {
  isOpen: boolean;
  imagenURL?: string;
  nombreVehiculo?: string;
  rentaId: string;
  onClose: () => void;
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

const ModalResena = ({ isOpen, imagenURL, nombreVehiculo, rentaId, onClose }: ModalResenaProps) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mostrarFallback, setMostrarFallback] = useState(false);

  if (!isOpen) return null;

  const fechaActual = new Date().toLocaleString('es-ES');

  const handleEnviarComentario = async () => {
    try {
      console.log(comentario);
      await api.post("/calificaciones/crear-calificacion", {
        rentaId: rentaId, // Asegúrate de que notification.tipoEntidad es el id correcto
        puntuacion: calificacion,                     // Cambia esto si tienes un input para la puntuación
        comentario: comentario             // El backend lo recibe como 'comentario'
      });

      toast.success('Comentario enviado correctamente');
      setComentario("");
      onClose();
    } catch (error) {
      toast.error('Error al enviar el comentario');
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-resena"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ENCABEZADO CON FONDO NARANJA Y BOTÓN X PERSONALIZADO */}
          <div className="bg-[#FCA311] relative px-6 py-3 rounded-t-lg">
            <h2 className="text-xl font-semibold text-white text-center underline">Reseña y comentarios</h2>
            <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded"
          >
            ✕
          </button>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4">
            {/* Fecha */}
            <p className="text-xs text-gray-500"> {formatDate(fechaActual)}  </p>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Columna izquierda: Texto, estrellas y comentario */}
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2 mt-3">
                  Mi experiencia con el vehículo <strong>{nombreVehiculo ?? ''}</strong> fue...
                </p>

                {/* Estrellas */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      onClick={() => setCalificacion(i + 1)}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-7 w-7 cursor-pointer ${i < calificacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                      viewBox="0 0 24 24"
                      fill={i < calificacion ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  añade un comentario <strong>(opcional)</strong>
                </p>

                {/* Comentario */}
                <textarea
                  className="w-full border rounded p-2 text-sm text-gray-800"
                  rows={4}
                  placeholder="Escribe aquí...."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>

              {/* Columna derecha: Imagen */}
              <div className="w-full md:w-60 h-60 flex items-center justify-center rounded">
                {imagenURL && !mostrarFallback ? (
                  <Image
                    src={imagenURL}
                    alt="Vehículo"
                    width={60}
                    height={60}
                    unoptimized
                    className="w-full h-auto max-w-xs object-contain rounded-lg"
                    onError={() => setMostrarFallback(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-xs text-center mt-1">Imagen asociada al vehículo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleEnviarComentario}
                className="px-4 py-2 bg-[#FCA311] text-white rounded hover:bg-orange-600"
              >
                Enviar
              </button>

              <button
                onClick={onClose}
                className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cerrar  
              </button>

            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalResena;
