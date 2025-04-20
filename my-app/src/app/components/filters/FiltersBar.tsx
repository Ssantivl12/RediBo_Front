'use client';
import React from "react";

interface FiltersBarProps {
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ 
  onFilterChange, 
  activeFilter = 'todos' 
}) => {
  const botones = [
    { id: "todos", label: "Todos" },
    { id: "disponibles", label: "Disponibles" },
    { id: "en_renta", label: "En renta" },
    { id: "con_solicitudes", label: "Con solicitudes" },
  ];

  const handleFilterChange = (filterId: string) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

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
              onClick={() => handleFilterChange(btn.id)}  
              className={`px-4 py-1 rounded-full border text-sm font-medium transition
              ${
                activeFilter === btn.id
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
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

export default FiltersBar;