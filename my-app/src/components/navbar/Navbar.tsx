'use client';

import { useState } from 'react';

export default function Navbar() {
  const [activeBtn, setActiveBtn] = useState(0);

  const handleLoginClick = () => {
    console.log('Login clicked');
    // Aquí puedes implementar la lógica de inicio de sesión en el futuro
  };

  const handleRedirect = () => {
    window.location.href = "/autos"; // Redirige a /autos cuando se hace clic en el Botón 1
  };

  return (
    <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">

        <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
          REDIBO
        </h1>

        <div className="flex overflow-x-auto md:overflow-visible relative w-full md:w-auto justify-start md:justify-center">
          {[1, 2, 3, 4, 5].map((n, i) => (
          <button
            key={i}
            onClick={() => {
              if (i === 0) {
                window.location.href = "/"; // Redirige al home (localhost:3000)
              } else if (i === 1) {
                window.location.href = "/autos"; // Redirige a /autos
              } else {
                setActiveBtn(i); // Cambia el botón activo cuando no es el Botón 1 ni 2
              }
            }}
            className={`relative px-6 md:px-12 py-[0.2rem] border border-[#00000033] text-[var(--azul-oscuro)] 
              font-[var(--tamaño-regular)] bg-[var(--blanco)] shadow-[var(--sombra)] text-sm md:text-base
              ${i === 0 ? 'rounded-l-full border-r-0' : ''} 
              ${i === 4 ? 'rounded-r-full border-l-0' : ''} 
              ${i !== 0 && i !== 4 ? 'border-x-0' : ''} 
              ${activeBtn === i ? 'font-semibold' : ''} 
              whitespace-nowrap // Esto asegura que el texto no se quiebre en varias líneas
            `}
          >
            {i === 0 ? "Home" : i === 1 ? "Autos" : `Botón ${n}`} {/* Modificar nombres según el índice */}
            {i !== 4 && (
              <span className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
            )}
            {i !== 0 && (
              <span className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
            )}
          </button>
        ))}
        </div>

        <div className="flex justify-center md:justify-end gap-0 w-full md:w-auto">
          <button className="w-1/2 md:w-auto px-4 md:px-8 py-[0.4rem] rounded-l-[20px] bg-[var(--naranja-46)] font-[var(--tamaño-regular)] text-[var(--azul-oscuro)] shadow-[var(--sombra)] text-sm md:text-base">
            Registrarse
          </button>
          <button
            onClick={handleLoginClick}
            className="w-1/2 md:w-auto px-4 py-[0.4rem] rounded-r-[20px] bg-[var(--naranja)] text-[var(--blanco)] font-[var(--tamaña-bold)] shadow-[var(--sombra)] transition-transform duration-100 active:scale-[0.97] active:shadow-[0_1px_3px_rgba(0,0,0,0.2)] text-sm md:text-base"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>
    </div>
  );
}
