"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ModalSeleccionPago from "./ModalSeleccionPago";
import PagoTargeta from "./PagoTargeta";
import PagoQR from "./PagoQR";
import "../../globals.css";

const VistaPago = () => {
  const router = useRouter();
  const [modoPago, setModoPago] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const [nombreTitular, setNombreTitular] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  useEffect(() => {
    const generarQR = async () => {
      setLoading(true);
      try {
        const monto = 100; // O el monto que corresponda
        const response = await axios.get(
          `http://localhost:3000/generarQR/${monto}`
        );
        if (response.data.mensaje === "QR generado correctamente") {
          setQrImage(`http://localhost:3000/temp/${response.data.archivoQR}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (modoPago === "qr") {
      generarQR();
    }
  }, [modoPago]);

  const handleConfirmacion = async () => {
    const idReserva = 27; // O el valor dinámico
    const concepto = "Pago por reserva de Nissan";

    if (
      !nombreTitular ||
      !numeroTarjeta ||
      !cvv ||
      !direccion ||
      !correoElectronico ||
      !mes ||
      !anio
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const fechaExpiracion = `${mes}/${anio}`;

    const datosPago = {
      monto: 1000,
      concepto,
      nombreTitular,
      numeroTarjeta,
      fechaExpiracion,
      cvv,
      direccion,
      correoElectronico,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/pagos/pagarConTarjeta/${idReserva}`,
        datosPago
      );

      if (response.status === 200) {
        alert("¡Pago confirmado con éxito!");
        router.push("/pago");
      } else {
        alert(
          "Error en el pago: " + (response.data?.mensaje || "Error desconocido")
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      const msg =
        error.response?.data?.error || "Hubo un error al realizar el pago.";
      alert("Error: " + msg);
    }
  };

  const handleConfirmacionQR = async () => {
    // Aquí iría tu lógica de confirmar pago por QR
    alert("Verificación de pago QR aún no implementada.");
  };

  const handleRecargarQR = () => {
    setQrImage("");
    setModoPago("qr");
  };

  const handleDescargarQR = () => {
    if (qrImage) {
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = "codigo-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderDetallesAuto = () => (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
        Información del Vehículo
      </h2>

      <div className="space-y-4">
        {/* Imagen del vehículo con botón de expandir en esquina inferior derecha */}
        <div className="relative flex justify-center">
          <img
            src="https://s3-us-west-2.amazonaws.com/my-car-mexico/modelos/fdbcb845/2023-Kia-Sportage-HEV-29_11zon.webp"
            alt="Kia Sportage HEV 2023"
            className="w-[400px] h-[250px] object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={() => {
              const imageWindow = window.open("", "_blank");
              imageWindow.document.write(
                '<img src="https://s3-us-west-2.amazonaws.com/my-car-mexico/modelos/fdbcb845/2023-Kia-Sportage-HEV-29_11zon.webp" alt="Vehículo" style="width: 100%; height: auto;"/>'
              );
            }}
            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            title="Ver imagen en pantalla completa"
          >
            {/* Icono expandir */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 3h6v6m0 0L10 21m11-11l-6 6M3 9V3h6m0 0L21 21"
              />
            </svg>
          </button>
        </div>

        {/* Detalles del vehículo */}
<div className="text-gray-800 space-y-3 text-sm md:text-base">
  <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
    Toyota RJ45
  </h3>

  <div className="flex justify-between px-4">
    <span className="font-semibold">Descripción:</span>
    <span>Aquí toda la descripción del vehículo.</span>
  </div>

  <div className="flex justify-between px-4">
    <span className="font-semibold">Placa:</span>
    <span>1852PHD</span>
  </div>

  <div className="flex justify-between px-4">
    <span className="font-semibold">Inicio del viaje:</span>
    <span>18/04/2025 a las 10:00 a.m.</span>
  </div>

  <div className="flex justify-between px-4">
    <span className="font-semibold">Fin del viaje:</span>
    <span>21/04/2025 a las 10:00 a.m.</span>
  </div>

  <div className="flex justify-between px-4 text-lg font-semibold text-[#14213D] pt-2 border-t border-gray-200">
    <span>Monto total a pagar:</span>
    <span>500 Bs.</span>
  </div>
</div>

      </div>
    </div>
  );

  const renderFormularioPago = () => (
    <div className="flex-1">
      {modoPago === "tarjeta" ? (
        <PagoTargeta
          nombreTitular={nombreTitular}
          numeroTarjeta={numeroTarjeta}
          mes={mes}
          anio={anio}
          cvv={cvv}
          direccion={direccion}
          correoElectronico={correoElectronico}
          setNombreTitular={setNombreTitular}
          setNumeroTarjeta={setNumeroTarjeta}
          setMes={setMes}
          setAnio={setAnio}
          setCvv={setCvv}
          setDireccion={setDireccion}
          setCorreoElectronico={setCorreoElectronico}
          handleConfirmacion={handleConfirmacion}
          onCancel={() => setModoPago(null)}
        />
      ) : (
        <PagoQR
          loading={loading}
          qrImage={qrImage}
          handleConfirmacionQR={handleConfirmacionQR}
          onCancel={() => setModoPago(null)}
        />
      )}
    </div>
  );

  const renderVistaPago = () => (
    <div className="w-full max-w-[3700px] mx-auto shadow-lg rounded-xl p-6 flex flex-col lg:flex-row gap-[80px] overflow-y-auto">
      {renderDetallesAuto()}
      {renderFormularioPago()}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 py-8 overflow-hidden">
      {!modoPago ? (
        <ModalSeleccionPago
          setModoPago={setModoPago}
          onCancel={() => router.push("/pago")}
        />
      ) : (
        renderVistaPago()
      )}
    </div>
  );
};

export default VistaPago;
