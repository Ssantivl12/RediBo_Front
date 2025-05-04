'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface BarraBusquedaProps {
  onBuscar: (valorBusqueda: string) => void;
  totalResultados: number;
}

export default function BarraBusqueda({ onBuscar, totalResultados }: BarraBusquedaProps) {
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [error, setError] = useState('');
  const caracteresNoValidos = /[@#$%]/;

  // Cargar historial
  useEffect(() => {
    const historial = localStorage.getItem('historialBusquedas');
    if (!historial) {
      localStorage.setItem('historialBusquedas', JSON.stringify([]));
    }
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    
    // Validación para no empezar con espacios o tener múltiples espacios
    if (valor.startsWith(' ') || valor.includes('  ')) {
      setError('');
      return;
    }
    
    if (valor.length > 50) return;

    if (caracteresNoValidos.test(valor)) {
      setError('No se permiten símbolos como @, #, $, %');
    } else {
      setError('');
      setValorBusqueda(valor);
    }
  };

  const guardarEnHistorial = (valor: string) => {
    const historial = JSON.parse(localStorage.getItem('historialBusquedas') || '[]');
    if (!historial.includes(valor)) {
      historial.push(valor);
      localStorage.setItem('historialBusquedas', JSON.stringify(historial));
    }
  };

  const ejecutarBusqueda = () => {
    const valor = valorBusqueda.trim();

    if (!valor) {
      onBuscar('');
      return;
    }

    // Validación adicional al ejecutar la búsqueda
    if (valorBusqueda.startsWith(' ') || valorBusqueda.includes('  ')) {
      setError('Por favor corrija los espacios en la búsqueda');
      return;
    }

    const palabras = valor.split(/[\s-]+/);
    if (palabras.length > 2) {
      setError('Formato inválido. Use "Marca Modelo"');
      return;
    }

    setError('');
    onBuscar(valor);
    guardarEnHistorial(valor);
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') ejecutarBusqueda();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 sticky top-0 bg-white z-10 py-4">
      {/* Barra de búsqueda con botón */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />    {/**lupita */}
          </div>
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={valorBusqueda}
            onChange={manejarCambio}
            onKeyDown={manejarEnter}
            className="block w-full pl-10 pr-3 py-3 border border-black rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent text-gray-700"
          />
        </div>
        <button
          onClick={ejecutarBusqueda}
          className="bg-[#FCA311] hover:bg-[#e4920b] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base h-full"
        >
          Buscar
        </button>
      </div>

      {/* Contador de resultados - izquierda debajo */}
      <div className="mt-2 text-left text-gray-600 text-lg pl-2 font-bold">
        {totalResultados} 
        <span className="text-lg">
          {totalResultados === 1 ? ' coche disponible' : ' coches disponibles'}
        </span>
      </div>
      
      {error && <p className="text-red-500 mt-2 text-sm pl-2">{error}</p>}
    </div>
  );
}