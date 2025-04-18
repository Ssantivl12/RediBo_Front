'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import styles from './Carousel.module.css';

interface Vehicle {
  id: string;
  imageUrl: string;
  brand: string;
  model: string;
  pricePerDay: number;
  averageRating?: number;
}

const fetcher = (url: string): Promise<Vehicle[]> => fetch(url).then(res => res.json());

export default function Carousel() {
  const { data, error } = useSWR<Vehicle[]>('/api/vehicles', fetcher);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (data?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  if (error) return <div>Error loading vehicles</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.carouselContainer}>
      {data.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`
            ${styles.slide}
            ${index === currentIndex ? styles.active : ''}
            ${index === (currentIndex + 1) % data.length ? styles.next : ''}
            ${index === (currentIndex - 1 + data.length) % data.length ? styles.prev : ''}
          `}
        >
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className={styles.image}
          />
          <div className={styles.info}>
            <h3>Modelo: {vehicle.model}</h3>
            <p>Marca: {vehicle.brand}</p>
            <p>price: {vehicle.pricePerDay} $/day</p>
            <p>Rating: {vehicle.averageRating?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}