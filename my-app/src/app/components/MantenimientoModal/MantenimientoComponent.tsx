"use client";

import React, { useState } from "react";
import RegistrarMantenimientoModal from "./RegistrarMantenimientoModal";
import ConfirmarMantenimientoModal from "./ConfirmarMantenimientoModal";
import ExitoMantenimientoModal from "./ExitoMantenimientoModal";
import ConfirmarTerminarModal from "./ConfirmarTerminarModal";
import ExitoTerminarModal from "./ExitoTerminarModal";

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

const MantenimientoComponent = () => {
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);
  const [isExitoModalOpen, setIsExitoModalOpen] = useState(false);
  const [isConfirmarTerminarModalOpen, setIsConfirmarTerminarModalOpen] = useState(false);
  const [isExitoTerminarModalOpen, setIsExitoTerminarModalOpen] = useState(false);

  const handleRegistrarMantenimiento = (mantenimientoData: MantenimientoData) => {
    console.log("Datos del mantenimiento:", mantenimientoData);
    setIsRegistrarModalOpen(false);
    setIsConfirmarModalOpen(true);
  };

  const handleConfirmarMantenimiento = () => {
    setIsConfirmarModalOpen(false);
    setIsExitoModalOpen(true);
  };

  const handleConfirmarTerminarMantenimiento = () => {
    setIsConfirmarTerminarModalOpen(false);
    setIsExitoTerminarModalOpen(true);
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={() => setIsRegistrarModalOpen(true)} 
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
      >
        Poner en mantenimiento
      </button>

      <button 
        onClick={() => setIsConfirmarTerminarModalOpen(true)} 
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
      >
        Terminar mantenimiento
      </button>

      <RegistrarMantenimientoModal
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
        onSubmit={handleRegistrarMantenimiento}
      />

      <ConfirmarMantenimientoModal
        isOpen={isConfirmarModalOpen}
        onClose={() => setIsConfirmarModalOpen(false)}
        onConfirm={handleConfirmarMantenimiento}
      />

      <ExitoMantenimientoModal
        isOpen={isExitoModalOpen}
        onClose={() => setIsExitoModalOpen(false)}
      />

      <ConfirmarTerminarModal
        isOpen={isConfirmarTerminarModalOpen}
        onClose={() => setIsConfirmarTerminarModalOpen(false)}
        onConfirm={handleConfirmarTerminarMantenimiento}
      />

      <ExitoTerminarModal
        isOpen={isExitoTerminarModalOpen}
        onClose={() => setIsExitoTerminarModalOpen(false)}
      />
    </div>
  );
};

export default MantenimientoComponent;