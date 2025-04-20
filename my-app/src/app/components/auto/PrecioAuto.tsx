import { HiOutlineCalendar } from "react-icons/hi";
import { useState } from "react";

import PasarelaDePago from "../pago/PasarelaDePago";

interface PrecioAutoProps {
  precio: number;
  vehiculo: string;
  propietario: string;
  reserva: {
    fechaInicio: string;
    fechaFin: string;
    dias: number;
  };
  costes: {
    precio: number;
    dias: number;
    tarifa: number;
    garantia: number;
    total: number;
  };
}

export default function PrecioAuto({
  precio,
  vehiculo,
  propietario,
  reserva,
  costes,
}: PrecioAutoProps) {
  const [isPagoModalOpen, setIsPagoModalOpen] = useState(false);
  const handlePaymentComplete = () => {
    console.log("Pago completado con éxito");
    // modificar con la redirección a la página de inicio u otro
  };
  const rentaDetails = {
    vehiculo: vehiculo,
    fechaInicio: reserva.fechaInicio,
    fechaFin: reserva.fechaFin,
    dias: reserva.dias,
    total: costes.total,
    moneda: "Bs",
    propietario: propietario,
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
      <div className="flex items-center mb-4 text-left">
        <div className="text-2xl font-bold text-blue-900">${precio}</div>
        <div className="text-sm text-gray-600 ml-1">/por día</div>
      </div>

      <div className="mb-6">
        <div className="border border-gray-300 rounded-md p-3 flex items-center">
          <HiOutlineCalendar className="text-black mr-2" />
          <span className="text-sm">
            {reserva.fechaInicio} - {reserva.fechaFin}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-bold mb-4 text-black">Detalles del precio</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              ${costes.precio} × {costes.dias} días
            </span>
            <span>${costes.precio * costes.dias}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa de servicio</span>
            <span>${costes.tarifa}</span>
          </div>
          <div className="flex justify-between">
            <span>Garantía (reembolsable)</span>
            <span>${costes.garantia}</span>
          </div>
          <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${costes.total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setIsPagoModalOpen(true)}
          className="w-full bg-naranja hover:bg-black text-white py-3 rounded-md font-medium transition"
        >
          Pagar el 100% ahora
        </button>
        <button
          onClick={() => setIsPagoModalOpen(true)}
          className="w-full border border-gray-300 bg-azul-oscuro py-3 rounded-md font-medium flex items-center justify-center transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
          </svg>
          Pagar 50% ahora
        </button>
      </div>
      <PasarelaDePago
        isOpen={isPagoModalOpen}
        onClose={() => setIsPagoModalOpen(false)}
        rentaDetails={rentaDetails}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
