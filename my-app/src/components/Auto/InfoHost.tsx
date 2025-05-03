'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  propietario: {
    nombre: string;
    apellido: string;
    telefono: string;
  };
  marca: string;
  modelo: string;
}

export default function InfoHost({ propietario, marca, modelo }: Props) {
  const [error, setError] = useState(false);

  const handleContactClick = () => {
    try {
      const link = `https://wa.me/591${propietario.telefono}?text=${encodeURIComponent(
        `Hola, estoy interesado en tu vehículo ${marca}-${modelo} publicado en REDIBO.`
      )}`;   
      window.open(link, '_blank');
    } catch (err) {
      console.error('Error al redirigir a WhatsApp:', err);
      setError(true);
    }
  };

  return (
    <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
      <h3 className="text-[#11295b] font-semibold text-center mb-4">Datos del host</h3>

      <div className="flex justify-center mb-4">
        <div className="w-[80px] h-[80px] rounded-full bg-white border-4 border-black flex items-center justify-center">
          <Image
            src="/imagenesIconos/usuario.png"
            alt="Host"
            width={60}
            height={60}
            className="w-[60px] h-[60px]"
            unoptimized
          />
        </div>
      </div>

      <p className="text-center text-[#333] text-lg mb-2">
        {propietario?.nombre} {propietario?.apellido}
      </p>

      {propietario?.telefono && (
        <div className="mt-2 text-sm text-[#11295b]">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Contacto directo:</p>
            <button
              onClick={handleContactClick}
              className="text-blue-600 font-semibold underline hover:text-blue-800 transition inline-flex items-center gap-1 mt-1 cursor-pointer"
            >
              <Image
                src="/imagenesIconos/whatsapp.png"
                alt="WhatsApp"
                width={18}
                height={18}
                className="inline-block"
                unoptimized
              />
              Contactar
            </button>
          </div>
          {error && (
            <p className="text-red-600 mt-2 font-medium">¡Ups! Algo salió mal.</p>
          )}
        </div>
      )}

    </div>
  );
}








