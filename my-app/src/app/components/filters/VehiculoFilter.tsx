'use client';

import React, { useState } from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  setEstadoFilter?: (value: string) => void;
  setOrdenamiento?: (value: string) => void;
}

const ordenOptions = [
  'Ordenar por nombre',
  'Ordenar por placa',
  'Ordenar por estado',
  'Más recientes',
  'Más antiguos',
];

const estadoOptions = [
  'Todos los estados',
  'En renta',
  'Disponible',
  'Reservado',
  'No disponible',
];

const VehiculoFilter = ({
  search,
  setSearch,
  setEstadoFilter,
  setOrdenamiento,
}: Props) => {
  const [estado, setEstado] = useState('Todos los estados');
  const [orden, setOrden] = useState('Más antiguos');
  const [showEstado, setShowEstado] = useState(false);
  const [showOrden, setShowOrden] = useState(false);

  const toggleEstado = () => setShowEstado((prev) => !prev);
  const toggleOrden = () => setShowOrden((prev) => !prev);

  const handleEstadoSelect = (value: string) => {
    setEstado(value);
    setEstadoFilter?.(value);
    setShowEstado(false);
  };

  const handleOrdenSelect = (value: string) => {
    setOrden(value);
    setOrdenamiento?.(value);
    setShowOrden(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center w-full relative z-10">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o placa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md w-64"
      />

      {/* Selector de estado */}
      <div className="relative">
        <button
          onClick={toggleEstado}
          className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-56 flex justify-between items-center"
        >
          {estado} <span className="ml-2 text-black">▼</span>
        </button>
        {showEstado && (
          <ul className="absolute top-full mt-1 w-56 border border-gray-300 bg-white rounded-md shadow-md z-20">
            {estadoOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleEstadoSelect(option)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  option === estado ? 'bg-[#FFA726] text-white' : 'text-black'
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selector de ordenamiento */}
      <div className="relative ml-auto">
        <button
          onClick={toggleOrden}
          className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-56 flex justify-between items-center"
        >
          {orden} <span className="ml-2 text-black">▼</span>
        </button>
        {showOrden && (
          <ul className="absolute top-full mt-1 w-56 border border-gray-300 bg-white rounded-md shadow-md z-20">
            {ordenOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleOrdenSelect(option)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  option === orden ? 'bg-[#FFA726] text-white' : 'text-black'
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VehiculoFilter;