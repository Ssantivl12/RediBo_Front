"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HiOutlineCalendar } from "react-icons/hi";

interface ReservaVehiculoProps {
  id: number | null;
}

export default function ReservaVehiculo({ id }: ReservaVehiculoProps) {
  const router = useRouter();
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [estadoTiempo, setEstadoTiempo] = useState<number>(0);
  const [idReserva, setIdReserva] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://vercel-back-speed-code.vercel.app/vehiculo/obtenerDetalleVehiculo/${id}`)
        .then((response) => {
          if (response.data.success) {
            setVehiculo(response.data.data);
            setIdReserva(response.data.data.reserva.idreserva);
            const fechaFin = new Date(response.data.data.reserva.fecha_fin);
            const tiempoRestante = Math.floor((fechaFin.getTime() - Date.now()) / 1000);
            setEstadoTiempo(tiempoRestante > 0 ? tiempoRestante : 0);
          }
        })
        .catch((error) => {
          console.error("Error al obtener detalles del vehículo:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (idReserva) {
        axios
          .get(`https://vercel-back-speed-code.vercel.app/reservas/obtenerTiempoReserva/${idReserva}`)
          .then((response) => {
            if (response.data.success) {
              setEstadoTiempo(response.data.tiempoRestante);
            }
          })
          .catch((error) => {
            console.error("Error al obtener el tiempo restante:", error);
          });
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [idReserva]);

  const formatoTiempo = (segundos: number) => {
    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const cancelarReserva = async () => {
    if (idReserva) {
      try {
        await axios.post(`https://vercel-back-speed-code.vercel.app/reservas/cancelar/${idReserva}`);
        alert("Reserva cancelada correctamente");
        router.push("/reserva-expirada");
      } catch (error) {
        console.error("Error al cancelar:", error);
        alert("Hubo un error al cancelar la reserva. Intenta nuevamente.");
      }
    }
  };

  if (!vehiculo) {
    return <p className="text-center mt-8">Cargando información del vehículo...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Detalles de tu Reserva</h2>

      <div className="flex flex-col md:flex-row bg-gray-100 rounded-lg p-6 gap-6 items-center">
        <div className="w-full md:w-2/3">
          <h3 className="text-2xl font-semibold text-gray-800">{vehiculo.marca} {vehiculo.modelo}</h3>
          <p className="text-gray-500">Placa: {vehiculo.placa}</p>
          <p className="text-gray-600 mt-2">{vehiculo.descripcion}</p>
          <p className="font-semibold text-xl mt-4">Bs {vehiculo.tarifa} / por día</p>

          <div className="mt-4 border border-gray-300 rounded-md p-3 flex items-center">
            <HiOutlineCalendar className="text-black mr-2" />
            <span className="text-sm">
              {new Date(vehiculo.reserva.fecha_inicio).toLocaleDateString()} - {new Date(vehiculo.reserva.fecha_fin).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="font-bold mb-2 text-black">Detalles del precio</h4>
            <div className="flex justify-between">
              <span>{vehiculo.tarifa} Bs × {vehiculo.reserva.dias} días</span>
              <span>{vehiculo.tarifa * vehiculo.reserva.dias} Bs</span>
            </div>
            <div className="flex justify-between">
              <span>Garantía (reembolsable)</span>
              <span>{vehiculo.garantia} Bs</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>{vehiculo.tarifa * vehiculo.reserva.dias + vehiculo.garantia} Bs</span>
            </div>
          </div>
        </div>

        <img
          src={vehiculo.imagen}
          alt={vehiculo.marca}
          className="w-full md:w-48 h-auto rounded-lg shadow-md object-cover"
        />
      </div>

      <div className="text-center mt-6">
        <p className="font-semibold text-lg">Tiempo Restante</p>
        <p id="countdown" className="text-4xl font-mono text-gray-800">{formatoTiempo(estadoTiempo)}</p>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => router.push(`/pago?id=${id}&monto=${vehiculo.tarifa * vehiculo.reserva.dias + vehiculo.garantia}`)}
          className="bg-[#FCA311] hover:bg-[#e2910f] text-white px-6 py-3 rounded-xl shadow-lg transition duration-200 transform hover:scale-105"
        >
          pagar el 100% ahora
        </button>
        <button
          onClick={cancelarReserva}
          className="bg-[#FCA311] hover:bg-[#e2910f] text-white px-6 py-3 rounded-xl shadow-lg transition duration-200 transform hover:scale-105"
        >
          Cancelar Reserva
        </button>
      </div>
    </div>
  );
}
