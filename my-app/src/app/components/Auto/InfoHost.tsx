'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Usuario } from '@/types/auto';
import Link from "next/link";
import useIsLoggedIn from '@/hooks/useIsLoggedIn';

interface Props {
  usuario: Usuario;
  marca: string;
  modelo: string;
}

export default function InfoHost({ usuario, marca, modelo }: Props) {
  const [error, setError] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const isLoggedIn =  useIsLoggedIn();

  // Efecto para ocultar automáticamente el aviso después de 3 segundos
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (mostrarAviso) {
      timeoutId = setTimeout(() => {
        setMostrarAviso(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mostrarAviso]);

  const handleContactClick = () => {
    if (!isLoggedIn) {
      setMostrarAviso(true);
      return;
    }

    try {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
      const baseUrl = isMobile
        ? 'https://wa.me'
        : 'https://web.whatsapp.com/send';
  
      const link = `${baseUrl}?phone=591${usuario.telefono}&text=${encodeURIComponent(
        `Hola, estoy interesado en tu vehículo ${marca}-${modelo} publicado en REDIBO.`
      )}`;
  
      window.open(link, '_blank');
    } catch (err) {
      console.error('Error al redirigir a WhatsApp:', err);
      setError(true);
    }
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams({
      nombre: usuario.nombreCompleto,
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
      email: usuario.email || '',
      edad: '21',
      marca: marca || '',
      modelo: modelo || ''
    }).toString();
    
    const paramsUrl = `/detalleHost/${usuario.idUsuario}?${queryParams}`;
    window.open(paramsUrl, '_blank');
  };

  return (
    <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black relative">
      {/* Toast de aviso */}
      {mostrarAviso && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-fadeInOut">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>Para contactar al Host, <Link href="/login" className="font-bold underline">inicie sesión</Link> o <Link href="/registro" className="font-bold underline">regístrese</Link></span>
        </div>
      )}

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
        {usuario?.nombreCompleto}
      </p>

      {usuario?.telefono && (
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

      <div className="flex justify-center mt-4">
        <Link
          href={`/detalleHost/${usuario.idUsuario}`}
          onClick={handleViewProfile}
          className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded-full shadow-md transition hover:bg-[#e0910f]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}