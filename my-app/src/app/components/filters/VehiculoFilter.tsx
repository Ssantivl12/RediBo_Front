'use client';

import React from 'react';

const VehiculoFilter = () => {
  return (
    <div className="flex justify-between items-center mt-6">
      {/* Select: Todos los estados */}
      <div className="relative">
        <select
          disabled
          className="appearance-none px-4 py-2 pr-8 border rounded-md bg-[#FCA311] text-white font-semibold cursor-not-allowed"
        >
          <option>Todos los estados</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg
            className="w-4 h-4 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-5-5h10l-5 5z" />
          </svg>
        </div>
      </div>

      {/* Select: Más antiguos */}
      <div className="relative">
        <select
          disabled
          className="appearance-none px-4 py-2 pr-8 border rounded-md bg-[#FCA311] text-white font-semibold cursor-not-allowed"
        >
          <option>Más antiguos</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg
            className="w-4 h-4 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-5-5h10l-5 5z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VehiculoFilter;
