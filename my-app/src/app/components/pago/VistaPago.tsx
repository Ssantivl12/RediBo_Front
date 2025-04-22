/*'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ModalSeleccionPago from './ModalSeleccionPago';
import PagoTargeta from './PagoTargeta'; // <-- corregido, no Targeta
import PagoQR from './PagoQR';
import '../../globals.css';

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
        const monto = 100;
        const response = await axios.get(`http://localhost:3000/generarQR/${monto}`);
        if (response.data.mensaje === "QR generado correctamente") {
          setQrImage(`http://localhost:3000/temp/${response.data.archivoQR}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (modoPago === 'qr') {
      generarQR();
    }
  }, [modoPago]);



  const handleDescargarQR = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = 'codigo-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleConfirmacion = async () => {
    const idReserva = 27; // o el valor que tengas dinámicamente
    const concepto = "Pago por reserva de Nissan"; // puedes ajustarlo según necesidad
  
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
    
    
    const fechaExpiracion = `${mes}/${anio}`; // si no lo tenías calculado
  
    const datosPago = {
      monto: 1000, // o el monto real
      concepto: concepto,
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
    } catch (error) {
      console.error("Error:", error);
      const msg =
        error.response?.data?.error || "Hubo un error al realizar el pago.";
      alert("Error: " + msg);
    }
  };

  const handleRecargarQR = () => {
    setQrImage("");
    setModoPago("qr");
  };
  
  const handleDescargarQR = () => {
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage;
      link.download = 'codigo-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const renderContenidoPago = () => {
    return (
      <div className="w-full max-w-[3700px] mx-auto shadow-lg rounded-xl p-6 flex flex-row gap-[80px] lg:flex-row overflow-y-auto">
        
        <div className="flex-1 bg-[#E4D5C1] p-4 rounded-xl space-y-4 overflow-y-auto text-[clamp(16px,1.5vw,60px)]">
          <div className="flex justify-center">
            <img
              src="https://s3-us-west-2.amazonaws.com/my-car-mexico/modelos/fdbcb845/2023-Kia-Sportage-HEV-29_11zon.webp"
              alt="Kia Sportage HEV 2023"
              className="w-[900px] h-[700px] object-cover rounded-lg shadow-lg"
            />
          </div>

          <h1 className="text-[clamp(24px,2.5vw,56px)] font-bold text-center text-[#000000]">
            Kia Sportage HEV 2023
          </h1>

          <div>
            <label className="block font-semibold text-[#000000] text-[clamp(15px,1.4vw,60px)]">
              Placa
            </label>
            <input
              type="text"
              value="1852PHD"
              readOnly
              className="w-full border rounded p-[clamp(8px,1vw,20px)] text-[#000000] text-[clamp(15px,1.4vw,50px)]"
            />
          </div>

          <div>
            <label className="block text-[#000000] font-semibold text-[clamp(15px,1.4vw,60px)]">
              Inicio del viaje
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value="2025-04-18"
                readOnly
                className="flex-1 border text-[#FFFFFF] rounded p-[clamp(8px,1vw,20px)] bg-[#14213D] text-[clamp(15px,1.4vw,50px)]"
              />
              <select className="flex-1 text-[#FFFFFF] border rounded p-[clamp(8px,1vw,20px)] bg-[#14213D] text-[clamp(15px,1.4vw,50px)]">
                <option>10:00 a.m.</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#000000]  text-[clamp(15px,1.4vw,60px)]">
              Fin del viaje
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value="2025-04-21"
                readOnly
                className="flex-1 border text-[#FFFFFF] rounded p-[clamp(8px,1vw,20px)] bg-[#14213D] text-[clamp(15px,1.4vw,50px)]"
              />
              <select className="flex-1 text-[#FFFFFF] border rounded p-[clamp(8px,1vw,20px)] bg-[#14213D] text-[clamp(15px,1.4vw,50px)]">
                <option>10:00 a.m.</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#000000] text-[clamp(15px,1.4vw,60px)]">
              Monto total a pagar (bs)
            </label>
            <input
              type="number"
              value="500"
              readOnly
              className="w-full border text-[#000000] rounded p-[clamp(8px,1vw,20px)] bg-white text-[clamp(15px,1.4vw,50px)]"
            />
          </div>
        </div>
  );
  const renderFormularioPago = () => (
    <div className="flex-1">
      {modoPago === 'tarjeta' ? (
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


        
        {modoPago === "tarjeta" && (
          <div className="flex-1 bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
            <h2 className="text-center font-bold text-[clamp(24px,2.5vw,56px)]">
              TRANSFERENCIA BANCARIA
            </h2>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
                Nombre del titular
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
  Nombre del titular
</label>
<input
  type="text"
  className="w-full border bg-[#FFFFFF] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
  placeholder="Ej. Juan Pérez"
  value={nombreTitular}
  onChange={(e) => {
    let letrasSolo = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    letrasSolo = letrasSolo
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
    setNombreTitular(letrasSolo);
  }}
/>

                Número de tarjeta
              </label>
              <input
                type="text"
                className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)]"
                placeholder="1234 5678 9012 3456"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value)}
              />
            </div>

            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
  Fecha de expiración
</label>
<div className="flex gap-2 w-full">
  <input
    type="number"
    className="w-1/2 border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)] text-center"
    placeholder="MM"
    max={12}
    min={1}
    value={mes}
    onChange={(e) => {
      let val = e.target.value.slice(0, 2);
      if (parseInt(val) > 12) val = "12";
      if (parseInt(val) < 1) val = "01";
      setMes(val);
    }}
  />
  <input
    type="number"
    className="w-1/2 border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)] text-center"
    placeholder="AA"
    value={anio}
    onChange={(e) => {
      let val = e.target.value.slice(0, 2);
      const currentYear = new Date().getFullYear() % 100; // Últimos dos dígitos del año
      const currentMonth = new Date().getMonth() + 1; // Enero es 0

      if (parseInt(val) < currentYear) {
        val = currentYear.toString().padStart(2, '0');
      } else if (parseInt(val) === currentYear && parseInt(mes) < currentMonth) {
        setMes(currentMonth.toString().padStart(2, '0'));
      }

      setAnio(val);
    }}
  />
</div>

                  CVV
                  </label>
<input
  type="number"
  className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)]"
  placeholder="123"
  value={cvv}
  onChange={(e) => {
    const val = e.target.value.slice(0, 3); 
    setCvv(val);
  }}
/>
</div>
</div>

<div>
  <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
                Dirección
</label>
<input
  type="text"
  className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)]"
  placeholder="Ej. Calle Oquendo"
  value={direccion}
  onChange={(e) => {
    const textoLimpio = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
    setDireccion(textoLimpio);
  }}
/>
</div>

<div>
  <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">

                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)]"
                placeholder="Ej. juan.perez@gmail.com"
                value={correoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-center gap-[50px] px-6">
              <button
                onClick={handleConfirmacion}
                className="bg-[#FCA311] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold text-black hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
              >
                CONFIRMAR TRANSFERENCIA
              </button>

              <button
                onClick={() => setModoPago("qr")}
                className="bg-[#14213D] text-[#FFFFFF] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
        
        {modoPago === "qr" && (
          <div className="flex-1 bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
            <h2 className="text-center text-[#000000] font-bold text-[clamp(24px,2.5vw,56px)]">
              PAGO CON CÓDIGO QR
            </h2>

            <div className="flex justify-center items-center gap-6 flex-wrap">
              <div>
                {loading ? (
                  <p className="text-lg text-gray-700">
                    Generando código QR...
                  </p>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt="Código QR"
                    className="w-64 h-64 object-contain border-4 border-black rounded-lg"
                  />
                ) : (
                  <p className="text-red-500 text-lg">
                    No se pudo generar el QR.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
            <button
  onClick={handleRecargarQR}
  className="bg-gray-400 hover:bg-gray-500 p-3 rounded-md flex items-center justify-center"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-black"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6c1.31 0 2.5.44 3.45 1.17L13 11h7V4l-2.35 2.35z"/>
  </svg>
</button>




      <button
        onClick={handleDescargarQR}
        className="bg-[#FCA311] hover:bg-yellow-600 p-3 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </div>

            <div className="flex flex-col justify-center gap-12 px-6">
              <button
                onClick={handleConfirmacionQR}
                className="mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold text-[#000000] bg-[#FCA311] hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
              >
                VERIFICAR PAGO
              </button>

              <button
                onClick={() => setModoPago("")}
                className="mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold text-black bg-gray-200 hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
              >
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
=======
  const renderVistaPago = () => (
    <div className="w-full max-w-[3700px] mx-auto shadow-lg rounded-xl p-6 flex flex-col lg:flex-row gap-[80px] overflow-y-auto">
      {renderDetallesAuto()}
      {renderFormularioPago()}
    </div>
  );
>>>>>>> Stashed changes

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 py-8 overflow-hidden">
      {!modoPago ? (
        <ModalSeleccionPago setModoPago={setModoPago} onCancel={() => router.push('/pago')} />
      ) : (
        renderVistaPago()
      )}
    </div>
  );
};

export default VistaPago;
*/