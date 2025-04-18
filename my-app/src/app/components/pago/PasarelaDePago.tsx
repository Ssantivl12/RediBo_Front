'use client'

import { useState } from 'react'
import { FiCheckCircle, FiX} from 'react-icons/fi'

interface RentaDetails {
  vehiculo: string;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  total: number;
  moneda: string;
  propietario?: string;
}

interface PagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentaDetails: RentaDetails;
  onPaymentComplete: () => void;
}

export default function PasarelaDePago({ 
  isOpen, 
  onClose, 
  rentaDetails, 
  onPaymentComplete 
}: PagoModalProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('tarjeta') // 'tarjeta' o 'qr'
  
  // Campos del formulario
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expDate, setExpDate] = useState('')
  const [cvc, setCvc] = useState('')

  const handleProcesarPago = () => {
    onClose(); // Cierra el modal principal
    setShowConfirmModal(true);
  }

  const handleConfirmarPago = async () => {
    setIsProcessing(true)
    // Simulación de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000)) 
    setShowConfirmModal(false)
    setShowSuccessModal(true)
    setIsProcessing(false)
    
    // todo: registrar el pago en la base de datos
    // enviarNotificacionAlRentador(rentaDetails)
  }

  const handleFinalizarPago = () => {
    setShowSuccessModal(false);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
    // todo: falta redireccionar a otra pagina
    // todo: componentizar el modal de confirmacion
  }

  if (!isOpen && !showConfirmModal && !showSuccessModal) {
    return null;
  }

  return (
    <>
      {/* Modal de Pago */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg  max-w-md w-full mt-15">
            <div className="bg-gray-100 rounded-lg px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Completar pago
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Cerrar modal"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700">Estás pagando el XXX% de la renta.</p>
              
              {/* Resumen del pago */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">Resumen del pago</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Vehículo:</span>
                    <span className="font-medium">{rentaDetails.vehiculo}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Fechas:</span>
                    <span className="font-medium">{rentaDetails.fechaInicio}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Duración:</span>
                    <span className="font-medium">{rentaDetails.dias} días</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Total a pagar ahora:</span>
                    <span className="font-bold">${rentaDetails.total}</span>
                  </div>
                </div>
              </div>
              
              {/* Métodos de pago */}
              <div className="flex gap-2 mb-3">
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'tarjeta' 
                    ? 'bg-gray-200 border-gray-300' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('tarjeta')}
                >
                  Pago con tarjeta
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'qr' 
                    ? 'bg-gray-200 border-gray-300' 
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('qr')}
                >
                  Pago con QR
                </button>
              </div>
              
              {paymentMethod === 'tarjeta' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de tarjeta
                    </label>
                    <input
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de expiración
                      </label>
                      <input
                        type="text" 
                        placeholder="MM/AA"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text" 
                        placeholder="123"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <div className="bg-gray-200 p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                    <span className="text-gray-600">Código QR para pago</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProcesarPago}
                  className="flex-1 px-4 py-2 bg-[#FFA500] hover:bg-[#e69500] text-white rounded-md font-medium"
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
            <div className="bg-[#EFE2D2] px-6 py-4">
              <h2 className="text-xl font-bold text-black text-center">
                ¿Está seguro que desea pagar?
              </h2>
            </div>
            <div className="p-6 space-y-4 text-center">
              <p className="text-black">
                Una vez confirmada, esta acción no se puede deshacer. ¿Desea confirmar el pago de ${rentaDetails.total} por la renta del vehículo?
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 bg-[#0B1F40] hover:bg-[#0a1a33] text-white rounded-lg font-medium"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleConfirmarPago}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-[#FFA500] hover:bg-[#e69500] text-black rounded-lg font-medium disabled:bg-yellow-300"
                >
                  {isProcessing ? 'Procesando...' : 'ACEPTAR'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8 relative">
            <div className="bg-[#EFE2D2] px-6 py-4">
              <h2 className="text-xl font-bold text-black text-center">Pago realizado con éxito</h2>
            </div>
            <button 
              onClick={handleFinalizarPago}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar modal"
            >
              <FiX className="text-gray-500 text-lg" />
            </button>

            <div className="p-6 space-y-4 text-center">
              <div className="flex justify-center text-[#FFA500]">
                <FiCheckCircle className="text-5xl" />
              </div>
              <p className="text-black">Su pago ha sido procesado correctamente. El anfitrión será notificado.</p>
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleFinalizarPago}
                  className="px-6 py-2 bg-[#FFA500] hover:bg-[#e69500] text-black rounded-md font-medium"
                >
                  ACEPTAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}