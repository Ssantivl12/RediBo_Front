"use client";

import React, { useState } from "react";
import ModalDeConfirmacion from "@components/modal/ModalDeConfirmacion";
import RegistrarMantenimientoModal from "@components/MantenimientoModal/RegistrarMantenimientoModal";
import { FiCheckCircle } from "react-icons/fi";

interface Vehiculo {
  nombre: string;
  placa: string;
  estado: string;
  rentadoPor?: string;
  fechaTermino?: string;
  imagen: string;
  boton: string;
  colorBoton?: string;
}

interface MantenimientoData {
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  costo: string;
  tipoMantenimiento: string;
  kilometraje: string;
}

const autos = [
  {
    nombre: "Honda Civic 2023",
    placa: "ABC-123",
    estado: "Rentado",
    rentadoPor: "Juan Pérez",
    fechaTermino: "2024-02-15",
    imagen:
      "https://cdn.motor1.com/images/mgl/MJvJM/s3/honda-civic-e-hev-2022-prueba.jpg",
    boton: "Liberar Auto",
    colorBoton: "bg-[#FCA311] hover:bg-yellow-500",
  },
  {
    nombre: "Toyota Corolla 2024",
    placa: "XYZ-789",
    estado: "En Mantenimiento",
    imagen: "",
    boton: "",
  },
  {
    nombre: "Mercedes Benz C200",
    placa: "DEF-456",
    estado: "Disponible",
    imagen: "",
    boton: "Poner en Mantenimiento",
    colorBoton: "bg-[#11295B] hover:bg-blue-800",
  },
];

export default function GestionarVehiculos() {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(autos);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mostrarModalMantenimiento, setMostrarModalMantenimiento] =
    useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string>("");
  const [mantenimientoExitoso, setMantenimientoExitoso] = useState(false);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    costo: "",
    tipoMantenimiento: "Preventivo",
    kilometraje: "",
  });

  const handleLiberar = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarLiberacion = () => {
    setIsProcessing(true);
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      setMostrarConfirmacion(false);
      setMostrarExito(true);

      // Actualizar estado del vehículo
      const nuevosVehiculos = vehiculos.map((vehiculo) => {
        if (vehiculo.placa === "ABC-123") {
          return {
            ...vehiculo,
            estado: "Disponible",
            rentadoPor: "",
            fechaTermino: "",
            boton: "Poner en Mantenimiento",
            colorBoton: "bg-[#11295B] hover:bg-blue-800",
          };
        }
        return vehiculo;
      });
      setVehiculos(nuevosVehiculos);
    }, 1000);
  };

  const handleMostrarModalMantenimiento = (placa: string) => {
    setVehiculoSeleccionado(placa);
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      descripcion: "",
      costo: "",
      tipoMantenimiento: "Preventivo",
      kilometraje: "",
    });
    setMostrarModalMantenimiento(true);
  };

  const handleRegistrarMantenimiento = (data: MantenimientoData) => {
    setIsProcessing(true);
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      setMostrarModalMantenimiento(false);
      console.log(data);
      // Actualizar el estado del vehículo correspondiente
      const nuevosVehiculos = vehiculos.map(vehiculo => {
        if (vehiculo.placa === vehiculoSeleccionado) {
          return {
            ...vehiculo,
            estado: 'En Mantenimiento',
            boton: 'Terminar Mantenimiento',
            colorBoton: 'bg-[#FCA311] hover:bg-yellow-500'
          };
        }
        return vehiculo;
      });
      setVehiculos(nuevosVehiculos);
      setMantenimientoExitoso(true);
    }, 1000);
  };

  const handleCancelarMantenimiento = () => {
    setMostrarModalMantenimiento(false);
  };

  const handleTerminarMantenimiento = (placa: string) => {
    setIsProcessing(true);
    setVehiculoSeleccionado(placa);

    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);

      // Actualizar el estado del vehículo correspondiente
      const nuevosVehiculos = vehiculos.map((vehiculo) => {
        if (vehiculo.placa === placa) {
          return {
            ...vehiculo,
            estado: "Disponible",
            boton: "Poner en Mantenimiento",
            colorBoton: "bg-[#11295B] hover:bg-blue-800",
          };
        }
        return vehiculo;
      });
      setVehiculos(nuevosVehiculos);
      setMantenimientoExitoso(true);
    }, 1000);
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {vehiculos.map((auto, index) => (
        <div
          key={index}
          className="flex items-start bg-[#D8C4A7] p-6 rounded-lg shadow-md space-x-6"
        >
          <div className="w-[400px] h-[300px] bg-gray-300 flex items-center justify-center text-gray-600 text-2xl overflow-hidden rounded-md">
            {auto.imagen ? (
              <img
                src={auto.imagen}
                alt={auto.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              "400 × 300"
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold" style={{ color: "#11295B" }}>
                {auto.nombre}
              </h2>
              <span className="bg-white text-black text-sm px-2 py-1 rounded-full">
                {auto.placa}
              </span>
            </div>

            {auto.estado === "Rentado" ? (
              <div className="bg-white p-4 rounded-md space-y-2 shadow-sm">
                <p style={{ color: "#11295B" }} className="font-semibold">
                  Estado Actual
                </p>
                <p>
                  <span className="font-semibold" style={{ color: "#11295B" }}>
                    Estado:
                  </span>{" "}
                  Ocupado
                </p>
                <p>
                  <span className="font-semibold" style={{ color: "#11295B" }}>
                    Rentado a:
                  </span>{" "}
                  {auto.rentadoPor}
                </p>
                <p>
                  <span className="font-semibold" style={{ color: "#11295B" }}>
                    Fecha de término:
                  </span>{" "}
                  {auto.fechaTermino}
                </p>
              </div>
            ) : (
              <span className="bg-white text-black text-base font-medium px-3 py-1 rounded-full w-fit">
                {auto.estado}
              </span>
            )}

            {auto.boton && (
              <div>
                {auto.estado === "En Mantenimiento" ? (
                  <button
                    onClick={() => handleTerminarMantenimiento(auto.placa)}
                    className={`${auto.colorBoton} text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors`}
                  >
                    {auto.boton}
                  </button>
                ) : auto.boton === "Poner en Mantenimiento" ? (
                  <button
                    onClick={() => handleMostrarModalMantenimiento(auto.placa)}
                    className={`${auto.colorBoton} text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors`}
                  >
                    {auto.boton}
                  </button>
                ) : (
                  <button
                    onClick={handleLiberar}
                    className={`${auto.colorBoton} text-white text-base font-semibold px-4 py-2 rounded-md w-fit transition-colors`}
                  >
                    {auto.boton}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Modal de confirmación para liberar vehículo */}
      <ModalDeConfirmacion
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={confirmarLiberacion}
        title="¿Está seguro que desea liberar el vehículo?"
        message="¿Desea liberar el vehículo? Los días especificados en la renta actual estarán disponibles para una nueva renta."
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
        title="Vehículo liberado con éxito"
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
        title="Mantenimiento actualizado con éxito"
        message="La operación de mantenimiento se ha registrado correctamente."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />

      {/* Modal de registro de mantenimiento */}
      <RegistrarMantenimientoModal
        isOpen={mostrarModalMantenimiento}
        onClose={() => setMostrarModalMantenimiento(false)}
        onSubmit={handleRegistrarMantenimiento}
        formData={formData}
        setFormData={setFormData}
        onCancel={handleCancelarMantenimiento}
      />
    </div>
  );
}
