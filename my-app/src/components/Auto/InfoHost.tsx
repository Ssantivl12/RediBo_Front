import Image from 'next/image';
import { Auto } from '@/types/auto';


export default function InfoHost({ propietario }: { propietario: Auto['propietario'] }) {
  return (
    <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
      <h3 className="text-[#11295b] font-semibold text-center mb-4">Datos del host</h3>
      <div className="flex justify-center mb-4">
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
          <Image src="/imagenesIconos/usuario.png" alt="Host" width={50} height={50}  unoptimized/>
        </div>
      </div>
      <p className="text-center text-[#333] text-lg">
        {propietario?.nombre} {propietario?.apellido}
      </p>
    </div>
  );
}
