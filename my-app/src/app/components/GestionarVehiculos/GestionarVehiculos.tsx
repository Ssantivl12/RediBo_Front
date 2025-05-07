
import React, { useState } from 'react';
import ModalLiberarConfirmacion from '../modal/ModalLiberarConfirmacion'; 
import ModalExito from '../modal/ModalExito';

const autos = [
  {
    nombre: 'Honda Civic 2023',
    placa: 'ABC-123',
    estado: 'Rentado',
    rentadoPor: 'Juan Pérez',
    fechaTermino: '2024-02-15',
    imagen: 'https://cdn.motor1.com/images/mgl/MJvJM/s3/honda-civic-e-hev-2022-prueba.jpg',
    boton: 'Liberar Auto',
    colorBoton: 'bg-[#FCA311] hover:bg-yellow-500',
  },
  {
    nombre: 'Toyota Corolla 2024',
    placa: 'XYZ-789',
    estado: 'En Mantenimiento',
    imagen: '',
    boton: '',
  },
  {
    nombre: 'Mercedes Benz C200',
    placa: 'DEF-456',
    estado: 'Disponible',
    imagen: '',
    boton: 'Poner en Mantenimiento',
    colorBoton: 'bg-[#11295B] hover:bg-blue-800',
  },
];

export default function GestionarVehiculos() {


  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const handleLiberar = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarLiberacion = () => {
    setMostrarConfirmacion(false);
    setMostrarExito(true);
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {autos.map((auto, index) => (
        <div
          key={index}
          className="flex items-start bg-[#D8C4A7] p-6 rounded-lg shadow-md space-x-6"
        >
          <div className="w-[400px] h-[300px] bg-gray-300 flex items-center justify-center text-gray-600 text-2xl overflow-hidden rounded-md">
            {auto.imagen ? (
              <img src={auto.imagen} alt={auto.nombre} className="w-full h-full object-cover" />
            ) : (
              '400 × 300'
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold" style={{ color: '#11295B' }}>
                {auto.nombre}
              </h2>
              <span className="bg-white text-black text-sm px-2 py-1 rounded-full">
                {auto.placa}
              </span>
            </div>

            {auto.estado === 'Rentado' ? (
              <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
                <p style={{ color: '#11295B' }} className="font-semibold">Estado Actual</p>
                <p>
                  <span className="font-semibold" style={{ color: '#11295B' }}>Estado:</span> Ocupado
                </p>
                <p>
                  <span className="font-semibold" style={{ color: '#11295B' }}>Rentado a:</span> {auto.rentadoPor}
                </p>
                <p>
                  <span className="font-semibold" style={{ color: '#11295B' }}>Fecha de término:</span> {auto.fechaTermino}
                </p>
              </div>
            ) : (
              <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
                {auto.estado}
              </span>
            )}

            {auto.boton && (
              <button
                onClick={auto.boton === 'Liberar Auto' ? handleLiberar : undefined}

                className={`${auto.colorBoton} text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors`}
              >
                {auto.boton}
              </button>
            )}
          </div>
        </div>
      ))}

      {mostrarConfirmacion && (
        <ModalLiberarConfirmacion
          onConfirm={confirmarLiberacion}
          onCancel={() => setMostrarConfirmacion(false)}
        />
      )}

      {mostrarExito && <ModalExito onClose={() => setMostrarExito(false)} />}

    </div>
  );
}
