'use client';

import React from 'react';

interface Props {
  titulo: string;
  descripcion: string;
}

export default function TituloDescripcion({ titulo, descripcion }: Props) {
  return (
    <div className="w-full bg-white shadow-sm">
      {/* Barra superior con logo y botones */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <span className="text-3xl font-extrabold text-[#FFA500] drop-shadow-md tracking-wide">
            REDIBO
          </span>
          <div className="flex space-x-4">
            {["Botón1", "Botón2", "Botón3", "Botón4", "Botón5"].map((boton, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold ${
                  boton === "Botón1"
                    ? "text-[#002E6E] font-bold bg-white shadow"
                    : "text-gray-600 hover:text-[#002E6E]"
                }`}
              >
                {boton}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-full bg-[#F1B24A] text-[#002E6E] font-semibold shadow hover:brightness-105">
            Registrarse
          </button>
          <button className="px-4 py-2 rounded-full bg-[#FFA500] text-white font-semibold shadow hover:brightness-110">
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Encabezado dinámico */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-[#002E6E] mb-1">{titulo}</h1>
        <p className="text-base text-gray-700">{descripcion}</p>
      </div>
    </div>
  );
}


  