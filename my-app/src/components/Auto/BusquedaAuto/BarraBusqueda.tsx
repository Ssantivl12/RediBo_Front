'use client';

import { useState, useEffect } from 'react';

interface BarraBusquedaProps {
  onBuscar: (valorBusqueda: string) => void;
}

export default function BarraBusqueda({ onBuscar }: BarraBusquedaProps) {
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [error, setError] = useState('');
  const caracteresNoValidos = /[@#$%]/;

  // Opcional: cargar historial (para usar en el futuro)
  useEffect(() => {
    const historial = localStorage.getItem('historialBusquedas');
    if (!historial) {
      localStorage.setItem('historialBusquedas', JSON.stringify([]));
    }
  }, []);

  {/**es pa ver si llega un comentario */}
  useEffect(() => {
    console.log('BarraBusqueda montada');
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
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
      setError('Por favor, ingresa una marca o modelo para buscar.');
      return;
    }

    if (valor.split(' ').length > 2) {
      setError('Solo se permite buscar una marca o modelo a la vez.');
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
    <div className="w-full max-w-4xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Buscar por Marca o Modelo..."
          value={valorBusqueda}
          onChange={manejarCambio}
          onKeyDown={manejarEnter}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] text-sm sm:text-base"
        />
        <button
          onClick={ejecutarBusqueda}
          className="bg-[#FCA311] text-white px-4 py-3 rounded-lg hover:bg-[#e4920b] text-sm sm:text-base"
        >
          Buscar
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
