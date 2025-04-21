'use client';

import { FC } from 'react';

interface PagoQRProps {
  loading: boolean;
  qrImage: string;
  handleConfirmacionQR: () => void;
  onCancel: () => void;
}

const PagoQR: FC<PagoQRProps> = ({ loading, qrImage, handleConfirmacionQR, onCancel }) => {

  const handleRecargarQR = () => {
    window.location.reload(); 
    // Otra opción sería volver a llamar a la función de generar QR en VistaPago
    // Pero si quieres algo simple ahora, con reload refresca el QR
  };

  const handleDescargarQR = () => {
    if (!qrImage) {
      alert("No hay QR para descargar");
      return;
    }

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'codigo-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 h-full bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
      
      <h2 className="text-center text-[#000000] font-bold text-[clamp(24px,2.5vw,56px)]">
        PAGO CON CÓDIGO QR
      </h2>

      <div className="flex justify-center items-center gap-6 flex-wrap">
        <div>
          {loading ? (
            <p className="text-lg text-gray-700">Generando código QR...</p>
          ) : qrImage ? (
            <img
              src={qrImage}
              alt="Código QR"
              className="w-64 h-64 object-contain border-4 border-black rounded-lg"
            />
          ) : (
            <p className="text-red-500 text-lg">No se pudo generar el QR.</p>
          )}
        </div>
      </div>

      {/* Botones de recargar y descargar */}
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
            <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6c1.31 0 2.5.44 3.45 1.17L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>

        <button
          onClick={handleDescargarQR}
          className="bg-[#FCA311] hover:bg-yellow-600 p-3 rounded-full flex items-center justify-center"
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

      {/* Botones de acción principal */}
      <div className="flex flex-col justify-center gap-13 px-6">
        <button
          onClick={handleConfirmacionQR}
          className="mx-auto w-[70%] py-[clamp(12px,1.2vw,27px)] rounded font-bold text-[#000000] bg-[#FCA311] hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
        >
          VERIFICAR PAGO
        </button>

        <button
          onClick={onCancel}
          className="mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold text-black bg-gray-200 hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
};

export default PagoQR;
