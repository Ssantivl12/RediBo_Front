'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Carousel.module.css';
import { useRouter } from 'next/navigation';

interface Vehicle {
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  pricePerDay: number;
  averageRating?: number;
}

export default function Carousel() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const obtenerVehiculosTop = async () => {
    try {
      const response = await axios.get('http://localhost:3000/vehiculo/obtenerVehiculosTop');
      const data = response.data;

      // Aseguramos que el formato sea compatible con la interfaz Vehicle
      const formattedData: Vehicle[] = data.map((vehiculo: any) => ({
        id: vehiculo.idvehiculo,
        imageUrl: vehiculo.imagen,
        brand: vehiculo.marca,
        model: vehiculo.modelo,
        pricePerDay: vehiculo.tarifa,
        averageRating: vehiculo.promedio_calificacion,
      }));

      setVehicles(formattedData);
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerVehiculosTop();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (vehicles.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading vehicles</div>;

  return (
    <div className={styles.carouselContainer}>
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={` 
            ${styles.slide}
            ${index === currentIndex ? styles.active : ''}
            ${index === (currentIndex + 1) % vehicles.length ? styles.next : ''}
            ${index === (currentIndex - 1 + vehicles.length) % vehicles.length ? styles.prev : ''}
          `}
        >
          <img
            src={`/${vehicle.imageUrl}`} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className={styles.image}
          />
          <div className={styles.info}>
            <h3>Modelo: {vehicle.model}</h3>
            <p>Marca: {vehicle.brand}</p>
            <p>Precio: {vehicle.pricePerDay} $/day</p>
            <p>Rating: {vehicle.averageRating?.toFixed(2) || 'N/A'}</p>
            <button
  onClick={() => router.push("/reserva")}
  style={{
    backgroundColor: '#3b82f6', 
    color: 'white',
    fontWeight: '600', 
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', 
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} // Hover
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'} // Hover fuera
>
  RESERVAR
</button>
          </div>
          
        </div>
      ))}
    </div>
  );
}
