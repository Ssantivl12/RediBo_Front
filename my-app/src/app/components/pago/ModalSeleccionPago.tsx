'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal'; // Asegúrate de tener este import

interface ModalSeleccionPagoProps {
  setModoPago: (modo: string) => void;
  onCancel: () => void;
  pagadoRenta: boolean;
  pagadoGarantia: boolean;
  setPagarRenta: (value: boolean) => void;
  setPagarGarantia: (value: boolean) => void;
}

const ModalSeleccionPago: FC<ModalSeleccionPagoProps> = ({
  setModoPago,
  onCancel,
  pagadoRenta,
  pagadoGarantia,
  setPagarRenta,
  setPagarGarantia,
}) => {
  const router = useRouter();

  const [seleccionRenta, setSeleccionRenta] = useState(false);
  const [seleccionGarantia, setSeleccionGarantia] = useState(false);

  const [mostrarModalAdvertencia, setMostrarModalAdvertencia] = useState(false);
  const [mensajeAdvertencia, setMensajeAdvertencia] = useState("");

  // ✅ Esta función DEBE estar dentro del componente
  const continuarConMetodoPago = (modo: string) => {
    if (pagadoRenta && pagadoGarantia) {
      setMensajeAdvertencia("Ya realizaste los dos pagos.");
      setMostrarModalAdvertencia(true);
      return;
    }

    if (!seleccionRenta && !seleccionGarantia) {
      setMensajeAdvertencia("Tienes que seleccionar qué pago deseas realizar.");
      setMostrarModalAdvertencia(true);
      return;
    }

    setModoPago(modo); // permite avanzar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-6">
        {/* Texto explicativo */}
        <p className="text-xl font-bold text-gray-800 text-center mb-2">
          Seleccione que pago desea realizar
        </p>

        {/* Checkboxes */}
        <div className="flex justify-center gap-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={seleccionRenta}
              onChange={(e) => {
                setSeleccionRenta(e.target.checked);
                setPagarRenta(e.target.checked); // comunica al padre
              }}
              className="accent-[#FFA500]"
              disabled={pagadoRenta}
            />
            <span className="text-gray-800 text-sm">Pagar renta</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={seleccionGarantia}
              onChange={(e) => {
                setSeleccionGarantia(e.target.checked);
                setPagarGarantia(e.target.checked); // comunica al padre
              }}
              className="accent-[#FFA500]"
              disabled={pagadoGarantia}
            />
            <span className="text-gray-800 text-sm">Pagar garantía</span>
          </label>
        </div>

        {/* Título principal */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
          Seleccione el método de pago
        </h2>

        {/* Botones de método de pago */}
        <div className="space-y-4">
          <button
            onClick={() => continuarConMetodoPago('tarjeta')}
            className="w-full py-2 px-4 rounded-md bg-[#FFA500] hover:bg-[#e38d00] text-white font-semibold transition-colors"
          >
            Pagar con tarjeta
          </button>

          <button
            onClick={() => continuarConMetodoPago('qr')}
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

      {/* Modal de advertencia */}
      {mostrarModalAdvertencia && (
        <Modal
          mensaje={mensajeAdvertencia}
          onConfirmar={() => setMostrarModalAdvertencia(false)}
          onCancelar={() => setMostrarModalAdvertencia(false)}
        />
      )}
    </div>
  );
};

export default ModalSeleccionPago;
