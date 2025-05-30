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
    <div className="w-full relative z-10 mb-6">
      {/* Layout para pantallas grandes */}
      <div className="hidden md:flex md:items-center md:justify-between gap-4 w-full">
        {/* Izquierda: búsqueda y estado */}
        <div className="flex gap-4">
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o placa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent"
          />

          {/* Selector de estado */}
          <div className="relative w-56">
            <button
              onClick={toggleEstado}
              className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center hover:bg-[#FF9800] transition-colors"
            >
              {estado} <span className="ml-2 text-black">▼</span>
            </button>
            {showEstado && (
              <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20">
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
        </div>

        {/* Derecha: ordenamiento */}
        <div className="relative w-56">
          <button
            onClick={toggleOrden}
            className="bg-[#FFA726] text-white px-4 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center hover:bg-[#FF9800] transition-colors"
          >
            {orden} <span className="ml-2 text-black">▼</span>
          </button>
          {showOrden && (
            <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20">
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

      {/* Layout para pantallas pequeñas */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o placa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent"
        />

        {/* Contenedor de filtros en fila */}
        <div className="flex gap-2">
          {/* Selector de estado */}
          <div className="relative flex-1">
            <button
              onClick={toggleEstado}
              className="bg-[#FFA726] text-white px-3 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center text-sm hover:bg-[#FF9800] transition-colors"
            >
              <span className="truncate">{estado}</span>
              <span className="ml-2 text-black flex-shrink-0">▼</span>
            </button>
            {showEstado && (
              <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                {estadoOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleEstadoSelect(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
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
          <div className="relative flex-1">
            <button
              onClick={toggleOrden}
              className="bg-[#FFA726] text-white px-3 py-2 border border-[#FFA726] rounded-md w-full flex justify-between items-center text-sm hover:bg-[#FF9800] transition-colors"
            >
              <span className="truncate">{orden}</span>
              <span className="ml-2 text-black flex-shrink-0">▼</span>
            </button>
            {showOrden && (
              <ul className="absolute top-full mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                {ordenOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOrdenSelect(option)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
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
      </div>
    </div>
  );
};

export default VehiculoFilter;