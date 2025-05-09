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

interface MantenimientoComponentProps {
  onMantenimientoExitoso: () => void;
  onTerminarMantenimiento: () => void;
  estadoInicial: boolean;
}

const MantenimientoComponent: React.FC<MantenimientoComponentProps> = ({
  onMantenimientoExitoso,
  onTerminarMantenimiento,
  estadoInicial
}) => {
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);
  const [isExitoModalOpen, setIsExitoModalOpen] = useState(false);
  const [isConfirmarTerminarModalOpen, setIsConfirmarTerminarModalOpen] = useState(false);
  const [isExitoTerminarModalOpen, setIsExitoTerminarModalOpen] = useState(false);
  const [isCancelarModalOpen, setIsCancelarModalOpen] = useState(false);
  const [enMantenimiento, setEnMantenimiento] = useState(estadoInicial);
  
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
    setEnMantenimiento(true);
    onMantenimientoExitoso();
    console.log("Datos enviados:", formData);
  };

  const handleCancelarMantenimiento = () => {
    setIsConfirmarModalOpen(false);
    setIsCancelarModalOpen(true);
  };

  const handleConfirmarTerminarMantenimiento = () => {
    setIsConfirmarTerminarModalOpen(false);
    setIsExitoTerminarModalOpen(true);
    setEnMantenimiento(false);
    onTerminarMantenimiento();
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
    <div>
      {enMantenimiento ? (
        <button 
          onClick={() => setIsConfirmarTerminarModalOpen(true)} 
          className="bg-[#FCA311] hover:bg-yellow-500 text-white py-2 px-4 rounded-md transition-colors"
        >
          Terminar mantenimiento
        </button>
      ) : (
        <button 
          onClick={() => setIsRegistrarModalOpen(true)} 
          className="bg-[#11295B] hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
        >
          Poner en mantenimiento
        </button>
      )}

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