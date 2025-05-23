"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import ModalDeConfirmacion from "@components/modal/ModalDeConfirmacion";
import RegistrarMantenimientoModal from "@components/MantenimientoModal/RegistrarMantenimientoModal";
import { FiCheckCircle } from "react-icons/fi";
import { API_URL } from '@config/api';
import { VerKilometraje } from "../auto/VerKilometraje";

interface Vehiculo {
  idAuto: number;
  marca: string;
  modelo: string;
  anio: string;
  placa: string;
  imagen?: string;
  estado?: string;
  estadoActual: {
    tipo: string;
    datos: {
      estado: string;
      accionPosible: string;
      idReserva?: number;
      fechaInicio?: Date;
      fechaFin?: Date;
      cliente?: {
        nombre: string;
        apellido: string;
        email: string;
      };
      idHistorial?: number;
      fechaFinPrevista?: Date;
      tipoMantenimiento?: string;
      descripcion?: string;
    }
  }
}

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

export default function GestionarVehiculos() {
  const params = useParams();
  const [mostrarModalKilometraje, setModalKilometraje] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mostrarModalMantenimiento, setMostrarModalMantenimiento] = useState(false);
  // Nueva estado para el modal de confirmación de mantenimiento
  const [mostrarConfirmacionMantenimiento, setMostrarConfirmacionMantenimiento] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<number | null>(null);
  const [mantenimientoExitoso, setMantenimientoExitoso] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [accionActual, setAccionActual] = useState("");
  // Estado para almacenar los datos del formulario temporalmente
  const [datosMantenimientoTemp, setDatosMantenimientoTemp] = useState<MantenimientoData | null>(null);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    costo: "",
    tipoMantenimiento: "Preventivo",
    kilometraje: "",
  });

  const kilometrajeActual = 45280;
  const historialKilometraje: MileageRecord[] = [
    {
      id: '1',
      nombre: 'Carlos Rodríguez',
      fechaInicio: '2024-02-01',
      fechaFin: '2024-02-15',
      kilometraje: 45280
    },
    {
      id: '2',
      nombre: 'María González',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-01-30',
      kilometraje: 44800
    },
    {
      id: '3',
      nombre: 'Juan Pérez',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-14',
      kilometraje: 44100
    },
    {
      id: '4',
      nombre: 'Ana Martínez',
      fechaInicio: '2023-12-15',
      fechaFin: '2023-12-31',
      kilometraje: 43500
    },
    {
      id: '5',
      nombre: 'Roberto Sánchez',
      fechaInicio: '2023-12-01',
      fechaFin: '2023-12-14',
      kilometraje: 42800
    },
    {
      id: '6',
      nombre: 'Laura Torres',
      fechaInicio: '2023-11-15',
      fechaFin: '2023-11-30',
      kilometraje: 42000
    }
  ];

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    setCargando(true);
    setError("");
    const idArrendador = params.idArrendador;
    
    try {
      const response = await fetch(`${API_URL}/autos/arrendador/${idArrendador}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar vehículos: ${response.status}`);
      }
      
      const data = await response.json();
      setVehiculos(data.autos);
      console.log(data);
    } catch (err) {
      console.error("Error al cargar los vehículos:", err);
      setError("No se pudieron cargar los vehículos. Por favor, intente nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  const handleLiberarRenta = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setAccionActual("FINALIZAR_RENTA");
    setMostrarConfirmacion(true);
  };
{/** 
  const handleCancelarReserva = (idAuto: number, idReserva: number) => {
    setVehiculoSeleccionado(idAuto);
    setAccionActual("CANCELAR_RESERVA");
    setMostrarConfirmacion(true);
  };
  */}
  const confirmarAccion = async () => {
    if (!vehiculoSeleccionado) return;
    
    setIsProcessing(true);
    
    try {
      // Encontrar el vehículo seleccionado
      const vehiculo = vehiculos.find(v => v.idAuto === vehiculoSeleccionado);
      if (!vehiculo) throw new Error("Vehículo no encontrado");
      
      let endpoint = "";
      let metodo = "";
      
      // Determinar qué acción realizar
      if (accionActual === "FINALIZAR_RENTA" && vehiculo.estadoActual.datos.idReserva) {
        endpoint = `${API_URL}/reservas/${vehiculo.estadoActual.datos.idReserva}/liberar`;
        metodo = "PUT";
      } else if (accionActual === "CANCELAR_RESERVA" && vehiculo.estadoActual.datos.idReserva) {
        endpoint = `${API_URL}/reservas/cancelar/${vehiculo.estadoActual.datos.idReserva}`;
      } else if (accionActual === "FINALIZAR_MANTENIMIENTO" && vehiculo.estadoActual.datos.idHistorial) {
        endpoint = `${API_URL}/mantenimiento/${vehiculo.estadoActual.datos.idHistorial}/finalizar`;
        metodo = "POST";
      }
      
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: metodo,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error al procesar la acción: ${response.status}`);
        }
        
        // Recargar vehículos para ver los cambios
        await cargarVehiculos();
        setMostrarExito(true);
      }
    } catch (err) {
      console.error("Error al procesar la acción:", err);
      setError("No se pudo completar la acción. Por favor, intente nuevamente.");
    } finally {
      setIsProcessing(false);
      setMostrarConfirmacion(false);
      setVehiculoSeleccionado(null);
    }
  };

  const handleMostrarModalMantenimiento = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      descripcion: "",
      costo: "",
      tipoMantenimiento: "PREVENTIVO",
      kilometraje: "",
    });
    setMostrarModalMantenimiento(true);
  };

  const parseFechaInicio = (fechaStr: string): string | null => {
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, anio] = partes;
    // formato YYYY-MM-DDTHH:mm:ss.sssZ
    const fecha = new Date(`${anio}-${mes}-${dia}T00:00:00.000Z`);
  
    return isNaN(fecha.getTime()) ? null : fecha.toISOString();
  };

  const parseFechaFin = (fechaStr: string): string | null => {
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return null;
    const [dia, mes, anio] = partes;
    // formato YYYY-MM-DDTHH:mm:ss.sssZ
    const fecha = new Date(`${anio}-${mes}-${dia}T23:59:59.999Z`);
  
    return isNaN(fecha.getTime()) ? null : fecha.toISOString();
  };
  
  // Función para preparar datos de mantenimiento y mostrar confirmación
  const handlePreRegistrarMantenimiento = (data: MantenimientoData) => {
    setDatosMantenimientoTemp(data);
    setMostrarModalMantenimiento(false);
    setMostrarConfirmacionMantenimiento(true);
  };
  
  // Función para confirmar y registrar el mantenimiento
  const confirmarRegistroMantenimiento = async () => {
    if (!datosMantenimientoTemp || !vehiculoSeleccionado) return;
    
    setIsProcessing(true);
    
    try {
      const data = datosMantenimientoTemp;
      console.log("Datos de mantenimiento:", data);
      const fechaInicio = parseFechaInicio(data.fechaInicio);
      const fechaFin = parseFechaFin(data.fechaFin);
      const kilometraje = Number(data.kilometraje);
      
      const response = await fetch(`${API_URL}/autos/${vehiculoSeleccionado}/mantenimiento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: data.descripcion,
          tipoMantenimiento: data.tipoMantenimiento,
          kilometraje: kilometraje,
          costo: parseFloat(data.costo),
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al registrar mantenimiento: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);
      await cargarVehiculos();
      setMantenimientoExitoso(true);
    } catch (err) {
      console.error("Error al registrar mantenimiento:", err);
      setError("No se pudo registrar el mantenimiento. Por favor, intente nuevamente.");
    } finally {
      setIsProcessing(false);
      setMostrarConfirmacionMantenimiento(false);
      setVehiculoSeleccionado(null);
      setDatosMantenimientoTemp(null);
    }
  };

  const handleTerminarMantenimiento = (idAuto: number) => {
    setVehiculoSeleccionado(idAuto);
    setAccionActual("FINALIZAR_MANTENIMIENTO");
    setMostrarConfirmacion(true);
  };

  const renderEstadoVehiculo = (vehiculo: Vehiculo) => {
    const { estadoActual } = vehiculo;
    
    switch (estadoActual.tipo) {
      case 'RENTA_ACTIVA':
        return (
          <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Estado:
              </span>{" "}
              {estadoActual.datos.estado === 'EN_CURSO' ? 'Rentado' : 'Reservado'}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Rentado a:
              </span>{" "}
              {estadoActual.datos.cliente?.nombre} {estadoActual.datos.cliente?.apellido}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Fecha de término:
              </span>{" "}
              {estadoActual.datos.fechaFin ? new Date(estadoActual.datos.fechaFin).toLocaleDateString() : 'No especificada'}
            </p>
          </div>
        );
      case 'EN_MANTENIMIENTO':
        return (
          <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Estado:
              </span>{" "}
              En Mantenimiento
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Tipo:
              </span>{" "}
              {estadoActual.datos.tipoMantenimiento}
            </p>
            <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Fecha fin prevista:
              </span>{" "}
              {estadoActual.datos.fechaFinPrevista ? new Date(estadoActual.datos.fechaFinPrevista).toLocaleDateString() : 'No especificada'}
            </p>
          </div>
        );
        case 'RENTA_FINALIZADA_POR_LIBERAR':
          return (
            <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
              <p>
                <span className="font-semibold" style={{ color: "#11295B" }}>
                  Estado:
                </span>{" "}
                Renta Finalizada, por liberar
              </p>
              <p>
              <span className="font-semibold" style={{ color: "#11295B" }}>
                Rentado a:
              </span>{" "}
              {estadoActual.datos.cliente?.nombre} {estadoActual.datos.cliente?.apellido}
            </p>
              <p>
                <span className="font-semibold" style={{ color: "#11295B" }}>
                  Fecha fin:
                </span>{" "}
                {estadoActual.datos.fechaFin ? new Date(estadoActual.datos.fechaFin).toLocaleDateString() : 'No especificada'}
              </p>
            </div>
          );
      case 'NO_DISPONIBLE':
        return (
          <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
            No Disponible
          </span>
        );
      case 'DISPONIBLE':
      default:
        return (
          <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
            Disponible
          </span>
        );
    }
  };

  const renderBotonAccion = (vehiculo: Vehiculo) => {
    const { estadoActual } = vehiculo;
    const accionPosible = estadoActual.datos.accionPosible;
    
    if (!accionPosible) return null;
    
    switch (accionPosible) {
      case 'FINALIZAR_RENTA':
        return (
          <button
            onClick={() => handleLiberarRenta(vehiculo.idAuto)}
            className="bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Liberar Auto
          </button>
        );
    {/** 
      case 'CANCELAR_RESERVA':
        return (
          <button
            onClick={() => handleCancelarReserva(vehiculo.idAuto, estadoActual.datos.idReserva || 0)}
            className="bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Cancelar Reserva
          </button>
        );
    */}
      case 'FINALIZAR_MANTENIMIENTO':
        return (
          <button
            onClick={() => handleTerminarMantenimiento(vehiculo.idAuto)}
            className="bg-[#FCA311] hover:bg-yellow-500 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Terminar Mantenimiento
          </button>
        );
      case 'MARCAR_NO_DISPONIBLE':
      case 'MARCAR_DISPONIBLE':
        return (
          <button
            onClick={() => handleMostrarModalMantenimiento(vehiculo.idAuto)}
            className="bg-[#11295B] hover:bg-blue-800 text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors"
          >
            Poner en Mantenimiento
          </button>
        );
      default:
        return null;
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium">Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={cargarVehiculos}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div className="space-y-6 px-4 py-6">
            <button
        onClick={() => setModalKilometraje(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Mostrar Historial de Kilometraje
      </button>
      {vehiculos.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium">No hay vehículos registrados</p>
        </div>
      ) : (
        vehiculos.map((vehiculo) => (
          <div
            key={vehiculo.idAuto}
            className="bg-[#D8C4A7] rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 lg:w-2/5 h-[250px] md:h-[300px] lg:h-[350px] bg-gray-300 flex items-center justify-center text-gray-600 text-2xl overflow-hidden">
              {vehiculo.imagen ? (
                <img
                  src={vehiculo.imagen}
                  alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                "Sin imagen disponible"
              )}
            </div>

              {/* Información - Debajo de la imagen en móvil, al lado en desktop */}
              <div className="p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/5">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-xl font-bold" style={{ color: "#11295B" }}>
                      {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                    </h2>
                    <span className="bg-white text-black text-sm px-2 py-1 rounded-full w-fit">
                      {vehiculo.placa}
                    </span>
                  </div>
                  
                  <div>
                    {renderEstadoVehiculo(vehiculo)}
                  </div>
                </div>
                
                <div className="mt-4 w-full">
                  {renderBotonAccion(vehiculo)}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal de confirmación para acciones */}
      <ModalDeConfirmacion
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={confirmarAccion}
        title={
          accionActual === "FINALIZAR_RENTA" 
            ? "¿Está seguro que desea liberar el vehículo?" 
            : accionActual === "CANCELAR_RESERVA"
            ? "¿Está seguro que desea cancelar la reserva?"
            : "¿Está seguro que desea finalizar el mantenimiento?"
        }
        message={
          accionActual === "FINALIZAR_RENTA"
            ? "Esta acción marcará el vehículo como disponible para nuevas rentas, ya que la renta actual ha finalizado por completo."
            : accionActual === "CANCELAR_RESERVA" 
            ? "Al cancelar esta reserva, el vehículo estará disponible para otras reservas en este período."
            : "El vehículo pasará a estar disponible para nuevas rentas."
        }
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      {/* Modal de éxito general */}
      <ModalDeConfirmacion
        isOpen={mostrarExito}
        onClose={() => setMostrarExito(false)}
        onConfirm={() => setMostrarExito(false)}
        title={
          accionActual === "FINALIZAR_RENTA" 
            ? "Vehículo liberado con éxito" 
            : accionActual === "CANCELAR_RESERVA"
            ? "Reserva cancelada con éxito"
            : "Mantenimiento finalizado con éxito"
        }
        message="La acción fue exitosa."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      {/* Modal de éxito para mantenimiento */}
      <ModalDeConfirmacion
        isOpen={mantenimientoExitoso}
        onClose={() => setMantenimientoExitoso(false)}
        onConfirm={() => setMantenimientoExitoso(false)}
        title="Mantenimiento registrado con éxito"
        message="La operación de mantenimiento se ha registrado correctamente."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      {/* Nuevo Modal de confirmación de datos de mantenimiento */}
      <ModalDeConfirmacion
        isOpen={mostrarConfirmacionMantenimiento}
        onClose={() => setMostrarConfirmacionMantenimiento(false)}
        onConfirm={confirmarRegistroMantenimiento}
        title="¿Confirma los datos del mantenimiento?"
        message={
          datosMantenimientoTemp ? 
          `Tipo: ${datosMantenimientoTemp.tipoMantenimiento}
           Fecha inicio: ${datosMantenimientoTemp.fechaInicio}
           Fecha fin: ${datosMantenimientoTemp.fechaFin}
           Costo: $${datosMantenimientoTemp.costo}
           Descripción: ${datosMantenimientoTemp.descripcion}` : 
          "¿Está seguro de registrar este mantenimiento?"
        }
        confirmText="CONFIRMAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      {/* Modal de registro de mantenimiento - cambiado el onSubmit */}
      <RegistrarMantenimientoModal
        isOpen={mostrarModalMantenimiento}
        onClose={() => setMostrarModalMantenimiento(false)}
        onSubmit={handlePreRegistrarMantenimiento}
        formData={formData}
        setFormData={setFormData}
        onCancel={() => setMostrarModalMantenimiento(false)}
      />
      <VerKilometraje
              isOpen={mostrarModalKilometraje}
              onClose={() => setModalKilometraje(false)}
              kilometrajeActual={kilometrajeActual}
              mileageHistory={historialKilometraje}
              />
    </div>
  );
}