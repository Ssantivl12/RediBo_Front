'use client';

import { AlertTriangle } from 'lucide-react';

interface ModalConfirmacionEliminarProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmacionEliminar = ({
  isOpen,
  onConfirm,
  onCancel,
}: ModalConfirmacionEliminarProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-sm sm:max-w-md p-4 sm:p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
          ¿Eliminar notificación?
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta notificación?
        </p>
        
        <div className="flex justify-center gap-4 sm:gap-8 mt-4">
          <button
            onClick={onCancel}
            className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1.5 px-3 sm:px-4 rounded text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 sm:px-4 rounded text-sm"
          >
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"/>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEliminar;