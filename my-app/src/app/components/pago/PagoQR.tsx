'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface PagoQRProps {
  loading: boolean;
  qrImage: string;
  handleConfirmacionQR: () => void;
}

const PagoQR: FC<PagoQRProps> = ({ loading, qrImage, handleConfirmacionQR }) => {
  const router = useRouter();

  const handleRecargarQR = () => {
    window.location.reload();
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
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg">
  <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
    Pago con Código QR
  </h2>

  <div className="space-y-4">
    {/* Imagen del QR */}
    <div className="relative flex justify-center">
      {loading ? (
        <p className="text-lg text-gray-600">Generando código QR...</p>
      ) : qrImage ? (
        <img
          src={qrImage}
          alt="Código QR"
          className="w-[250px] h-[250px] object-contain rounded-lg shadow-lg border border-gray-300"
        />
      ) : (
        <p className="text-red-500 text-lg">No se pudo generar el QR.</p>
      )}
    </div>

    {/* Texto de escaneo */}
    <p className="text-center text-gray-700 text-sm md:text-base">
      Escanee el código QR para realizar el pago .
    </p>

    {/* Botones de recargar y descargar */}
    <div className="flex justify-center gap-4">
      <button
        onClick={handleRecargarQR}
        className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
        title="Recargar QR"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6c1.31 0 2.5.44 3.45 1.17L13 11h7V4l-2.35 2.35z" />
        </svg>
      </button>

      <button
        onClick={handleDescargarQR}
        className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-full transition"
        title="Descargar QR"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
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

    {/* Botones de acción */}
    <div className="flex flex-col gap-4 pt-2">
      <button
        onClick={handleConfirmacionQR}
        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition text-sm md:text-base"
      >
        Verificar Pago
      </button>

      <button
        onClick={() => router.back()}
        className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition text-sm md:text-base"
      >
        Cancelar
      </button>
    </div>
  </div>
</div>

  );
};

export default PagoQR;
