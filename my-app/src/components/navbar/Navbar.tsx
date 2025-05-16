'use client';
import { useState, useEffect } from 'react';
import { getUsuarios } from '@/libs/api'; // Ajusta el path si es necesario
import type { Usuario } from "@/types/auto"; // Ajusta el path si es necesario

export default function Navbar() {
  const [activeBtn, setActiveBtn] = useState(0);
  const [isWideScreen, setIsWideScreen] = useState(true);

  // Estados para manejar el dropdown y los usuarios
  const [showDropdown, setShowDropdown] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar el cambio de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
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

  // Función para manejar el clic del botón de inicio de sesión
  const handleLoginClick = async () => {
    setShowDropdown((prev) => !prev); // Alternar el estado del dropdown
    if (!showDropdown) {
      try {
        const response = await getUsuarios();
        setUsuarios(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error al obtener usuarios:', err);
        setError("Error al cargar usuarios.");
      }
    }
  };

  // Función para seleccionar un usuario y guardar su informacion en localStorage
  const handleUserSelect = (usuario: Usuario) => {
    console.log(`Logueado como: ${usuario.nombre} (${usuario.esAdmin ? "Host" : "Renter"})`);
    localStorage.setItem("idUsuario", usuario.idUsuario.toString()); // <-- Guarda el id del usuario aquí
    setShowDropdown(false);
  };

  return (
    <div className="px-4 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
      <nav className={`flex flex-wrap items-center ${isWideScreen ? 'grid grid-cols-3' : 'justify-between'}`}>
        {/* REDIBO - siempre izquierda */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
          REDIBO
        </h1>

        {/* Botones centrales */}
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
              </button>
            ))}
          </div>
        </div>

        {/* Botones de sesión */}
        <div className={`flex ${isWideScreen ? 'justify-end' : ''} relative`}>
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

          {/* Dropdown con usuarios */}
          {showDropdown && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-72 z-50">
              <div className="p-4">
                {error ? (
                  <p className="text-red-500 text-sm">{error}</p>
                ) : usuarios.length === 0 ? (
                  <p className="text-gray-600 text-sm">Cargando usuarios...</p>
                ) : (
                  <ul className="space-y-2">
                    {usuarios.map((usuario) => (
                      <li
                        key={usuario.idUsuario}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleUserSelect(usuario)}
                      >
                        <div>
                          <p className="text-sm text-[var(--azul-oscuro)] font-medium">
                            {usuario.nombre} {usuario.apellido}
                          </p>
                          <p className="text-xs text-gray-600">
                            {usuario.esAdmin ? "Host" : "Renter"}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{usuario.email}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
