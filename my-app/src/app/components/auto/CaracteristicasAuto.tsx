import { FaUsers, FaCog, FaGasPump, FaShieldAlt } from 'react-icons/fa';

interface Caracteristica {
  nombre: string;
  activo: boolean;
}

interface CaracteristicasAutoProps {
  asientos: number;
  transmision: string;
  caracteristicas: Caracteristica[];
}

export default function CaracteristicasAuto({ asientos, transmision, caracteristicas }: CaracteristicasAutoProps) {
  return (
    <>
      {/* Características principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center">
          <FaUsers className="text-black mr-2" />
          <span>{asientos} Asientos</span>
        </div>
        <div className="flex items-center">
          <FaCog className="text-black mr-2" />
          <span>{transmision}</span>
        </div>
        <div className="flex items-center">
          <FaGasPump className="text-black mr-2" />
          <span>Gasolina</span>
        </div>
        <div className="flex items-center">
          <FaShieldAlt className="text-black mr-2" />
          <span>Garantía</span>
        </div>
      </div>
      
      {/* Características detalladas */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {caracteristicas.map((caracteristica, index) => (
            <div key={index} className="flex items-center py-2">
              <div className="w-5 h-5 flex items-center justify-center bg-yellow-100 rounded-full mr-2">
                <span className="text-yellow-500 font-bold text-xs">✓</span>
              </div>
              <div>
                <span className="text-black">{caracteristica.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}