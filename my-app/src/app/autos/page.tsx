'use client';

import { useEffect, useState } from 'react';
import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';
import Image from 'next/image';
import BarraBusqueda from '@/components/Auto/BusquedaAuto/BarraBusqueda';
import Link from 'next/link';

export default function AutosPage() {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getAutos();
      setAutos(data);
      setAutosFiltrados(data);
    }
    fetchData();
  }, []);

  const filtrarAutos = (busqueda: string) => {
    if (!busqueda.trim()) {
      setAutosFiltrados(autos);
      return;
    }

    const valor = busqueda.toLowerCase().trim();
    const palabras = valor.split(/[\s-]+/);
    
    if (palabras.length === 2) {
      const [marca, modelo] = palabras;
      const filtrados = autos.filter(auto => 
        auto.marca.toLowerCase().includes(marca) && 
        auto.modelo.toLowerCase().includes(modelo)
      );
      setAutosFiltrados(ordenarResultados(filtrados));
      return;
    }

    const filtrados = autos.filter(auto => {
      const marcaMatch = auto.marca.toLowerCase().includes(valor);
      const modeloMatch = auto.modelo.toLowerCase().includes(valor);
      return marcaMatch || modeloMatch;
    });

    setAutosFiltrados(ordenarResultados(filtrados, valor));
  };

  const ordenarResultados = (autos: Auto[], termino = '') => {
    return [...autos].sort((a, b) => {
      const aMarcaStarts = a.marca.toLowerCase().startsWith(termino);
      const bMarcaStarts = b.marca.toLowerCase().startsWith(termino);
      
      if (aMarcaStarts && !bMarcaStarts) return -1;
      if (!aMarcaStarts && bMarcaStarts) return 1;
      
      const marcaCompare = a.marca.localeCompare(b.marca);
      if (marcaCompare !== 0) return marcaCompare;
      
      return a.modelo.localeCompare(b.modelo);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <BarraBusqueda 
        onBuscar={filtrarAutos} 
        totalResultados={autosFiltrados.length} 
      />

      <div className="grid grid-cols-1 gap-6 mt-4">
        {autosFiltrados.length > 0 ? (
          autosFiltrados.map((auto: Auto) => (
            <div
              key={auto.id}
              className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-[350px] h-[250px] bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {auto.imagenes?.[0]?.direccionImagen ? (
                    <Image
                      src={auto.imagenes[0].direccionImagen}
                      alt={`${auto.marca} ${auto.modelo}`}
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                      width={350}
                      height={250}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="p-4 w-full">
                    <h2 className="text-[#11295B] text-xl font-bold mb-4">
                      {auto.marca} - {auto.modelo}
                    </h2>
                    <div className="flex flex-wrap gap-5">
                      {[
                        { icon: '/imagenesIconos/usuario.png', label: 'Capacidad', value: `${auto.capacidad} personas` },
                        { icon: '/imagenesIconos/velocimetro.png', label: 'Kilometraje', value: `${auto.kilometraje} km` },
                        { icon: '/imagenesIconos/cajaDeCambios.png', label: 'Transmisión', value: auto.transmision },
                        { icon: '/imagenesIconos/gasolinera.png', label: 'Combustible', value: auto.combustible },
                        { icon: '/imagenesIconos/maleta.png', label: 'Maletero', value: `${auto.capacidadMaletero} equipaje/s` },
                      ].map(({ icon, label, value }, index) => (
                        <div key={index} className="flex items-center gap-4 flex-wrap">
                          <Image
                            src={icon}
                            alt={label}
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px]"
                            unoptimized
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-[16px] text-black whitespace-nowrap">{value}</span>
                            <span className="text-[14px] text-[#292929]">{label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <Link
                  className="inline-block mt-2.5 px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]"
                  href={`/detalleCoche/${auto.id}`}
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-10">No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
}