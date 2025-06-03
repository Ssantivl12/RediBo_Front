'use client';
import { useState, useEffect } from 'react';
import { CalificacionUsuario } from '@/types/auto';

interface BarraFiltrosProps {
  comentarios: CalificacionUsuario[];
  onFiltrar: (comentariosFiltrados: CalificacionUsuario[]) => void;
}

export default function BarraFiltros({ comentarios, onFiltrar }: BarraFiltrosProps) {
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const comentariosFiltrados = comentarios.filter(c =>
      (c.comentario || '').toLowerCase().includes(busqueda.toLowerCase())
    );
    onFiltrar(comentariosFiltrados);
  }, [busqueda, comentarios, onFiltrar]);

  const handleClear = () => setBusqueda('');

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Buscar comentarios..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full pl-4 pr-16 py-2 min-h-[38px] border border-gray-400 rounded-full text-sm outline-none"
      />

      {/* Botón de limpiar */}
      {busqueda && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Icono lupa */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#002a5c]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>
    </div>
  );
}
