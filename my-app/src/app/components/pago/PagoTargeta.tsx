'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface PagoTarjetaProps {
  nombreTitular: string;
  numeroTarjeta: string;
  mes: string;
  anio: string;
  cvv: string;
  direccion: string;
  correoElectronico: string;
  setNombreTitular: (value: string) => void;
  setNumeroTarjeta: (value: string) => void;
  setMes: (value: string) => void;
  setAnio: (value: string) => void;
  setCvv: (value: string) => void;
  setDireccion: (value: string) => void;
  setCorreoElectronico: (value: string) => void;
  handleConfirmacion: () => void;
}

const PagoTarjeta: FC<PagoTarjetaProps> = ({
  nombreTitular,
  numeroTarjeta,
  mes,
  anio,
  cvv,
  direccion,
  correoElectronico,
  setNombreTitular,
  setNumeroTarjeta,
  setMes,
  setAnio,
  setCvv,
  setDireccion,
  setCorreoElectronico,
  handleConfirmacion,
}) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-white rounded-xl shadow-lg">
  <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
    Pago con Código QR
  </h2>

  <div className="flex justify-center mb-4">
    {loading ? (
      <p className="text-base text-gray-600">Generando código QR...</p>
    ) : qrImage ? (
      <img
        src={qrImage}
        alt="Código QR"
        className="w-52 h-52 md:w-64 md:h-64 border-4 border-gray-800 rounded-lg object-contain"
      />
    ) : (
      <p className="text-red-500 text-base">No se pudo generar el QR.</p>
    )}
  </div>

  <p className="text-center text-sm text-gray-700 mb-4">
    Escanee este código con su aplicación bancaria para realizar el pago.
  </p>

  <div className="flex justify-center gap-6 mb-6">
    <button
      onClick={handleRecargarQR}
      className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition"
      title="Recargar QR"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-800"
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

  <div className="flex flex-col gap-4">
    <button
      onClick={handleConfirmacionQR}
      className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition text-base"
    >
      Verificar Pago
    </button>

    <button
      onClick={() => router.back()}
      className="w-full py-3 bg-gray-100 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition text-base"
    >
      Cancelar
    </button>
  </div>
</div>

  );
};

export default PagoTarjeta;
