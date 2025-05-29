import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, X } from 'lucide-react';

interface ModalResenaProps {
  isOpen: boolean;
  imagenURL?: string;
  nombreVehiculo?: string;
  onClose: () => void;
  onSubmit: (calificacion: number, comentario: string) => void;
}

const ModalResena = ({ isOpen, imagenURL, nombreVehiculo, onClose, onSubmit }: ModalResenaProps) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mostrarFallback, setMostrarFallback] = useState(false);

  if (!isOpen) return null;

  const fechaActual = new Date().toLocaleString('es-ES');

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
            <h2 className="text-xl font-semibold text-white text-center">Reseña y comentarios</h2>
            <button
              onClick={onClose}
              className="absolute right-3 top-3 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-sm"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4 flex flex-col gap-4">
            {/* Fecha */}
            <p className="text-xs text-gray-500">{fechaActual}</p>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Columna izquierda: Texto, estrellas y comentario */}
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">
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
              <div className="w-full md:w-60 h-48 flex items-center justify-center border border-gray-300 bg-gray-100 rounded">
                {imagenURL && !mostrarFallback ? (
                  <img
                    src={imagenURL}
                    alt="Vehículo"
                    className="w-full h-full object-contain rounded"
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
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                cancelar
              </button>
              <button
                onClick={() => onSubmit(calificacion, comentario)}
                className="px-4 py-2 bg-[#FCA311] text-white rounded hover:bg-orange-600"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalResena;
