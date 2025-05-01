'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import ConfirmationModal from '@components/modal/ModalDeConfirmacion';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    cardName: false,
    cardNumber: false,
    expDate: false,
    cvc: false
  });

  // Campos del formulario
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [dateWarning, setDateWarning] = useState('');

  // Validar formulario
  useEffect(() => {
    if (paymentMethod === 'qr') {
      setIsFormValid(true);
      return;
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const [monthStr, yearStr] = expDate.split('/');
    const month = monthStr ? parseInt(monthStr) : 0;
    const year = yearStr ? parseInt(yearStr) : 0;
    
    const isFormatValid = /^\d{2}\/\d{2}$/.test(expDate);
    const isMonthValid = month >= 1 && month <= 12;
    let isYearValid = true;

    if (yearStr) {
      if (year < 25) {
        setDateWarning('Año no válido (mínimo 25)');
        isYearValid = false;
      } else if (year >= 35) {
        setDateWarning('Año muy lejano');
        isYearValid = true;
      } else {
        setDateWarning('');
      }
    }
    
    const isDateValid = year > currentYear || 
                      (year === currentYear && month >= currentMonth);
    
    const isValid = cardName.trim().length >= 5 &&
                   cardNumber.replace(/\s/g, '').length === 16 &&
                   isFormatValid &&
                   isMonthValid &&
                   isYearValid &&
                   year >= 25 &&
                   cvc.length === 3;
    
    setIsFormValid(isValid);
  }, [cardName, cardNumber, expDate, cvc, paymentMethod]);

  const resetForm = () => {
    setCardName('');
    setCardNumber('');
    setExpDate('');
    setCvc('');
    setDateWarning('');
    setIsFormValid(false);
    setTouchedFields({
      cardName: false,
      cardNumber: false,
      expDate: false,
      cvc: false
    });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').toUpperCase();
    setCardName(value);
    setTouchedFields(prev => ({...prev, cardName: true}));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(value);
    setTouchedFields(prev => ({...prev, cardNumber: true}));
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/[^\d/]/g, '');
    
    if (value.length > 5) value = value.substring(0, 5);
    
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    }
    
    if (value.length >= 1) {
      const monthPart = value.split('/')[0];
      if (monthPart) {
        const monthNum = parseInt(monthPart);
        if (monthNum > 12) {
          value = '12' + (value.length > 2 ? value.substring(2) : '');
        } else if (monthPart.length === 2 && monthNum < 1) {
          value = '01' + (value.length > 2 ? value.substring(2) : '/');
        }
      }
    }
    
    if (value.length > 3) {
      const yearPart = value.split('/')[1];
      if (yearPart) {
        const yearNum = parseInt(yearPart);
        if (yearNum < 25 && yearPart.length === 2) {
          value = value.substring(0, 3) + '25';
        }
      }
    }
    
    setExpDate(value);
    setTouchedFields(prev => ({...prev, expDate: true}));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) return;
    setCvc(value);
    setTouchedFields(prev => ({...prev, cvc: true}));
  };

  const handleProcesarPago = () => {
    if (paymentMethod === 'tarjeta' && !isFormValid) return;
    onClose();
    setShowConfirmModal(true);
  };

  const handleConfirmarPago = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    setIsProcessing(false);
  };

  const handleFinalizarPago = () => {
    resetForm();
    setShowSuccessModal(false);
    onPaymentComplete?.();
  };

  if (!isOpen && !showConfirmModal && !showSuccessModal) {
    return null;
  }

  const isCardNameValid = cardName.trim().length >= 5;
  const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
  const [monthStr, yearStr] = expDate.split('/');
  const month = monthStr ? parseInt(monthStr) : 0;
  const year = yearStr ? parseInt(yearStr) : 0;
  const isExpDateValid = /^\d{2}\/\d{2}$/.test(expDate) && 
                        month >= 1 && 
                        month <= 12 && 
                        year >= 25;
  const isCvcValid = cvc.length === 3;

  const getInputClass = (isValid: boolean, isTouched: boolean) => 
    `w-full p-2 border rounded-lg ${
      isTouched && !isValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full mt-15">
            <div className="bg-gray-100 rounded-lg px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Completar pago</h2>
              <button onClick={handleCancel} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
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
                  className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'tarjeta' ? 'bg-gray-200 border-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setPaymentMethod('tarjeta')}
                >
                  Pago con tarjeta
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'qr' ? 'bg-gray-200 border-gray-300' : 'bg-gray-100 border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => {
                    setPaymentMethod('qr');
                    resetForm();
                  }}
                >
                  Pago con QR
                </button>
              </div>
              
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del titular de la tarjeta
                      </label>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                      type="text"
                      placeholder="NOMBRE COMPLETO"
                      className={getInputClass(isCardNameValid, touchedFields.cardName)}
                      value={cardName}
                      onChange={handleCardNameChange}
                      maxLength={30}
                    />
                    {touchedFields.cardName && !isCardNameValid && (
                      <p className="text-red-500 text-xs mt-1">Mínimo 5 caracteres</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de tarjeta
                      </label>
                      <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                      type="text" 
                      placeholder="1234 1234 1234 1234"
                      className={getInputClass(isCardNumberValid, touchedFields.cardNumber)}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                    {touchedFields.cardNumber && !isCardNumberValid && (
                      <p className="text-red-500 text-xs mt-1">16 dígitos requeridos</p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-[2]">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de vencimiento (MM/AA)
                        </label>
                        <span className="text-red-500 ml-1">*</span>
                      </div>
                      <input
                        type="text" 
                        placeholder="MM/AA"
                        className={getInputClass(isExpDateValid, touchedFields.expDate)}
                        value={expDate}
                        onChange={handleExpDateChange}
                        maxLength={5}
                      />
                      {touchedFields.expDate && !isExpDateValid && (
                        <p className="text-red-500 text-xs mt-1">Formato MM/AA (01-12/25-35)</p>
                      )}
                      {dateWarning && (
                        <p className={`text-xs mt-1 ${
                          dateWarning === 'Año muy lejano' ? 'text-yellow-600' : 'text-red-500'
                        }`}>
                          {dateWarning}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <span className="text-red-500 ml-1">*</span>
                      </div>
                      <input
                        type="text" 
                        placeholder="CVC"
                        className={getInputClass(isCvcValid, touchedFields.cvc)}
                        value={cvc}
                        onChange={handleCvcChange}
                        maxLength={3}
                      />
                      {touchedFields.cvc && !isCvcValid && (
                        <p className="text-red-500 text-xs mt-1">3 dígitos requeridos</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'qr' && (
                <div className="flex flex-col items-center py-4 space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <Image
                      src="/qr.png" 
                      alt="Código QR para pago"
                      width={200}
                      height={200}
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Escanea este código QR con tu app de pagos</p>
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
                  disabled={paymentMethod === 'tarjeta' && !isFormValid}
                  className={`flex-1 px-4 py-2 ${
                    (paymentMethod === 'tarjeta' && !isFormValid)
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
  );
}