'use client';

import { useState } from 'react';
import LugarRecogida from './lugarRecogida';
import Caracteristicas from '../Caracteristicas';
import Precio from './precioSolicitud';
import TerminosCondiciones from './terminosCondiciones';
import CalendarReserva from './calendario';
import SelectorHoraAlquiler from './selectorHoraAlquiler';
import { Auto } from '@/types/auto';
import PanelConfirmarSolicitud from '@/components/Auto/PanelSolicitud/PanelConfirmarSolicitud';
import PanelSolicitudEnviada from '@/components/Auto/PanelSolicitud/PanelSolicitudEnviada';
import Swal from 'sweetalert2'
interface SolicitudReservaProps {
  mostrar: boolean;
  onClose: () => void;
  auto: Auto;
}

export default function SolicitudReserva({ mostrar, onClose, auto }: SolicitudReservaProps) {
  const [activeTab, setActiveTab] = useState<'caracteristicas' | 'precio'>('caracteristicas');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [mostrarPanelConfirmarSolicitud, setMostrarPanelConfirmarSolicitud] = useState(false);
  const [mostrarPanelSolicitudEnviada, setMostrarPanelSolicitudEnviada] = useState(false);

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('12:00');

  const handleConfirmarSolicitud = () => {
    setMostrarPanelConfirmarSolicitud(false);
    setMostrarPanelSolicitudEnviada(true);
  };

  const handleAceptarSolicitudEnviada = () => {
    setMostrarPanelSolicitudEnviada(false);
  };


  return (
    <>
      <PanelConfirmarSolicitud
        mostrar={mostrarPanelConfirmarSolicitud}
        onClose={() => setMostrarPanelConfirmarSolicitud(false)}
        onConfirm={handleConfirmarSolicitud}
      />

      <PanelSolicitudEnviada
        mostrar={mostrarPanelSolicitudEnviada}
        onClose={() => setMostrarPanelSolicitudEnviada(false)}
        onConfirm={handleAceptarSolicitudEnviada}
      />

      {mostrar && (
        <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />
      )}

      <div
        className={`fixed inset-0 flex items-center justify-center z-[1000] px-2 sm:px-4 transition-transform duration-300 ${mostrar ? 'scale-100' : 'scale-0'
          }`}
      >
        <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-4 border-[2px] sm:border-[3px] border-black rounded-xl sm:rounded-2xl shadow-lg">
          <button
            className="absolute top-2 right-2 sm:right-4 bg-[#fca311] text-white text-base sm:text-lg px-2 sm:px-3 py-0.5 sm:py-1 rounded border border-black hover:bg-[#e69500] active:bg-[#cc8400]"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#002a5c] mb-3 sm:mb-4 mt-2 sm:mt-0">
            Solicitud de Reserva
          </h2>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4 text-[#000000]">
            {/* Columna Izquierda */}
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                <button
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-semibold ${activeTab === 'caracteristicas'
                      ? 'bg-[#fca311] text-white'
                      : 'bg-[#E4D5C1] text-white'
                    }`}
                  onClick={() => setActiveTab('caracteristicas')}
                >
                  Características
                </button>
                <button
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-semibold ${activeTab === 'precio'
                      ? 'bg-[#fca311] text-white'
                      : 'bg-[#E4D5C1] text-white'
                    }`}
                  onClick={() => setActiveTab('precio')}
                >
                  Desglose de precio
                </button>
              </div>

              <div className="border border-black rounded-lg sm:rounded-xl p-2 sm:p-4 overflow-y-auto max-h-[200px] sm:max-h-[250px] md:max-h-[300px] bg-white">
                {activeTab === 'caracteristicas' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <Caracteristicas auto={auto} />
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    <Precio precioPorDia={auto.precioRentaDiario} />
                  </div>
                )}
              </div>

              <LugarRecogida />
            </div>

            {/* Columna Derecha */}
            <div className="flex-1 border border-black rounded-lg sm:rounded-xl p-2 sm:p-4 space-y-3 sm:space-y-4 bg-white max-h-[500px] sm:max-h-[600px] md:max-h-[700px] overflow-y-auto">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#002a5c] mb-1 sm:mb-2">Seleccionar fechas</h3>
                <div className="overflow-hidden flex justify-center">
                  <CalendarReserva dateRange={dateRange} setDateRange={setDateRange} />
                </div>
              </div>

              <SelectorHoraAlquiler
                pickupTime={pickupTime}
                dropoffTime={dropoffTime}
                setPickupTime={setPickupTime}
                setDropoffTime={setDropoffTime}
              />
            </div>
          </div>

          <div className="border border-black rounded-lg sm:rounded-xl w-full mb-3 p-2 sm:p-4">
            <TerminosCondiciones onAceptarTerminos={setAceptoTerminos} />
          </div>

          <div className="flex justify-center">
            <button
              className="bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition hover:bg-[#e69500] active:bg-[#cc8400] max-w-[250px] w-full"
              onClick={() => {
                // Validación de términos
                if (!aceptoTerminos) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Aviso',
                    text: 'Debe aceptar los términos y condiciones antes de continuar.',
                    confirmButtonColor: '#fca311'
                  });
                  return;
                }

                // Validación de fechas seleccionadas
                if (!dateRange.from || !dateRange.to) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Fechas incompletas',
                    text: 'Debe seleccionar una fecha de inicio y una de fin.',
                    confirmButtonColor: '#fca311'
                  });
                  return;
                }

                // Validación de hora solo si es un solo día
                const esUnSoloDia = dateRange.from.toDateString() === dateRange.to.toDateString();
                if (esUnSoloDia && pickupTime >= dropoffTime) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Horas incorrectas',
                    text: 'La hora de devolución debe ser posterior a la de recogida en el mismo día.',
                    confirmButtonColor: '#fca311'
                  });
                  return;
                }

                onClose();
                setMostrarPanelConfirmarSolicitud(true);
              }}
            >
              Enviar solicitud de reserva
            </button>

          </div>

        </div>
      </div>
    </>
  );
}