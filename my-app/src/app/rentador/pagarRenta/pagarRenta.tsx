'use client';

// pages/car/[id].js
import { useState } from 'react';
import Image from 'next/image';
import { FaStar, FaGasPump, FaShieldAlt, FaUsers, FaCog } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import LoginModal from '../../components/auth/LoginModal';
import styles from './pagarRenta.module.css';
import FiltersBar from '../../components/filters/FiltersBar';

export default function PagarRenta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const features = [
    { name: 'Aire acondicionado', active: true },
    { name: 'Cámara de reversa', active: true },
    { name: 'Entrada USB', active: true },
    { name: 'Sistema de audio premium', active: true },
    { name: 'Bluetooth', active: true },
    { name: 'Control de crucero', active: true },
    { name: 'GPS', active: true },
    { name: 'Asientos de cuero', active: true },
  ];

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
            <div className="flex flex-col mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Toyota Corolla</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Sedán</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">2022</span>
              </div>
            </div>
            
            {/* Galería de imágenes */}
            <div className="mb-8">
              <div className="w-full h-64 md:h-80 bg-gray-200 relative mb-2 rounded-lg overflow-hidden">
                <Image 
                  src="/images/corolla-engine.jpg" 
                  alt="Toyota Corolla Motor" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-24 md:h-32 bg-gray-200 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/corolla-interior.jpg" 
                    alt="Toyota Corolla Interior" 
                    layout="fill" 
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="h-24 md:h-32 bg-gray-200 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/corolla-back.jpg" 
                    alt="Toyota Corolla Interior Trasero" 
                    layout="fill" 
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="h-24 md:h-32 bg-gray-200 relative rounded-lg overflow-hidden">
                  <Image 
                    src="/images/corolla-exterior.jpg" 
                    alt="Toyota Corolla Exterior" 
                    layout="fill" 
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Información del propietario */}
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-black">Auto ofrecido por Carlos Rodríguez</p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400" />
                    <span className="ml-1 text-sm font-semibold text-black">4.9 (56 reseñas)</span>
                  </div>
                  <span className="mx-3 text-gray-300">|</span>
                  <span className="text-sm text-black">Tiempo de respuesta: 1 hora</span>
                </div>
              </div>
              <button className="ml-auto border border-blue-900 text-blue-900 px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition">
                Contactar arrendatario
              </button>
            </div>
            
            {/* Descripción del auto */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Acerca de este auto</h2>
              <p className="text-gray-600">
                El Toyota Corolla es un sedán confiable y eficiente, perfecto para viajes urbanos y de carretera. 
                Con un amplio espacio interior y excelente economía de combustible, este auto te llevará a donde 
                necesites ir con comodidad y estilo.
              </p>
            </div>
            
            {/* Características principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <FaUsers className="text-black mr-2" />
                <span>5 Asientos</span>
              </div>
              <div className="flex items-center">
                <FaCog className="text-black mr-2" />
                <span>Automático</span>
              </div>
              <div className="flex items-center">
                <FaGasPump className="text-black mr-2" />
                <span >Gasolina</span>
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
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center py-2">
                    <div className="w-5 h-5 flex items-center justify-center bg-yellow-100 rounded-full mr-2">
                      <span className="text-yellow-500 font-bold text-xs">✓</span>
                    </div>
                    <div>
                      <span className="text-black">{feature.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Columna derecha - Precio y reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <div className="flex items-center mb-4 text-left">
                <div className="text-2xl font-bold text-blue-900">$35</div>
                <div className="text-sm text-gray-600 ml-1">/por día</div>
              </div>
              
              <div className="mb-6">
                <div className="border border-gray-300 rounded-md p-3 flex items-center">
                  <HiOutlineCalendar className="text-black mr-2" />
                  <span className="text-sm">abr 03, 2025 - abr 06, 2025</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-bold mb-4 text-black">Detalles del precio</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>$35 × 4 días</span>
                    <span>$140</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarifa de servicio</span>
                    <span>$14</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garantía (reembolsable)</span>
                    <span>$200</span>
                  </div>
                  <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>$354</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-medium transition">
                  Pagar el 100% ahora
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 rounded-md font-medium flex items-center justify-center transition">
                  <HiOutlineCalendar className="mr-2" />
                  Pagar 50 % ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
    </div>
  );
}