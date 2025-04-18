'use client';

import { useState } from 'react';

export default function NavbarInicioSesion() {
  const [activeBtn, setActiveBtn] = useState(0);

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
              onClick={() => setActiveBtn(i)}
              className={`relative px-6 md:px-12 py-[0.2rem] border-[#00000033] text-[var(--azul-oscuro)] 
                font-[var(--tamaño-regular)] bg-[var(--blanco)] shadow-[var(--sombra)] text-sm md:text-base
                ${i === 0 ? 'rounded-l-full border-r-0' : ''}
                ${i === 4 ? 'rounded-r-full border-l-0' : ''}
                ${i !== 0 && i !== 4 ? 'border-x-0' : ''}
                ${activeBtn === i ? 'font-semibold' : ''}
              `}
            >
              Botón{n}
              {i !== 4 && (
                <span className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
              )}
              {i !== 0 && (
                <span className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between md:justify-end items-center w-full md:w-auto gap-0 bg-[var(--naranja)] rounded-[20px] shadow-[var(--sombra)] overflow-hidden">
            <button className="flex-1 md:flex-none px-4 md:px-8 py-[0.4rem] font-[var(--tamaña-bold)] text-[var(--blanco)] text-sm md:text-base whitespace-nowrap">
                Nombre Usuario
            </button>
            <div className="flex items-center justify-center px-3 md:px-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6 text-[var(--blanco)]"
                >
                <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
                />
                </svg>
            </div>
        </div>
      </nav>
    </div>
  );
}