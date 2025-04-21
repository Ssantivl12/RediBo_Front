'use client';
import React, { useState } from 'react';
import styles from './ListadoDeAutos.module.css';
import ModalDeConfirmacion from '@components/modal/ModalDeConfirmacion';

// Interfaces para las solicitudes y autos
interface SolicitudPendiente {
  id: string;
  nombreSolicitante: string;
  fechas: string;
}

interface Auto {
  id: string;
  nombre: string;
  placa: string;
  precioPorDia: number;
  imagen: string | null;
  solicitudesPendientes: SolicitudPendiente[];
  estaRentado: boolean;
}

interface ListadoDeAutosProps {
  activeFilter: string;
  autos: Auto[];
}

const ListadoDeAutos: React.FC<ListadoDeAutosProps> = ({ activeFilter, autos = [] }) => {
  // Estados para gestionar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    action: () => {},
    variant: 'confirmation' as 'confirmation' | 'success',
    showSuccess: false,
    isProcessing: false
  });
  
  // Estado para mantener el auto y solicitud seleccionados
  const [autoSeleccionado, setAutoSeleccionado] = useState<string | null>(null);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<string | null>(null);

  // Verificar que autos es un array antes de filtrar
  const autosArray = Array.isArray(autos) ? autos : [];
  
  // Filtrar los autos según el filtro activo
  const filtrarAutos = (autos: Auto[], filtro: string): Auto[] => {
    switch (filtro) {
      case 'solicitudes':
        return autos.filter(auto => auto.solicitudesPendientes && auto.solicitudesPendientes.length > 0);
      case 'rentados':
        return autos.filter(auto => auto.estaRentado === true);
      case 'disponibles':
        return autos.filter(auto => auto.estaRentado === false);
      case 'todos':
      default:
        return autos;
    }
  };

  const autosFiltrados = filtrarAutos(autosArray, activeFilter);

  // Función para mostrar el modal de aceptar solicitud
  const mostrarModalAceptar = (autoId: string, solicitudId: string, nombreSolicitante: string) => {
    setAutoSeleccionado(autoId);
    setSolicitudSeleccionada(solicitudId);
    setModalConfig({
      title: "Confirmar Aceptación",
      message: `¿Estás seguro de que deseas aceptar la solicitud de ${nombreSolicitante}?`,
      confirmText: "ACEPTAR",
      action: () => ejecutarAceptarSolicitud(autoId, solicitudId),
      variant: 'confirmation',
      showSuccess: false,
      isProcessing: false
    });
    setModalAbierto(true);
  };

  // Función para mostrar el modal de denegar solicitud
  const mostrarModalDenegar = (autoId: string, solicitudId: string, nombreSolicitante: string) => {
    setAutoSeleccionado(autoId);
    setSolicitudSeleccionada(solicitudId);
    setModalConfig({
      title: "Confirmar Rechazo",
      message: `¿Estás seguro de que deseas denegar la solicitud de ${nombreSolicitante}?`,
      confirmText: "DENEGAR",
      action: () => ejecutarDenegarSolicitud(autoId, solicitudId),
      variant: 'confirmation',
      showSuccess: false,
      isProcessing: false
    });
    setModalAbierto(true);
  };

  // Funciones para ejecutar las acciones tras la confirmación
  const ejecutarAceptarSolicitud = async (autoId: string, solicitudId: string) => {
    try {
      setModalConfig(prev => ({ ...prev, isProcessing: true }));
      
      // Aquí iría la lógica para aceptar la solicitud mediante una llamada a la API
      console.log(`Aceptando solicitud ${solicitudId} para el auto ${autoId}`);
      
      // Simular un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      setModalConfig({
        title: "Solicitud Aceptada",
        message: "La solicitud ha sido aceptada correctamente",
        confirmText: "CONTINUAR",
        action: cerrarModal,
        variant: 'success',
        showSuccess: true,
        isProcessing: false
      });
      
      // Aquí actualizarías los datos localmente o harías una nueva petición al servidor
      
    } catch (error) {
      console.error("Error al aceptar la solicitud:", error);
      setModalConfig({
        title: "Error",
        message: "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.",
        confirmText: "ENTENDIDO",
        action: cerrarModal,
        variant: 'success',
        showSuccess: false,
        isProcessing: false
      });
    }
  };

  const ejecutarDenegarSolicitud = async (autoId: string, solicitudId: string) => {
    try {
      setModalConfig(prev => ({ ...prev, isProcessing: true }));
      
      // Aquí iría la lógica para denegar la solicitud mediante una llamada a la API
      console.log(`Denegando solicitud ${solicitudId} para el auto ${autoId}`);
      
      // Simular un tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      setModalConfig({
        title: "Solicitud Denegada",
        message: "La solicitud ha sido denegada correctamente",
        confirmText: "CONTINUAR",
        action: cerrarModal,
        variant: 'success',
        showSuccess: true,
        isProcessing: false
      });
      
      // Aquí actualizarías los datos localmente o harías una nueva petición al servidor
      
    } catch (error) {
      console.error("Error al denegar la solicitud:", error);
      setModalConfig({
        title: "Error",
        message: "Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.",
        confirmText: "ENTENDIDO",
        action: cerrarModal,
        variant: 'success',
        showSuccess: false,
        isProcessing: false
      });
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setAutoSeleccionado(null);
    setSolicitudSeleccionada(null);
  };

  // Si no hay autos disponibles en absoluto
  if (!autosArray.length) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No hay autos disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.carsContainer}>
        {autosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No se encontraron autos que coincidan con el filtro actual.</p>
          </div>
        ) : (
          autosFiltrados.map(auto => (
            <div key={auto.id} className={styles.carContainer}>
              <img 
                src={'https://cdn.motor1.com/images/mgl/6ZzvLZ/s1/2024-audi-rs7-performance-review.jpg'} 
                alt={auto.nombre} 
                className={styles.carImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.jpg'; // Imagen de respaldo si la original falla
                }} 
              />
              <div className={styles.carInfo}>
                <div>
                  <span className={styles.carName}>{auto.nombre}</span>
                  <div className={styles.pendingBadge}>
                    <span className={styles.licensePlate}>{auto.placa}</span>
                  </div>
                </div>
                <div className={styles.carPrice}>$ {auto.precioPorDia} /día</div>
              </div>
              
              <div className={styles.pendingContainer}>
                <div className={styles.pendingBadge}>
                  {auto.solicitudesPendientes?.length || 0} solicitudes pendientes
                  {auto.estaRentado && <span className={styles.rentedBadge}> • EN RENTA</span>}
                </div>
              </div>
              
              {auto.solicitudesPendientes && auto.solicitudesPendientes.length > 0 && (
                <>
                  <div className={styles.requestsTitle}>Solicitudes de renta</div>
                  
                  {auto.solicitudesPendientes.map(solicitud => (
                    <div key={solicitud.id} className={styles.requestItem}>
                      <div className={styles.requesterInfo}>
                        <div className={styles.requesterName}>{solicitud.nombreSolicitante}</div>
                        <div className={styles.requestDate}>{solicitud.fechas}</div>
                      </div>
                      <div className={styles.buttonContainer}>
                        <button 
                          className={`${styles.btn} ${styles.btnReject}`}
                          onClick={() => mostrarModalDenegar(auto.id, solicitud.id, solicitud.nombreSolicitante)}
                        >
                          Denegar
                        </button>
                        <button 
                          className={`${styles.btn} ${styles.btnAccept}`}
                          onClick={() => mostrarModalAceptar(auto.id, solicitud.id, solicitud.nombreSolicitante)}
                        >
                          Aceptar
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      <ModalDeConfirmacion
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isProcessing={modalConfig.isProcessing}
        variant={modalConfig.variant}
        showSuccess={modalConfig.showSuccess}
      />
    </>
  );
};

export default ListadoDeAutos;