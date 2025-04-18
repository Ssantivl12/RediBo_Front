'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import '../../globals.css'

export default function ReservaExpirada() {
  const router = useRouter()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/dist/cancelacion.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="container text-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tiempo Para Reserva Expirada</h1>

      <div className="text-6xl">😢</div>

      <p className="text-gray-700">
        El tiempo límite para pagar ha sido superado.<br />
        Puedes intentar reservar nuevamente
      </p>

      <button
        id="buscarBtn"
        onClick={() => router.push('/home')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar Otro
      </button>

      <div id="modal" className="modal hidden">
        <div className="modal-content">
          <p>¿Seguro quieres volver?</p>
          <div className="modal-buttons flex justify-center gap-4 mt-4">
            <button id="confirmYes" onClick={() => router.push('/home')} className="bg-green-500 text-white px-3 py-1 rounded">Sí</button>
            <button id="confirmNo" className="bg-red-500 text-white px-3 py-1 rounded">No</button>
          </div>
        </div>
      </div>
    </div>
  )
}
