//'use client';
import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';
import Image from 'next/image';

export default async function AutosPage() {
  const { data: autos } = await getAutos();
  return (
    <div className="p-5 bg-white rounded-xl">
      <h1 className="text-center text-[#11295B] text-[36px] mb-[30px]">Lista de Autos</h1>
      
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {autos.map((auto: Auto) => (
          <div
            key={auto.id}
            className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Imagen */}
              <div className="relative w-full md:w-[350px] h-[250px] bg-[#d9d9d9] rounded-lg flex-shrink-0 flex items-center justify-center">
                {auto.imagenes?.[0]?.direccionImagen ? (
                  <Image
                    src={auto.imagenes[0].direccionImagen}
                    alt="Imagen del auto"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Detalles */}
              <div className="flex-1 min-w-0">
              <div className="bg-white p-5 w-full">
                <h2 className="text-[#11295B] text-xl font-bold mb-4">{auto.marca} - {auto.modelo}</h2>
                <div className="flex flex-wrap gap-5">
                  {[
                    { icon: '/imagenesIconos/usuario.png', label: 'Capacidad', value: `${auto.capacidad} personas` },
                    { icon: '/imagenesIconos/velocimetro.png', label: 'Kilometraje', value: `${auto.kilometraje} km` },
                    { icon: '/imagenesIconos/cajaDeCambios.png', label: 'Transmisión', value: auto.transmision },
                    { icon: '/imagenesIconos/gasolinera.png', label: 'Combustible', value: auto.combustible },
                    { icon: '/imagenesIconos/maleta.png', label: 'Maletero', value: `${auto.capacidadMaletero} personas` },
                  ].map(({ icon, label, value }, index) => (
                    <div key={index} className="flex items-center gap-4 flex-wrap">
                      <Image
                        src={icon}
                        alt={label}
                        width={50}
                        height={50}
                        className="w-[50px] h-[50px]"
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

            {/* Botón */}
            <div className="flex justify-end mt-3">
              <a
                className="inline-block mt-2.5 px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]"
                href={`/detalleCoche/${auto.id}`}
                target="_blank"
              >
                Ver detalles
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>


  );
}