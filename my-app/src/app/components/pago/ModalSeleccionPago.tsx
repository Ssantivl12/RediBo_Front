'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface ModalSeleccionPagoProps {
  setModoPago: (modo: string) => void;
  onCancel: () => void;
}

const ModalSeleccionPago: FC<ModalSeleccionPagoProps> = ({ setModoPago }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Seleccione el método de pago
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => setModoPago('tarjeta')}
            className="w-full py-2 px-4 rounded-md bg-[#FFA500] hover:bg-[#e38d00] text-white font-semibold transition-colors"
          >
            Pagar con tarjeta
          </button>

          <button
            onClick={() => setModoPago('qr')}
            className="w-full py-2 px-4 rounded-md bg-blue-900 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Pagar con QR
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-2 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionPago;
