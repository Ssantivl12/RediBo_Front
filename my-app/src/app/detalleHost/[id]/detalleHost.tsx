'use client';

import { useEffect, useState } from 'react';
import { CalificacionUsuario } from '@/types/auto';
import Image from 'next/image';
import PanelComentariosHost from './PanelComentarioHost';
import { getUsuarioPorId, getComentariosDeHost } from '@/libs/api';

function NavbarDetalle() {
  return (
    <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] bg-white flex justify-between items-center">
      <h1 className="text-3xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-lg">REDIBO</h1>
      <button
        onClick={() => console.log('Botón de perfil presionado')}
        className="p-1 rounded-full hover:opacity-80 transition"
      >
        <Image
          src="/imagenesIconos/image.png"
          width={50}
          height={50}
          alt="Icono de perfil"
          unoptimized
          className="w-7 h-7 cursor-pointer"
        />
      </button>
    </div>
  );
}

interface Props {
  id:string;
  comentarios: CalificacionUsuario[];
}

export default function DetalleHost({ id, comentarios: comentariosIniciales }: Props) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [comentarios, setComentarios] = useState<CalificacionUsuario[]>(comentariosIniciales);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);

useEffect(() => {
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    if (!Array.isArray(comentariosIniciales) || comentariosIniciales.length === 0) {
      setError('No hay comentarios disponibles.');
      setCargando(false);
      return;
    }

    if (!comentariosIniciales || comentariosIniciales.length === 0) {
      setError('No hay comentarios disponibles o falta el ID del calificado');
      setCargando(false);
      return;
    }


    try {
      const [nuevosComentariosRes, usuario] = await Promise.all([
        getComentariosDeHost(id),
        getUsuarioPorId(id.toString())
      ]);

      setComentarios(nuevosComentariosRes.data);
      setNombre(usuario.data.nombre);
      setApellido(usuario.data.apellido);
    } catch (err) {
      console.error('Error al cargar los datos del host:', err);
      setError('Error al cargar los datos del host');
    } finally {
      setCargando(false);
    }
  };

  cargarDatos();
}, []);


  const handleMostrarPanel = () => setMostrarPanel(true);
  const handleCerrarPanel = () => setMostrarPanel(false);

  return (
    <div>
      <NavbarDetalle />

      <main className="p-6">
        <h2 className="text-xl font-semibold text-[#11295b] mb-4">Perfil del Host</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {nombre} {apellido}
          </h3>
        </div>

        {cargando && (
          <div className="flex items-center gap-2 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#fca311]"></div>
            <span className="text-gray-600">Cargando comentarios...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
            Se cargaron {comentarios.length} comentario(s) exitosamente
          </div>
        )}

        <button
          onClick={handleMostrarPanel}
          disabled={cargando}
          className={`
            px-5 py-2.5 rounded-full text-base font-semibold transition
            ${cargando
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#fca311] hover:bg-[#e69500] active:bg-[#cc8400]'
            } 
            text-white
          `}
        >
          {cargando ? 'Cargando...' : 'Mostrar todas las reseñas'}
        </button>

        {mostrarPanel && !cargando && (
          <PanelComentariosHost
            mostrar={mostrarPanel}
            onClose={handleCerrarPanel}
            comentarios={comentarios}
            nombre={nombre}
            apellido={apellido}
          />
        )}
      </main>
    </div>
  );
}
