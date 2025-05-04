'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [activeBtn, setActiveBtn] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(true);
  
  // Función para manejar el cambio de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      // Si el ancho es menor a 1333px, cambiamos el layout
      setIsWideScreen(window.innerWidth >= 1333);
    };
    
    // Verificar el tamaño inicial
    handleResize();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleLoginClick = () => {
    console.log('Login clicked');
  };
  
  return (
    <div className="px-4 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
      <nav className={`flex flex-wrap items-center ${isWideScreen ? 'grid grid-cols-3' : 'justify-between'}`}>
        {/* REDIBO - siempre izquierda */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
          REDIBO
        </h1>
        
        {/* Botones centrales - en el centro para pantallas grandes, abajo para el resto */}
        <div className={`${isWideScreen ? 'flex justify-center' : 'w-full flex justify-center mt-4 order-last'}`}>
          <div className="flex flex-nowrap gap-[0.1rem]">
            {[1, 2, 3, 4, 5].map((n, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === 0) {
                    window.location.href = "/";
                  } else if (i === 1) {
                    window.location.href = "/autos";
                  } else {
                    setActiveBtn(i);
                  }
                }}
                className={`relative px-3 md:px-6 py-[0.2rem] border border-[#00000033] text-[var(--azul-oscuro)]
                  font-[var(--tamaño-regular)] bg-[var(--blanco)] shadow-[var(--sombra)] text-xs md:text-sm
                  ${i === 0 ? 'rounded-l-full border-r-0' : ''}
                  ${i === 4 ? 'rounded-r-full border-l-0' : ''}
                  ${i !== 0 && i !== 4 ? 'border-x-0' : ''}
                  ${activeBtn === i ? 'font-semibold' : ''}
                  whitespace-nowrap
                `}
              >
                {i === 0 ? "Home" : i === 1 ? "Autos" : `Botón ${n}`}
                {i !== 4 && (
                  <span className="hidden md:block absolute right-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
                )}
                {i !== 0 && (
                  <span className="hidden md:block absolute left-0 top-1/4 h-1/2 w-px bg-[#00000033]" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Botones de sesión - siempre derecha */}
        <div className={`flex ${isWideScreen ? 'justify-end' : ''}`}>
          <div className="flex gap-1 md:gap-0">
            <button className="px-3 md:px-6 py-1 md:py-[0.4rem] rounded-l-[20px] bg-[var(--naranja-46)] font-[var(--tamaño-regular)] text-[var(--azul-oscuro)] shadow-[var(--sombra)] text-xs md:text-sm whitespace-nowrap">
              Registrarse
            </button>
            <button
              onClick={handleLoginClick}
              className="px-3 md:px-6 py-1 md:py-[0.4rem] rounded-r-[20px] bg-[var(--naranja)] text-[var(--blanco)] font-[var(--tamaña-bold)] shadow-[var(--sombra)] transition-transform duration-100 active:scale-[0.97] active:shadow-[0_1px_3px_rgba(0,0,0,0.2)] text-xs md:text-sm whitespace-nowrap"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}