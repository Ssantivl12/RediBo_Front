"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface ExitoTerminarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitoTerminarModal: React.FC<ExitoTerminarModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] text-center">
        <div className="bg-[#F5E4CC] py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-black">
            Mantenimiento terminado con éxito
          </h2>
        </div>
        <div className="p-6">
          <CheckCircle className="mx-auto mb-4 text-[#FCA311]" size={48} />
          <p className="text-black mb-6">El vehículo está ahora disponible para renta.</p>
          <button
            className="bg-[#FCA311] hover:bg-yellow-500 text-white px-6 py-2 rounded"
            onClick={onClose}
          >
            ACEPTAR
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ExitoTerminarModal;