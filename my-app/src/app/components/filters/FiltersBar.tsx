import React, { useState } from "react";

const FiltroSolicitudes = () => {
  const [activo, setActivo] = useState("todos");

  const botones = [
    { id: "todos", label: "Todos" },
    { id: "disponibles", label: "Disponibles" },
    { id: "en_renta", label: "En renta" },
    { id: "con_solicitudes", label: "Con solicitudes" },
  ];

  return (
    <>
      <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-bold text-[#0a3158]">Solicitudes de Renta</h1>
          <p className="text-[#0a3158]">Aprueba o deniega las solicitudes de renta para tus autos</p>
      </div>
    
      <div className="p-4 bg-[#e7d7c3] rounded-lg inline-block w-full">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700 w-full sm:w-auto">
            Filtrar por:
          </span>
          {botones.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActivo(btn.id)}
              className={`px-4 py-1 rounded-full border text-sm font-medium transition
                ${
                  activo === btn.id
                    ? "bg-white text-gray-800 shadow-sm"
                    : "bg-transparent text-[#1d2a5b] border-[#1d2a5b] hover:bg-white hover:text-gray-800"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FiltroSolicitudes;
