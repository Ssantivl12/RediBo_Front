"use client";

import React from "react";

interface CancelarMantenimientoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmCancel: () => void;
}

const CancelarMantenimientoModal: React.FC<CancelarMantenimientoModalProps> = ({ 
    isOpen, 
    onClose,
    onConfirmCancel
}) => {
    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="bg-[var(--hueso)] w-full p-4 rounded-t-xl">
                    <h2 className="text-xl font-semibold text-center text-[var(--azul-oscuro)]">
                        ¿Estás seguro que deseas cancelar el mantenimiento del vehículo?
                    </h2>
                </div>

                <div className="p-6">
                    <div className="text-center mb-4">
                        <svg className="mx-auto h-12 w-12 text-[var(--rojo)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <p className="mb-6 text-center text-gray-600 text-sm">
                        Los datos ingresados serán eliminados.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={onClose} 
                            className="flex-1 bg-[var(--azul-oscuro)] hover:bg-[#0a1f42] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onConfirmCancel} 
                            className="flex-1 bg-[var(--naranja)] hover:bg-[#e69500] text-white py-2.5 px-4 rounded-md font-medium transition-colors"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default CancelarMantenimientoModal;