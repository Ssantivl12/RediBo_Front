'use client';

import { Car } from '@/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CarModalProps {
  car: Car;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  const [carDetails, setCarDetails] = useState(car);
  const [loading, setLoading] = useState(false);
  
  const fallback = (value: any) => (value && value !== '' ? value : '-');

  // Fetch detalles del auto desde la API
  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        // Cambia la URL según tu API - aquí uso el puerto 5000 que viste en CarList
        const response = await fetch(`http://localhost:5000/api/autos/${car.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarDetails(data);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        // Si hay error, mantener los datos originales
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [car.id]);

  const getCarImage = () =>
    carDetails.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
className="absolute top-4 right-4 text-black-600 hover:text-red-700 hover:scale-130 transition-transform duration-200 z-10 cursor-pointer"

>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Indicador de carga */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
            <div className="text-lg">Cargando detalles...</div>
          </div>
        )}

        {/* Sección izquierda: imagen + TOP */}
        <div className="md:w-1/2 w-full p-4 flex flex-col items-center">
          <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={getCarImage()}
              alt={`${fallback(carDetails.brand)} ${fallback(carDetails.model)}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-bold">
              TOP: {fallback(carDetails.topRank)}{' '}
              <span className="inline-block text-yellow-400 text-2xl">★</span>
            </p>
          </div>
        </div>

        {/* Sección derecha: información */}
        <div className="md:w-1/2 w-full p-6 flex flex-col justify-center space-y-3">
          <h3 className="text-xl font-semibold">Información del automóvil</h3>
          <p><strong>Nombre Dueño:</strong> {fallback(carDetails.owner)}</p>
          <p><strong>Marca Vehículo:</strong> {fallback(carDetails.brand)}</p>
          <p><strong>Modelo:</strong> {fallback(carDetails.model)}</p>
          <p><strong>Color:</strong> {fallback(carDetails.color)}</p>
          <p><strong>Veces Alquilado:</strong> {fallback(carDetails.totalRentals)}</p>
          <p><strong>Días de Uso Total:</strong> {fallback(carDetails.totalUsageDays)}</p>

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Estado del automóvil:</h4>
            <p className="text-base">
              {carDetails.status === 'Disponible' ? 'Libre' : 
               carDetails.status === 'Rentado' ? 'Rentado' : 
               fallback(carDetails.status)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}