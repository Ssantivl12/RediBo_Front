// app/car/[id]/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/auth/LoginModal';
import FiltersBar from '../../components/filters/FiltersBar';
import styles from './pagarRenta.module.css';
import EncabezadoAuto from '../../components/auto/EncabezadoAuto';
import GaleriaAuto from '../../components/auto/GaleriaAuto';
import PropietarioAuto from '../../components/auto/PropietarioAuto';
import DescripcionAuto from '../../components/auto/DescripcionAuto';
import CaracteristicasAuto from '../../components/auto/CaracteristicasAuto';
import PrecioAuto from '../../components/auto/PrecioAuto';

export default function PagarRenta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Esta información podría venir de una API en un caso real
  const carData = {
    titulo: 'Toyota Corolla', // marca y modelo
    tipo: 'Sedán',  // todo: falta en la base de datos
    año: '2022', 
    precio: 35,
    propietario: {
      nombreCompleto: 'Carlos Rodríguez',
      calificacion: 4.9,
      comentarios: 56,
    },
    descripcion: 'El Toyota Corolla es un sedán confiable y eficiente, perfecto para viajes urbanos y de carretera. Con un amplio espacio interior y excelente economía de combustible, este auto te llevará a donde necesites ir con comodidad y estilo.',
    asientos: 5, // todo: falta en la base de datos
    transmision: 'Automático', // todo: falta en la base de datos
    caracteristicas: [
      { nombre: 'Aire acondicionado', activo: true },
      { nombre: 'Cámara de reversa', activo: true },
      { nombre: 'Entrada USB', activo: true },
      { nombre: 'Sistema de audio premium', activo: true },
      { nombre: 'Bluetooth', activo: true },
      { nombre: 'Control de crucero', activo: true },
      { nombre: 'GPS', activo: true },
      { nombre: 'Asientos de cuero', activo: true },
    ],
    reserva: {
      fechaInicio: 'abr 03, 2025',
      fechaFin: 'abr 06, 2025',
      dias: 4
    },
    costes: {
      precio: 35,
      dias: 4,
      tarifa: 14, // ! no se sabe si poner esto o no
      garantia: 200,
      total: 354
    },
    imagenes: {
      galeria: [
        '/images/corolla-engine.jpg',
        '/images/corolla-interior.jpg',
        '/images/corolla-back.jpg',
        '/images/corolla-exterior.jpg'
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className={styles.headerTop}>
        <Navbar onLoginClick={() => setMostrarModal(true)} />
      </header>
      <header className={styles.headerFilters}>
        <FiltersBar />
      </header>
      
      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
      
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del auto */}
          <div className="lg:col-span-2">
            <EncabezadoAuto titulo={carData.titulo} tipo={carData.tipo} año={carData.año} />
            <GaleriaAuto imagenes={carData.imagenes.galeria} />
            <PropietarioAuto propietario={carData.propietario} />
            <DescripcionAuto descripcion={carData.descripcion} />
            <CaracteristicasAuto 
              asientos={carData.asientos} 
              transmision={carData.transmision} 
              caracteristicas={carData.caracteristicas} 
            />
          </div>
          
          {/* Columna derecha - Precio y reserva */}
          <div className="lg:col-span-1">
            <PrecioAuto 
              precio={carData.precio} 
              reserva={carData.reserva} 
              costes={carData.costes} 
            />
          </div>
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}