"use client";

import React from "react";

interface ExitoMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetForm?: () => void;
}

const ExitoMantenimientoModal: React.FC<ExitoMantenimientoModalProps> = ({ 
  isOpen, 
  onClose,
  onResetForm
}) => {
  const handleAccept = () => {
    if (onResetForm) {
      onResetForm();
    }
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] text-center">
        <div className="bg-[#F5E4CC] py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-black">
            Vehículo puesto en mantenimiento con éxito
          </h2>
        </div>
        <div className="p-6">
          <p className="text-black mb-6">La acción se ha realizado correctamente.</p>
          <button
            className="bg-[#FCA311] hover:bg-yellow-500 text-white px-6 py-2 rounded"
            onClick={handleAccept}
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ExitoMantenimientoModal;