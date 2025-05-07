"use client";

import React, { useState } from "react";
import RegistrarMantenimientoModal from "./RegistrarMantenimientoModal";
import ConfirmarMantenimientoModal from "./ConfirmarMantenimientoModal";
import ExitoMantenimientoModal from "./ExitoMantenimientoModal";
import ConfirmarTerminarModal from "./ConfirmarTerminarModal";
import ExitoTerminarModal from "./ExitoTerminarModal";
import CancelarMantenimientoModal from "./CancelarMantenimientoModal";

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

const MantenimientoComponent: React.FC = () => {
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);
  const [isExitoModalOpen, setIsExitoModalOpen] = useState(false);
  const [isConfirmarTerminarModalOpen, setIsConfirmarTerminarModalOpen] = useState(false);
  const [isExitoTerminarModalOpen, setIsExitoTerminarModalOpen] = useState(false);
  const [isCancelarModalOpen, setIsCancelarModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<MantenimientoData>({
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    costo: "",
    tipoMantenimiento: "Preventivo",
    kilometraje: ""
  });

  const handleRegistrarMantenimiento = (mantenimientoData: MantenimientoData) => {
    setFormData(mantenimientoData);
    setIsRegistrarModalOpen(false);
    setIsConfirmarModalOpen(true);
  };

  const handleConfirmarMantenimiento = () => {
    setIsConfirmarModalOpen(false);
    setIsExitoModalOpen(true);
    console.log("Datos enviados:", formData);
  };

  const handleCancelarMantenimiento = () => {
    setIsConfirmarModalOpen(false);
    setIsCancelarModalOpen(true);
  };

  const handleConfirmarTerminarMantenimiento = () => {
    setIsConfirmarTerminarModalOpen(false);
    setIsExitoTerminarModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      descripcion: "",
      costo: "",
      tipoMantenimiento: "Preventivo",
      kilometraje: ""
    });
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
        formData={formData}
        setFormData={setFormData}
        onCancel={resetFormData}
      />

      <ConfirmarMantenimientoModal
        isOpen={isConfirmarModalOpen}
        onClose={handleCancelarMantenimiento}
        onConfirm={handleConfirmarMantenimiento}
      />

      <ExitoMantenimientoModal
        isOpen={isExitoModalOpen}
        onClose={() => setIsExitoModalOpen(false)}
        onResetForm={resetFormData}
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

      <CancelarMantenimientoModal
        isOpen={isCancelarModalOpen}
        onClose={() => {
          setIsCancelarModalOpen(false);
          setIsRegistrarModalOpen(true);
        }}
        onConfirmCancel={() => {
          resetFormData();
          setIsCancelarModalOpen(false);
        }}
      />
    </div>
  );
};

export default MantenimientoComponent;