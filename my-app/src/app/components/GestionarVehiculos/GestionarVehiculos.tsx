import React from 'react';

const autos = [
  {
    nombre: 'Honda Civic 2023',
    placa: 'ABC-123',
    estado: 'Disponible',
    boton: 'Poner en Mantenimiento',
    colorEstado: 'bg-gray-200 text-gray-800',
    colorBoton: 'bg-[#11295B] hover:bg-blue-800',
  },
  {
    nombre: 'Toyota Corolla 2024',
    placa: 'XYZ-789',
    estado: 'En Mantenimiento',
    boton: 'Poner en Mantenimiento',
    colorEstado: 'bg-gray-200 text-gray-800',
    colorBoton: 'bg-[#11295B] hover:bg-blue-800',
  },
  {
    nombre: 'Mercedes Benz C200',
    placa: 'DEF-456',
    estado: 'Rentado',
    boton: 'Liberar Auto',
    colorEstado: 'bg-gray-200 text-gray-800',
    colorBoton: 'bg-[#FCA311] hover:bg-yellow-500',
  },
];

export default function GestionarVehiculos() {
  return (
    <div className="space-y-6 px-4 py-6">
      {autos.map((auto, index) => (
        <div
          key={index}
          className="flex items-start bg-[#D8C4A7] p-6 rounded-lg shadow-md space-x-6"
        >
          <div className="w-[400px] h-[300px] bg-gray-300 flex items-center justify-center text-gray-600 text-2xl">
            400 × 300
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold" style={{ color: '#11295B' }}>
                {auto.nombre}
              </h2>
              <span className="bg-gray-200 text-sm px-2 py-1 rounded-full">{auto.placa}</span>
            </div>

            <span
              
              className={`${auto.colorEstado} text-base font-medium px-3 py-1 rounded-full w-fit`}
            >
              {auto.estado}
            </span>
            
            <button
              className={`${auto.colorBoton} text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors`}
            >
              {auto.boton}
            </button>
            
          </div>
        </div>
      ))}
    </div>
  );
}