//'use client';
import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';

export default async function AutosPage() {
  const { data: autos } = await getAutos();

  return (
    <div className="p-5 bg-white rounded-xl">
      <h1 className="text-center text-[#11295B] text-[36px] mb-[30px]">Lista de Autos</h1>
      <div className="grid grid-cols-2 gap-6">
        {autos.map((auto: Auto) => (
          <div key={auto.id} className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg">
            <div className="w-full h-[150px] bg-[#d9d9d9] rounded-lg mb-2.5 flex items-center justify-center text-[#666] text-sm">
              Imagen del auto</div>
            <div className="py-2.5 text-[#000000]">
              <p><span className="text-[#11295B] font-bold">Marca:</span> {auto.marca}</p>
              <p><span className="text-[#11295B] font-bold">Modelo:</span> {auto.modelo}</p>
              <p><span className="text-[#11295B] font-bold">Kilometraje:</span> {auto.kilometraje}</p>
              <p><span className="text-[#11295B] font-bold">Transmisión:</span> {auto.transmision}</p>
              <p><span className="text-[#11295B] font-bold">Combustible:</span> {auto.combustible}</p>
              <a className="inline-block mt-2.5 px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]" 
              href={`/detalleCoche/${auto.id}`} target="_blank">
                Ver detalles
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
