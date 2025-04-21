'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import FiltersBar from "@components/filters/FiltersBar";
import CarListings from "@components/carListings/CarListings";
import Navbar from "@components/navbar/Navbar";

import LoginModal from "@components/auth/LoginModal";
import styles from "./GestionarSolicitudes.module.css";

export default function GestionarSolicitudes() {
  const params = useParams();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  
  interface SolicitudPendiente {
    idReserva: string;
    nombreSolicitante: string;
    fechas: string;
  }
  
  interface Auto {
    idAuto: string;
    nombre: string;
    placa: string;
    precioPorDia: number;
    imagen: string | null;
    solicitudesPendientes: SolicitudPendiente[];
    estaRentado: boolean;
  }
  
  interface SolicitudesData {
    autos: Auto[];
    cantidad: number;
  }

  const [solicitudesData, setSolicitudesData] = useState<SolicitudesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        setLoading(true);
        const idArrendador = params.idArrendador;
        
        if (!idArrendador) {
          throw new Error('ID de reserva no encontrado');
        }
        
        const response = await fetch(`http://localhost:3000/api/reservas/propietario/${idArrendador}`);
        
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.status}`);
        }
        
        const data = await response.json();
        
        setSolicitudesData(data);
        console.log('Datos de solicitudes:', data);
        setError(null);
      } catch (err) {
        console.error('Error al obtener las solicitudes de reserva:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las solicitudes de reserva');
      } finally {
        setLoading(false);
      }
    };


    obtenerSolicitudes();
  }, [params.idArrendador]);
    if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <h2 className="text-2xl font-semibold mb-4">Cargando información de las reservas...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Intentar nuevamente
          </button>
        </div>
      );
    }
  
    if (!solicitudesData) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <h2 className="text-2xl font-semibold mb-4">No se encontraron datos del arrendador</h2>
        </div>
      );
    }
  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar onLoginClick={() => setMostrarModal(true)} />
      </header>

      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
      
      <header className={styles.headerFilters}>
        <div className={styles.body}>
          <FiltersBar 
            onFilterChange={handleFilterChange} 
            activeFilter={activeFilter} 
          />
        </div>
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <CarListings activeFilter={activeFilter} />
        </div>
      </main>
    </div>
  );
}