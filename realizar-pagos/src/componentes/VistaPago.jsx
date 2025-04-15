// src/componentes/VistaPago.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VistaPago = () => {
  const navigate = useNavigate();
  const [modoPago, setModoPago] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const [formData, setFormData] = useState({
    nombreTitular: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    direccion: '',
    correoElectronico: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleConfirmacion = () => {
    alert('¡Pago confirmado con éxito!');
    navigate('/confirmacion');
  };

  const isValidCard = (numeroTarjeta) => {
    return numeroTarjeta.length === 16 && /^[0-9]+$/.test(numeroTarjeta);
  };
  
  const isValidExpDate = (fechaExpiracion) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(fechaExpiracion);
  };
  
  const isValidCVV = (cvv) => {
    return cvv.length === 3 && /^[0-9]+$/.test(cvv);
  };
  
  const realizarPago = async () => {
    const { nombreTitular, numeroTarjeta, fechaExpiracion, cvv, direccion, correoElectronico } = formData;
    const rentalId = 123;
    const monto = 1000;
    const referencia = 'ABCD12349';
  
    // Validación simple antes de realizar la solicitud
    if (!nombreTitular || !numeroTarjeta || !fechaExpiracion || !cvv || !direccion || !correoElectronico) {
      setError('Por favor complete todos los campos.');
      return;
    }

    // Validación de tarjeta
    if (!isValidCard(numeroTarjeta)) {
      setError('Número de tarjeta inválido.');
      return;
    }
  
    // Validación de fecha de expiración
    if (!isValidExpDate(fechaExpiracion)) {
      setError('Fecha de expiración inválida.');
      return;
    }

    // Validación de CVV
    if (!isValidCVV(cvv)) {
      setError('CVV inválido.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/pagos/pagarConTarjeta/${rentalId}/${monto}/${referencia}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreTitular,
          numeroTarjeta,
          fechaExpiracion,
          cvv,
          direccion,
          correoElectronico,
        }),
      });
  
      if (response.ok) {
        alert('¡Pago realizado con éxito!');
        navigate('/confirmacion');
      } else {
        setError('Hubo un error al procesar el pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Hubo un error al realizar la solicitud.');
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
            <label className="block font-semibold text-[#000000] text-[clamp(15px,1.4vw,60px)]">Placa</label>
            <input
              type="text"
              value="1852PHD"
              readOnly
              className="w-full border rounded p-[clamp(8px,1vw,20px)] bg-[#FFFFFF] text-[clamp(15px,1.4vw,50px)]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Inicio del viaje</label>
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
            <label className="block font-semibold  text-[clamp(15px,1.4vw,60px)]">Fin del viaje</label>
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
            <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Monto total a pagar (bs)</label>
            <input
              type="number"
              value="500"
              readOnly
              className="w-full border rounded p-[clamp(8px,1vw,20px)] bg-white text-[clamp(15px,1.4vw,50px)]"
            />
          </div>
        </div>

        {/* Contenedor de pago con tarjeta */}
        {modoPago === 'tarjeta' && (
          <div className="flex-1 bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
            <h2 className="text-center font-bold text-[clamp(24px,2.5vw,56px)]">PAGO CON TARJETA</h2>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Nombre del titular</label>
              <input
                type="text"
                name="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleInputChange}
                className="w-full border bg-[#FFFFFF ] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Numero de tarjeta</label>
              <input
                type="text"
                name="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={handleInputChange}
                className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF ] text-[clamp(15px,1.4vw,60px)]"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Fecha de expiración</label>
                <input
                  type="text"
                  name="fechaExpiracion"
                  value={formData.fechaExpiracion}
                  onChange={handleInputChange}
                  className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF ] text-[clamp(15px,1.4vw,60px)]"
                  placeholder="MM/AA"
                />
              </div>
              <div className="w-1/3">
                <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF ] text-[clamp(15px,1.4vw,60px)]"
                  placeholder="123"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF ] text-[clamp(15px,1.4vw,60px)]"
                placeholder="Ej. Calle oquendo"
              />
            </div>

            <div>
              <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">Correo electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleInputChange}
                className="w-full border rounded p-[clamp(8px,1vw,25px)] bg-[#FFFFFF ] text-[clamp(15px,1.4vw,60px)]"
                placeholder="Ej. juan.perez@gmail.com"
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}

            <div className="flex flex-col justify-center gap-[50px] px-6">
              <button
                onClick={realizarPago}
                className="bg-[#FCA311] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded bg-gray-200 font-bold text-black hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
              >
                CONFIRMAR PAGO CON TARJETA
              </button>

              <button
                onClick={() => setModoPago('qr')}
                className="bg-[#14213D] text-[#FFFFFF] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded bg-gray-200 font-bold text-black hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
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
                onClick={() => setModoPago('tarjeta')}
                className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] rounded bg-[#FCA311] font-bold hover:bg-yellow-400 text-[clamp(16px,2vw,45px)] text-[#000000]"
              >
                PAGAR CON TARJETA
              </button>

              <button
                onClick={() => setModoPago('qr')}
                className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] rounded bg-[#14213D] font-bold text-[#FFFFFF] hover:bg-blue-700 text-[clamp(16px,2vw,45px)]"
              >
                PAGAR CON QR
              </button>

              <button
                onClick={() => navigate('/')}
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
