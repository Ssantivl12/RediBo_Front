'use client';

import { useEffect, useState } from 'react';
import { CalificacionUsuario } from '@/types/auto';
import Image from 'next/image';
import PanelComentariosHost from './PanelComentarioHost';
import { getUsuarioPorId, getComentariosDeHost } from '@/libs/api';
import TarjetaHost from '@/components/Auto/DetallesHost/TarjetaHost';
import InformacionHost from '@/components/Auto/DetallesHost/InformacionHost';
import NavbarDetalle from '@/components/navbar/NavbarDetalle';


interface Props {
  id: string;
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
  }, [id]);

  const handleMostrarPanel = () => setMostrarPanel(true);
  const handleCerrarPanel = () => setMostrarPanel(false);

  const primerosTresComentarios = comentarios.slice(0, 3);

  return (
    <div>
      <NavbarDetalle />

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-[#11295b] text-center md:text-left">
          Acerca del Anfitrión
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          {/* Tarjeta del Host (lado izquierdo) */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <TarjetaHost />
          </div>
          
          {/* Información del Host (lado derecho) */}
          <div className="w-full md:w-2/3 mt-4 md:mt-0">
            <InformacionHost />
          </div>
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
          <div>
            <h3 className="text-lg font-bold text-[#11295b] mb-4">Reseñas</h3>
            <div className="flex gap-4 mb-6">
              {primerosTresComentarios.map((comentario) => (
                <div
                  key={comentario.idCalificacion}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm w-full flex flex-col items-start"
                >
                  <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="/imagenesIconos/usuario.png"
                        alt="Usuario"
                        className="w-10 h-10 rounded-full"
                        width={50}
                        height={50}
                        unoptimized
                      />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {nombre} {apellido}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comentario.fechaCreacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{comentario.comentario}</p>
                  <div className="flex items-center text-yellow-400 text-xl">
                    {'★'.repeat(comentario.puntuacion)}
                    {'☆'.repeat(5 - comentario.puntuacion)}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleMostrarPanel}
              disabled={cargando}
              className={`px-5 py-2.5 rounded-full text-base font-semibold transition ${
                cargando
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#fca311] hover:bg-[#e69500] active:bg-[#cc8400]'
              } text-white`}
            >
              {cargando ? 'Cargando...' : 'Mostrar todas las reseñas'}
            </button>
          </div>
        )}

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
