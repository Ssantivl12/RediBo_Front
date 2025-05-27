'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function TarjetaHost() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get('nombre') || 'Nombre';
  const apellido = searchParams.get('apellido') || 'Apellido';

  return (
    <div className="bg-white rounded-2xl border border-black p-5 w-full max-w-[320px] h-[180px] shadow-sm flex justify-between items-center mx-auto md:mx-0">
      {/* Sección del host (imagen + nombre) */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center bg-white">
          <Image
            src="/imagenesIconos/usuario.png"
            alt="Host"
            width={48}
            height={48}
            className="w-18 h-18"
            unoptimized
          />
        </div>
        <p className="text-lg font-semibold text-gray-900 text-center mt-2 leading-5">
          {nombre}<br />{apellido}
        </p>
      </div>

      {/* Calificación y reseñas */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="text-xl font-semibold text-black">4.5</span>
          <span className="text-lg text-[#fca311]">★</span>
        </div>
        <p className="text-base text-gray-500">Calificación</p>
        <div className="border-t mt-3">
          <span className="text-xl font-semibold text-black">2</span>
          <p className="text-base text-gray-500">Reseñas</p>
          <div className='border-t'/>
        </div>
      </div>
    </div>
  );
}
