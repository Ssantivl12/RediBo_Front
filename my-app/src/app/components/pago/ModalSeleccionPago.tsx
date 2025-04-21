'use client';

import { FC } from 'react';

interface ModalSeleccionPagoProps {
  setModoPago: (modo: string) => void;
  onCancel: () => void;
}

const ModalSeleccionPago: FC<ModalSeleccionPagoProps> = ({ setModoPago, onCancel }) => {
  return (
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
  onClick={onCancel}
  className="mx-auto w-[70%] py-[clamp(12px,2vw,45px)] rounded bg-[#f2e8d8] font-bold text-black hover:bg-red-600 text-[clamp(16px,2vw,45px)]"
>
  CANCELAR
</button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionPago;
