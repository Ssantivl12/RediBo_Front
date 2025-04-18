'use client';
import React from 'react';
import styles from './CarListings.module.css';
import { filterCars } from '../filters/carFilter';

interface RentalRequest {
  id: string;
  requesterName: string;
  dates: string;
}

interface Car {
  id: string;
  name: string;
  licensePlate: string;
  pricePerDay: number;
  image: string;
  pendingRequests: RentalRequest[];
  isRented: boolean;
}

interface CarListingsProps {
  activeFilter: string;
}

const CarListings: React.FC<CarListingsProps> = ({ activeFilter }) => {
  const cars: Car[] = [
    {
      id: '1',
      name: 'Honda Civic 2023',
      licensePlate: '5728 XYZ',
      pricePerDay: 45,
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg',
      pendingRequests: [
        { id: '1', requesterName: 'Ana García', dates: '10 Abril - 15 Abril' },
        { id: '2', requesterName: 'Agustín Pérez', dates: '20 Abril - 24 Abril' }
      ],
      isRented: false
    },
    {
      id: '2',
      name: 'Audi R7 2024',
      licensePlate: '5728 XYZ',
      pricePerDay: 70,
      image: 'https://cdn.motor1.com/images/mgl/6ZzvLZ/s1/2024-audi-rs7-performance-review.jpg',
      pendingRequests: [
        { id: '3', requesterName: 'Ana García', dates: '10 Abril - 15 Abril' },
        { id: '4', requesterName: 'Agustín Pérez', dates: '20 Abril - 24 Abril' }
      ],
      isRented: true
    },
    {
      id: '3',
      name: 'Mercedes Benz AMG G3 2025',
      licensePlate: '5728 XYZ',
      pricePerDay: 100,
      image: 'https://cdn.motor1.com/images/mgl/9mQXO1/s1/2025-mercedes-amg-g63-review.jpg',
      pendingRequests: [],
      isRented: false
    }
  ];

  const filteredCars = filterCars(cars, activeFilter);

  const handleAccept = (carId: string, requestId: string) => {
    console.log(`Accepted request ${requestId} for car ${carId}`);
  };

  const handleReject = (carId: string, requestId: string) => {
    console.log(`Rejected request ${requestId} for car ${carId}`);
  };

  return (
    <div className={styles.carsContainer}>
      {filteredCars.map(car => (
        <div key={car.id} className={styles.carContainer}>
          <img src={car.image} alt={car.name} className={styles.carImage} />
          <div className={styles.carInfo}>
            <div>
              <span className={styles.carName}>{car.name}</span>
              <div className={styles.pendingBadge}>
                <span className={styles.licensePlate}>{car.licensePlate}</span>
              </div>
            </div>
            <div className={styles.carPrice}>$ {car.pricePerDay} /día</div>
          </div>
          
          <div className={styles.pendingContainer}>
            <div className={styles.pendingBadge}>
              {car.pendingRequests.length} solicitudes pendientes
              {car.isRented && <span className={styles.rentedBadge}> • EN RENTA</span>}
            </div>
          </div>
          
          {car.pendingRequests.length > 0 && (
            <>
              <div className={styles.requestsTitle}>Solicitudes de renta</div>
              
              {car.pendingRequests.map(request => (
                <div key={request.id} className={styles.requestItem}>
                  <div className={styles.requesterInfo}>
                    <div className={styles.requesterName}>{request.requesterName}</div>
                    <div className={styles.requestDate}>{request.dates}</div>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button 
                      className={`${styles.btn} ${styles.btnReject}`}
                      onClick={() => handleReject(car.id, request.id)}
                    >
                      Denegar
                    </button>
                    <button 
                      className={`${styles.btn} ${styles.btnAccept}`}
                      onClick={() => handleAccept(car.id, request.id)}
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CarListings;