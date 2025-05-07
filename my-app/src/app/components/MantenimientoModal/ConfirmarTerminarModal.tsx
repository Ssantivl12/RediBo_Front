//ConfirmarTerminarModal.tsx
"use client";

import React from "react";

interface ConfirmarTerminarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmarTerminarModal: React.FC<ConfirmarTerminarModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="w-full px-4 py-4 bg-[var(--hueso)] relative">
          <div className="absolute inset-0 bg-[var(--hueso)] z-0"></div>
          <h2 className="text-xl font-semibold text-center text-[var(--azul-oscuro)] relative z-10">
            ¿Está seguro que desea terminar el mantenimiento del vehículo?
          </h2>
        </div>

        <div className="p-6">
          <p className="mb-6 text-center text-gray-600 text-sm">
            El vehículo volverá a estar disponible para la renta.
          </p>
          <div className="flex justify-between space-x-3">
            <button 
              onClick={onClose} 
              className="flex-1 bg-[var(--azul-oscuro)] hover:bg-[#0a1f42] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm} 
              className="flex-1 bg-[var(--naranja)] hover:bg-[#e67e22] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmarTerminarModal;