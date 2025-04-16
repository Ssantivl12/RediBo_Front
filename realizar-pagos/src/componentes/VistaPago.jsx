import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VistaPago = () => {
  const navigate = useNavigate();
  const [modoPago, setModoPago] = useState(null);
  const [loading, setLoading] = useState(false); // asegúrate de declarar esto
  const [qrImage, setQrImage] = useState(""); // y esto también

  const [nombreTitular, setNombreTitular] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const fechaExpiracion = `${mes.padStart(2, "0")}/${anio.padStart(2, "0")}`;

  // 👇 Este useEffect debe estar aquí, no dentro de handleConfirmacion
  useEffect(() => {
    const generarQR = async () => {
      setLoading(true);
      try {
        const monto = 100;
        const referencia = "gggggg";

        const response = await axios.get(
          `http://localhost:3000/generarQR/${monto}/${referencia}`
        );
        console.log("Respuesta completa del QR:", response.data);
        if (response.data.mensaje === "QR generado correctamente") {
          setQrImage(`http://localhost:3000/temp/${response.data.archivoQR}`);
          //ese datarachivoQR almacenar en un const o variable para luego usar en otra variable en handleConfirmacionQR
        }
      } catch (error) {
        console.error("Error generando el QR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (modoPago === "qr") {
      generarQR();
    }
  }, [modoPago]);
  const handleConfirmacionQR = async () => {
    const rentalId = 123; // Asignar el rentalId correctamente
    const monto = 1000; 
    const referencia = "REF123410"; 
    const correoElectronico = "samuelmoya786@gmail.com"; 
    
    // Usar el nombre real del archivo QR generado
    const nombreArchivoQR = qrImage.split('/').pop(); // Extraer el nombre del archivo QR de la URL

    if (!correoElectronico) {
      alert("Por favor ingresa un correo electrónico.");
      return;
    }

    const datosPagoQR = {
      nombreArchivoQR,  // Usamos el nombre del archivo QR generado
      monto,
      rentalId, 
      referencia,
      correo: correoElectronico
    };

    console.log("Datos a enviar:", datosPagoQR);  // Verificar los datos antes de enviarlos

    try {
      // Realizamos la solicitud POST al backend, enviando los datos en el cuerpo (body)
      const response = await axios.post(
        "http://localhost:3000/pagos/pagarConQR", // API que recibe la solicitud
        datosPagoQR // El body de la solicitud
      );

      // Verificamos si la respuesta es exitosa
      if (response.status === 200) {
        alert("¡Pago QR confirmado con éxito!");
        navigate("/confirmacion"); // Redirigir a la vista de confirmación
      } else {
        alert(
          "Error en el pago QR: " + (response.data?.mensaje || "Error desconocido")
        );
      }
    } catch (error) {
      // Si hay un error, mostramos el mensaje de error
      console.error("Error:", error);
      const msg =
        error.response?.data?.error || "Hubo un error al realizar el pago QR.";
      alert("Error: " + msg);
    }
  };

  const handleConfirmacion = async () => {
    const clienteId = 1;
    const monto = 1000;
    const codigo = "UUAACCaa";

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

    const datosPago = {
      nombreTitular,
      numeroTarjeta,
      fechaExpiracion,
      cvv,
      direccion,
      correoElectronico,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/pagos/pagarConTarjeta/${clienteId}/${monto}/${codigo}`,
        datosPago
      );

      if (response.status === 200) {
        alert("¡Pago confirmado con éxito!");
        navigate("/confirmacion");
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

  const renderContenidoPago = () => {
    return (
      <div className="w-full max-w-[3700px] mx-auto shadow-lg rounded-xl p-6 flex flex-row gap-[80px] lg:flex-row overflow-y-auto">
        {/* Contenedor de la imagen y detalles del vehículo */}
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
              className="w-full border rounded p-[clamp(8px,1vw,20px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,50px)]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
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
            <label className="block font-semibold  text-[clamp(15px,1.4vw,60px)]">
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
            <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
              Monto total a pagar (bs)
            </label>
            <input
              type="number"
              value="500"
              readOnly
              className="w-full border rounded p-[clamp(8px,1vw,20px)] bg-white text-[clamp(15px,1.4vw,50px)]"
            />
          </div>
        </div>

        {/* Contenedor de transferencia bancaria */}
        {modoPago === "tarjeta" && (
          <div className="flex-1 bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
            <h2 className="text-center font-bold text-[clamp(24px,2.5vw,56px)]">
              TRANSFERENCIA BANCARIA
            </h2>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
                Nombre del titular
              </label>
              <input
                type="text"
                className="w-full border bg-[#FFFFFF] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
                placeholder="Ej. Juan Pérez"
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
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

            {/* Fecha y CVV */}
            <div className="flex gap-4">
              <div className="flex-1">
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
                      setAnio(val);
                    }}
                  />
                </div>
              </div>

              <div className="w-1/3">
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
                  CVV
                </label>
                <input
                  type="number"
                  className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,60px)]"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
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
                onChange={(e) => setDireccion(e.target.value)}
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
        {/* Contenedor de pago por QR */}
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

            <p className="text-center font-medium">
              Escanea este código QR con tu app bancaria o billetera móvil para
              realizar el pago del alquiler.
            </p>

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

  return (
    <div className="relative min-h-screen bg-gray-50 px-4 py-8 overflow-hidden">
      {/* Modal de selección de método de pago */}
      {!modoPago && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-[#E4D5C1] rounded-xl shadow-lg w-full max-w-[1500px] h-[900px] overflow-y-auto p-6 space-y-8">
            <h2 className="text-[clamp(16px,2vw,65px)] font-bold text-center text-[#000000]">
              SELECCIONE EL MÉTODO DE PAGO
            </h2>

            <div className="flex flex-col justify-center gap-[70px] px-6">
              <button
                onClick={() => setModoPago("tarjeta")}
                className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] rounded bg-[#FCA311] font-bold hover:bg-yellow-400 text-[clamp(16px,2vw,45px)] text-[#000000]"
              >
                PAGAR CON TARJETA
              </button>

              <button
                onClick={() => setModoPago("qr")}
                className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] rounded bg-[#14213D] font-bold text-[#FFFFFF] hover:bg-blue-700 text-[clamp(16px,2vw,45px)]"
              >
                PAGAR CON QR
              </button>

              <button
                onClick={() => navigate("/")}
                className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] bg-[#14213D] rounded bg-[#f2e8d8] font-bold text-black hover:bg-red-600 text-[clamp(16px,2vw,45px)]"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar contenido de pago si hay método seleccionado */}
      {modoPago && renderContenidoPago()}
    </div>
  );
};

export default VistaPago;
