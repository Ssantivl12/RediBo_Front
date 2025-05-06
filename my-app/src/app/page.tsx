"use client";

import { useState, useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { Car } from '@/types';
import HostView from '@/components/HostView';
import NotificationBell from "@/components/NotificationBell";
import UserMenu from "@/components/UserMenu";
import CalendarIconPanel from "@/components/CalendarIconPanel";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ['latin'] });


interface Alert {
  id: number;
  car: string;
  model: string;
  brand: string;
  tenant: string;
  date: string;
  time: string;
  exceededTime: string;
  returnInfo: string;
  viewed: boolean;
  imageUrl: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const alertsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/alerts");
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      }
    };

    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cars");
        const data = await res.json();
        setCars(data.sort((a: Car, b: Car) => b.totalRentals - a.totalRentals));
      } catch (error) {
        console.error("Error al obtener carros:", error);
      }
    };

    fetchAlerts();
    fetchCars();
  }, []);

  const unviewedAlertsCount = alerts.filter(alert => !alert.viewed).length;

  const toggleAlerts = () => setShowAlerts(!showAlerts);
  const toggleShowAll = () => {
    setShowAll(!showAll);
    setTimeout(() => {
      if (alertsContainerRef.current) alertsContainerRef.current.scrollTop = 0;
    }, 10);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: "DELETE",
      });
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error al eliminar alerta:", error);
    }
  };

  const handleViewMore = (alert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, viewed: true } : a));
    setSelectedAlert(alert);
    setShowModal(true);
  };

  return (
    <main className={`min-h-screen bg-white text-black ${inter.className}`}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-300">
        <h1 className="text-lg sm:text-xl font-bold text-orange-500">REDIBO</h1>
        <div className="flex items-center space-x-2 sm:space-x-4 relative">
          <NotificationBell unviewedCount={unviewedAlertsCount} onClick={toggleAlerts} />
          <UserMenu />
          <CalendarIconPanel />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <HostView cars={cars} />
      </main>

      {/* Alert Panel */}
      {showAlerts && (
        <div 
          ref={alertsContainerRef}
          className={`absolute right-2 sm:right-6 top-16 sm:top-20 w-[95%] sm:w-[90%] max-w-[440px] bg-[#d9d9d9] rounded-md border border-orange-400 p-3 sm:p-4 shadow-lg z-40 transition-all duration-300 ${showAll ? 'h-[70vh] max-h-[560px]' : 'h-[60vh] max-h-[360px]'}`}
        >
          <div className="flex items-center mb-2 space-x-2">
            <h2 className="text-xs sm:text-sm font-semibold">Alertas</h2>
            <button
              className="text-xs text-white px-2 py-0.5 rounded hover:opacity-90"
              style={{ backgroundColor: '#FCA311' }}
              onClick={toggleShowAll}
            >
              {showAll ? 'Ver menos' : 'Ver todo'}
            </button>
            <span className="text-xs text-gray-600">({alerts.length})</span>
          </div>

          <div className="h-[calc(100%-3rem)] overflow-y-auto pr-2 sm:pr-8">
            {alerts.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {(showAll ? alerts : alerts.slice(0, 3)).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`group relative bg-[#c4c4c4] border-2 ${!alert.viewed ? 'border-orange-400' : 'border-gray-400'} px-3 sm:px-4 py-2 rounded overflow-visible transition-all duration-200 hover:bg-[#b4b4b4] hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-md cursor-pointer`}
                    onClick={() => handleViewMore(alert)}
                  >
                    <button
                      onClick={(e) => handleDelete(alert.id, e)}
                      className="absolute -right-4 sm:-right-6 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 z-10"
                    >
                      <FiX size={12} className="sm:hidden" />
                      <FiX size={14} className="hidden sm:block" />
                    </button>

                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm md:text-base text-black font-bold">Tiempo Excedido!</p>
                      <span className="text-xs text-black">{alert.date} {alert.time}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                      <div>
                        <p className="text-xs sm:text-sm text-black">Modelo: {alert.model}</p>
                        <p className="text-xs sm:text-sm text-black">Marca: {alert.brand}</p>
                        <p className="text-xs sm:text-sm text-black">Inquilino: {alert.tenant}</p>
                      </div>
                      <button
                        className="text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:opacity-90 mt-2 sm:mt-0 sm:ml-4 self-end sm:self-auto"
                        style={{ backgroundColor: '#FCA311' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMore(alert);
                        }}
                      >
                        Ver más
                      </button>
                    </div>

                    {!alert.viewed && (
                      <div className="absolute top-2 left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 italic mt-4 text-xs sm:text-sm">No hay alertas.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal de Alerta */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#E4D5C1] rounded-md shadow-lg w-[95%] max-w-md pointer-events-auto">
            <div className="bg-[#FCA311] py-2 px-3 sm:px-4 flex items-center justify-between">
              <div className="w-6"></div>
              <div className="flex items-center justify-center">
                <div className="text-red-600 mr-1 sm:mr-2">
                  <FiAlertTriangle size={20} />
                </div>
                <span className="font-bold text-black text-xs sm:text-sm md:text-base">ALERTA: TIEMPO EXCEDIDO</span>
              </div>
              <button
                className="text-black hover:text-gray-700 w-6 flex items-center justify-center"
                onClick={() => setShowModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-full sm:w-40 h-24 sm:h-32 bg-gray-200 mb-2 rounded overflow-hidden">
                    <img
                      src={selectedAlert.imageUrl}
                      alt="Vehículo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center font-semibold text-xs sm:text-sm">{selectedAlert.model}</p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Nombre inquilino: <strong>{selectedAlert.tenant}</strong></p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Marca: <strong>{selectedAlert.brand}</strong></p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Fecha: <strong>{selectedAlert.date}</strong></p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Hora: <strong>{selectedAlert.time}</strong></p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Exceso de tiempo: <strong>{selectedAlert.exceededTime}</strong></p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Devolución esperada: <strong>{selectedAlert.returnInfo}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
