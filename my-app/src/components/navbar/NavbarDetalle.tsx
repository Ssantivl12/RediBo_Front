'use client';

import Image from 'next/image';

export default function NavbarDetalle() {
  return (
    <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.05)] bg-white flex justify-between items-center">
      <h1 className="text-3xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-lg">REDIBO</h1>
      <button
        onClick={() => {}}
        className="p-1 rounded-full hover:opacity-80 transition"
      >
        <img
          src="/imagenesIconos/image.png"
          alt="Icono de perfil"
          className="w-7 h-7 cursor-pointer"
        />
      </button>
    </div>
  );
}