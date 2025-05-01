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
    <div className="relative w-full h-[250px] border border-black rounded-[20px] overflow-hidden">
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50"
        onClick={imagenAnterior}
      >
        {'<'}
      </div>

      {imagenes && (
        <Image
          key={imagenes[imagenActual].id}
          src={imagenes[imagenActual].direccionImagen}
          alt={`Imagen del auto ${marca} ${modelo}`}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-[20px]"
        />
      )}

      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-[40px] text-black z-50"
        onClick={siguienteImagen}
      >
        {'>'}
      </div>
    </div>
  );
}
