"use client";

import React, { useState } from "react";

interface RegistrarMantenimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
    costo: string;
    tipoMantenimiento: string;
    kilometraje: string;
  }) => void;
}

const RegistrarMantenimientoModal: React.FC<RegistrarMantenimientoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState("Preventivo");
  const [kilometraje, setKilometraje] = useState("");

  const handleSubmit = () => {
    onSubmit({ fechaInicio, fechaFin, descripcion, costo, tipoMantenimiento, kilometraje });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header con fondo completo */}
        <div className="bg-[var(--hueso)] w-full p-4">
          <h2 className="text-2xl font-semibold text-center text-[var(--azul-oscuro)]">
            Registrar Mantenimiento
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Fecha de Fin (Opcional)
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]"
              min={fechaInicio}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Costo (Opcional)
            </label>
            <input
              type="number"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]"
              min="0"
              step="0.01"
            />
          </div>

            <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">
              Tipo de Mantenimiento
            </label>
            <div className="relative">
              <select
              value={tipoMantenimiento}
              onChange={(e) => setTipoMantenimiento(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)] appearance-none bg-white text-gray-700"
              >
              <option value="" disabled hidden>
                Seleccione un tipo...
              </option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                />
              </svg>
              </div>
            </div>
            </div>

          <div>
            <label className="block text-sm font-medium text-[var(--azul-oscuro)] mb-1">Kilometraje</label>
            <input
              type="number"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--naranja)] focus:border-[var(--naranja)]"
              min="0"
              required
            />
          </div>

          <div className="flex justify-between mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[var(--azul-oscuro)] hover:bg-[#0a1f42] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
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

export default RegistrarMantenimientoModal;
