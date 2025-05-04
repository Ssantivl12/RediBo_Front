'use client';

import Navbar from '@/components/navbar/NavbarDetalle';
import GaleriaImagenes from '@/components/Auto/GaleriaImagenes';
import Caracteristicas from '@/components/Auto/Caracteristicas';
import InfoHost from '@/components/Auto/InfoHost';
import Precio from '@/components/Auto/Precio';
import PanelComentarios from '@/components/Auto/PanelComentarios';
import { useEffect, useState } from 'react';
import { Auto, Comentario } from '@/types/auto';

interface Props {
  auto: Auto;
}

export default function DetalleCocheCliente({ auto }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mostrarPanel, setMostrarPanel] = useState(false);

  useEffect(() => {
    import('@/libs/api').then(({ getComentariosDeAuto }) => {
      getComentariosDeAuto(auto.id)
        .then((data) => setComentarios(data.data))
        .catch((err) => {
          console.error('Error al obtener comentarios:', err);
          setComentarios([]);
        });
    });
  }, [auto.id]);
  const comentariosValidos = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '');
  const promedio = comentariosValidos.length > 0
  ? comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) / comentariosValidos.length
  : 0;
  console.log("Propietario recibido:", auto.propietario);

  return (
    <>
      <Navbar />

      <PanelComentarios
        mostrar={mostrarPanel}
        onClose={() => setMostrarPanel(false)}
        comentarios={comentarios}
        marca={auto.marca}
        modelo={auto.modelo}
      />
      
      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pb-10">
        <div className="max-w-[1550px] mx-auto">
          <h1 className="mt-6 text-4xl text-[#11295B] font-bold text-left mb-6 pl-2 sm:pl-4">
            {auto.marca} - {auto.modelo}
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Galería + detalles */}
            <div className="flex-1 min-w-[450px] max-w-full">
              <GaleriaImagenes imagenes={auto.imagenes} marca={auto.marca} modelo={auto.modelo} />

              <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg text-[#11295B]">Calificación</span>
                <span className="text-lg text-black font-medium">
                  {promedio.toFixed(1)}
                </span>
                <div className="text-[#fca311] text-2xl leading-none">
                  {[...Array(Math.floor(promedio))].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {[...Array(5 - Math.floor(promedio))].map((_, i) => (
                    <span key={i}>☆</span>
                  ))}
                </div>
              </div>


            <button
              className="bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition hover:bg-[#e69500] active:bg-[#cc8400]"
              onClick={() => setMostrarPanel(true)}
            >
              Ver Reseñas
            </button>
          </div>


              <div className="bg-white mt-5">
                <h3 className="text-[#11295B] text-xl font-semibold">Detalles</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-4 mt-3">
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Año:</strong>
                    <span className="font-normal text-black">{auto.año}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Placa:</strong>
                    <span className="font-normal text-black">{auto.placa.replace('-', '\u2011')}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Color:</strong>
                    <span className="font-normal text-black">{auto.color}</span>
                  </div>
                </div>

                <h4 className="text-[#11295B] text-lg font-semibold mt-4">Descripción</h4>
                <p className="font-normal text-black">{auto.descripcion}</p>
              </div>
            </div>

            {/* Características */}
            <div className="flex-1 min-w-[200px] max-w-full">
              <div className="bg-white p-5 w-full">
                <h2 className="text-[#11295B] text-xl font-bold mb-4">Características Principales</h2>
                <Caracteristicas auto={auto} />
              </div>
            </div>

            {/* Info host + precio */}
            <div className="flex-1 min-w-[250px] max-w-full flex flex-col gap-6">
            <InfoHost
              propietario={auto.propietario}
              marca={auto.marca}
              modelo={auto.modelo}
            />
              <Precio precioPorDia={auto.precioRentaDiario} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
