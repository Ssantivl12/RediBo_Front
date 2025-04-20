// utils/carFilter.ts

import { Car } from "../carListings/CarListings";

export const filterCars = (cars: Car[], filter: string): Car[] => {
  switch (filter) {
    case 'todos':
      return cars;
    case 'disponibles':
      // Un auto está disponible si no tiene solicitudes pendientes y no está en renta
      return cars.filter(car => car.pendingRequests.length === 0 && !car.isRented);
    case 'en_renta':
      // Un auto está en renta si tiene la propiedad isRented en true
      return cars.filter(car => car.isRented);
    case 'con_solicitudes':
      // Un auto tiene solicitudes si pendingRequests.length > 0
      return cars.filter(car => car.pendingRequests.length > 0);
    default:
      return cars;
  }
};