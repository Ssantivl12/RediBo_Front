import React from 'react';

interface ModalLiberarConfirmacionProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalLiberarConfirmacion({ onConfirm, onCancel }: ModalLiberarConfirmacionProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] text-center">
        <div className="bg-[#F5E4CC] py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-black">¿Está seguro que desea liberar el vehículo?</h2>
        </div>
        <div className="p-6">
          <p className="text-black mb-6">
            ¿Desea liberar el vehículo? Los días especificados en la renta actual, estarán disponibles para una nueva renta
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-[#11295B] hover:bg-blue-800 text-white px-4 py-2 rounded"
              onClick={onCancel}
            >
              CANCELAR
            </button>
            <button
              className="bg-[#FCA311] hover:bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={onConfirm}
            >
              ACEPTAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
