'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Auto } from '@/types/auto';

export default function GaleriaImagenes({ imagenes, marca, modelo }: Pick<Auto, 'imagenes' | 'marca' | 'modelo'>) {
  const [imagenActual, setImagenActual] = useState(0);

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev < (imagenes?.length ?? 0) - 1 ? prev + 1 : 0));
  };

  const imagenAnterior = () => {
    setImagenActual((prev) => (prev > 0 ? prev - 1 : (imagenes?.length ?? 1) - 1));
  };

  return (
    <div className="relative mx-auto w-[100%] sm:w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border border-black rounded-[20px] overflow-hidden">
      {/* Botón izquierda */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/50 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50"
        onClick={imagenAnterior}
      >
        {'<'}
      </div>

      {/* Imagen */}
      {imagenes && (
        <Image
          key={imagenes[imagenActual].idImagen}
          src={imagenes[imagenActual].direccionImagen}
          alt={`Imagen del auto ${marca} ${modelo}`}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-[20px]"
        />
      )}

      {/* Botón derecha */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/50 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50"
        onClick={siguienteImagen}
      >
        {'>'}
      </div>
    </div>
  );
}
