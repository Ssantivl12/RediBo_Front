'use client';

import { useState } from 'react';
import LugarRecogida from './lugarRecogida';
import Caracteristicas from './caracteristicasSolicitud';
import Precio from './precioSolicitud';
import TerminosCondiciones from './terminosCondiciones';
import CalendarReserva from './calendario'; 
import SelectorHoraAlquiler from './selectorHoraAlquiler'; 
import { Auto } from '@/types/auto';

interface SolicitudReservaProps {
  mostrar: boolean;
  onClose: () => void;
  auto: Auto;
}

export default function SolicitudReserva({ mostrar, onClose, auto }: SolicitudReservaProps) {
  const [activeTab, setActiveTab] = useState<'caracteristicas' | 'precio'>('caracteristicas');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('12:00');

  const handleEnviar = () => {
    if (!aceptoTerminos) {
      alert('Debe aceptar los términos y condiciones antes de continuar.');
      return;
    }
    alert('Solicitud enviada correctamente.');
  };

  return (
    <>
      {mostrar && (
        <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />
      )}

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-[700px] h-[100%] p-4 z-[1000] border-[3px] border-black rounded-2xl shadow-lg transition-transform duration-300 ${mostrar ? 'scale-100' : 'scale-0'}`}
      >
        <button
          className="absolute top-2 right-4 bg-[#fca311] text-white text-lg px-3 py-1 rounded border border-black hover:bg-[#e69500] active:bg-[#cc8400]"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-[#002a5c] mb-4">Solicitud de Reserva</h2>

        <div className="grid grid-cols-2 gap-2 mb-2 text-[#000000]">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <button
                className={`px-3 py-1.5 rounded-full font-semibold ${activeTab === 'caracteristicas' ? 'bg-[#E4D5C1] text-white' : 'bg-[#fca311] text-white'}`}
                onClick={() => setActiveTab('caracteristicas')}
              >
                Características
              </button>
              <button
                className={`px-3 py-1.5 rounded-full font-semibold ${activeTab === 'precio' ? 'bg-[#E4D5C1] text-white' : 'bg-[#fca311] text-white'}`}
                onClick={() => setActiveTab('precio')}
              >
                Desglose de precio
              </button>
            </div>

            <div className="border border-black rounded-xl w-[325px] h-[450px] p-4 overflow-y-auto">
              {activeTab === 'caracteristicas' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Caracteristicas auto={auto} />
                </div>
              ) : (
                <div className="space-y-3">
                  <Precio precioPorDia={auto.precioRentaDiario} />
                </div>
              )}
            </div>

            <LugarRecogida
              lugarRecogida={selectedLocation}
              setLugarRecogida={setSelectedLocation}
            />
          </div>

          {/* Columna Derecha */}
          <div className="border border-black rounded-xl w-[325px] h-[655px] p-4 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#002a5c] mb-2">Seleccionar fechas</h3>
              <CalendarReserva dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <SelectorHoraAlquiler
              pickupTime={pickupTime}
              dropoffTime={dropoffTime}
              setPickupTime={setPickupTime}
              setDropoffTime={setDropoffTime}
            />
          </div>
        </div>

        <div className="border border-black rounded-xl w-full mb-3 p-4">
          <TerminosCondiciones onAceptarTerminos={setAceptoTerminos} />
        </div>

        <div className="flex justify-center">
          <button
            className="bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition hover:bg-[#e69500] active:bg-[#cc8400] max-w-[250px] w-full"
            onClick={handleEnviar}
          >
            Enviar solicitud de reserva
          </button>
        </div>
      </div>
    </>
  );
}