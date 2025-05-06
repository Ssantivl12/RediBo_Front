"use client";

import React from "react";

interface ExitoTerminarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitoTerminarModal: React.FC<ExitoTerminarModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-[var(--hueso)] w-full p-4 rounded-t-xl">
          <h2 className="text-xl font-semibold text-center text-[var(--azul-oscuro)]">
            Mantenimiento terminado con éxito
          </h2>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <svg className="mx-auto h-12 w-12 text-[var(--verde)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mb-6 text-center text-gray-600 text-sm">
            El vehículo está ahora disponible para renta.
          </p>
          <button 
            onClick={onClose} 
            className="w-full bg-[var(--naranja)] hover:bg-[#dd6b20] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ExitoTerminarModal;