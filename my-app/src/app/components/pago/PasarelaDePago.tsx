'use client'

import { useState } from 'react'
import { FiCheckCircle, FiX } from 'react-icons/fi'
import ConfirmationModal from '@components/modal/ModalDeConfirmacion'

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
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')

  // Campos del formulario
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expDate, setExpDate] = useState('')
  const [cvc, setCvc] = useState('')

  // Estado para mostrar errores
  const [showErrors, setShowErrors] = useState(false)

  // Función para resetear el formulario
  const resetForm = () => {
    setCardName('')
    setCardNumber('')
    setExpDate('')
    setCvc('')
    setShowErrors(false)
  }

  // Handler para cancelar
  const handleCancel = () => {
    resetForm()
    onClose()
  }

  // Handlers para cada campo
  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').toUpperCase()
    setCardName(value)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.substring(0, 16)
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(value)
  }

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.substring(0, 4)
    if (value.length > 2) {
      value = `${value.substring(0, 2)} / ${value.substring(2)}`
    }
    setExpDate(value)
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length > 3) return
    setCvc(value)
  }

  const validateForm = () => {
    const isValid = cardName.trim() !== '' && 
                   cardNumber.replace(/\s/g, '').length === 16 &&
                   /^\d{2}\/\d{2}$/.test(expDate) &&
                   cvc.length === 3
    
    setShowErrors(!isValid)
    return isValid
  }

  const handleProcesarPago = () => {
    if (!validateForm()) return
    onClose()
    setShowConfirmModal(true)
  }

  const handleConfirmarPago = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowConfirmModal(false)
    setShowSuccessModal(true)
    setIsProcessing(false)
  }

  const handleFinalizarPago = () => {
    resetForm() // Limpiar formulario al finalizar
    setShowSuccessModal(false)
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  if (!isOpen && !showConfirmModal && !showSuccessModal) {
    return null
  }

  const isFormValid = cardName.trim() !== '' && 
                     cardNumber.replace(/\s/g, '').length === 16 &&
                     /^\d{2}\/\d{2}$/.test(expDate) &&
                     cvc.length === 3

  return (
    <>
      {/* Modal de Pago */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full mt-15">
            <div className="bg-gray-100 rounded-lg px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Completar pago
              </h2>
              <button 
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Cerrar modal"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700">Estás pagando el {rentaDetails.total === rentaDetails.total * 2 ? '100%' : '50%'} de la renta.</p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-2">Resumen del pago</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Vehículo:</span>
                    <span className="font-medium">{rentaDetails.vehiculo}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Fechas:</span>
                    <span className="font-medium">{rentaDetails.fechaInicio} - {rentaDetails.fechaFin}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Duración:</span>
                    <span className="font-medium">{rentaDetails.dias} día(s)</span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Total a pagar ahora:</span>
                    <span className="font-bold">${rentaDetails.total} {rentaDetails.moneda}</span>
                  </div>
                </div>
              </div>
              
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
              
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del titular de la tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={cardName}
                      onChange={handleCardNameChange}
                      maxLength={30}
                    />
                    {showErrors && cardName.trim() === '' && (
                      <span className="text-black text-xs mt-1 block">* Campo obligatorio</span>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Información de la tarjeta
                    </label>
                    <input
                      type="text" 
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                    {showErrors && cardNumber.replace(/\s/g, '').length !== 16 && (
                      <span className="text-black text-xs mt-1 block">* Campo obligatorio</span>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de expiración
                      </label>
                      <input
                        type="text" 
                        placeholder="MM / AA"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={expDate}
                        onChange={handleExpDateChange}
                      />
                      {showErrors && !/^\d{2}\/\d{2}$/.test(expDate) && (
                        <span className="text-black text-xs mt-1 block">* Campo obligatorio</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text" 
                        placeholder="CVC"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={cvc}
                        onChange={handleCvcChange}
                        maxLength={3}
                      />
                      {showErrors && cvc.length !== 3 && (
                        <span className="text-black text-xs mt-1 block">* Campo obligatorio</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'qr' && (
                <div className="flex justify-center py-8">
                  <div className="bg-gray-200 p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                    <span className="text-gray-600">Código QR para pago</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProcesarPago}
                  disabled={!isFormValid}
                  className={`flex-1 px-4 py-2 ${
                    !isFormValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#FFA500] hover:bg-[#e69500]'
                  } text-white rounded-md font-medium`}
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmarPago}
        title="¿Está seguro que desea pagar?"
        message={`Una vez confirmada, esta acción no se puede deshacer. ¿Desea confirmar el pago de $${rentaDetails.total} ${rentaDetails.moneda} por la renta del vehículo?`}
        confirmText="ACEPTAR"
        cancelText="CANCELAR"
        isProcessing={isProcessing}
        variant="confirmation"
        showSuccess={false}
      />

      {/* Modal de Éxito */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        onClose={handleFinalizarPago}
        onConfirm={handleFinalizarPago}
        title="Pago realizado con éxito"
        message="Su pago ha sido procesado correctamente. El anfitrión será notificado."
        confirmText="ACEPTAR"
        variant="success"
        showSuccess={true}
        successIcon={<FiCheckCircle className="text-5xl text-[#FFA500]" />}
      />
    </>
  )
}