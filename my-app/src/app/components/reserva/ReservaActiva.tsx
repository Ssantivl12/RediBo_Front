'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import '../../globals.css'

export default function ReservaActiva() {
  const router = useRouter()

  const ID_RESERVA = '5' // Reemplaza con el ID real de la reserva

  const TIEMPO_INICIAL = 3 * 60 * 60
  const [estadoTiempo, setEstadoTiempo] = useState<number>(TIEMPO_INICIAL)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setEstadoTiempo((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo)
          cancelarReserva(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  const formatoTiempo = (segundos: number) => {
    const hrs = Math.floor(segundos / 3600)
    const mins = Math.floor((segundos % 3600) / 60)
    const secs = segundos % 60
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

<<<<<<< Updated upstream
  const cancelarReserva = async (porTiempo = false) => {   
      router.push('/reserva-expirada')
    
  }

  const confirmarPago = async () => {
      router.push('/pago')
=======
  const cancelarReserva = async (porTiempo = false) => {
      router.push('/reserva-expirada')
  }

  const confirmarPago = async () => {
    router.push('/pago')
>>>>>>> Stashed changes
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Reserva</h2>
      <p className="text-gray-600">Información de la reserva. Detalles aquí.</p>

      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">LAMBORGHINI HUARACAN EVO</p>
          <p>fecha_inicio: 15/04/16 Hora: 10:00</p>
          <p className="font-bold">Self Pickup</p>
          <p className="font-bold text-xl">Bs 100.00</p>
          <p>Lugar Recogida: 1 día 0 hrs</p>
        </div>
        <img src="/auto.png" alt="Lamborghini" className="w-32 h-auto rounded" />
      </div>

      <div className="text-center">
        <p className="font-semibold">TIEMPO RESTANTE</p>
        <p id="countdown" className="text-3xl font-mono">{formatoTiempo(estadoTiempo)}</p>
      </div>

      <div className="flex justify-around space-x-2">
        <button onClick={confirmarPago} className="bg-[#FCA311] hover:bg-[#e2910f] text-white px-4 py-2 rounded">
          Confirmar Pago
        </button>
        <button onClick={() => cancelarReserva(false)} className="bg-[#FCA311] hover:bg-[#e2910f] text-white px-4 py-2 rounded">
          Cancelar Reserva
        </button>
      </div>
    </div>
  )
}
