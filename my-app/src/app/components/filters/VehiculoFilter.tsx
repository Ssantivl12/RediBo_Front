'use client';

import React from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const VehiculoFilter = ({ search, setSearch }: Props) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mt-6">
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o placa"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md w-64"
      />

      {/* Selects (aún deshabilitados) */}
      <select
        disabled
        className="appearance-none px-4 py-2 pr-8 border rounded-md bg-[#FCA311] text-white font-semibold cursor-not-allowed"
      >
        <option>Todos los estados</option>
      </select>

      <select
        disabled
        className="appearance-none px-4 py-2 pr-8 border rounded-md bg-[#FCA311] text-white font-semibold cursor-not-allowed"
      >
        <option>Más antiguos</option>
      </select>
    </div>
  );
};

export default VehiculoFilter;
