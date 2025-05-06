"use client";

import React from "react";

interface ConfirmarMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmarMantenimientoModal: React.FC<ConfirmarMantenimientoModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header con fondo hueso extendido */}
        <div className="w-full px-4 py-4 bg-[var(--hueso)] relative">
          <div className="absolute inset-0 bg-[var(--hueso)] z-0"></div>
          <h2 className="text-xl font-semibold text-center text-[var(--azul-oscuro)] relative z-10">
            ¿Está seguro que desea poner en mantenimiento el vehículo?
          </h2>
        </div>

        <div className="p-6">
          <p className="mb-6 text-center text-gray-600 text-sm">
            ¿Desea poner el vehículo en mantenimiento? Los días especificados, el vehículo no podrá ser rentado.
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
              className="flex-1 bg-[var(--naranja)] hover:bg-[#e69500] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmarMantenimientoModal;