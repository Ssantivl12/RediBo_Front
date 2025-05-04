'use client';

import React from 'react';

interface SelectorHoraAlquilerProps {
    pickupTime: string;
    dropoffTime: string;
    setPickupTime: (time: string) => void;
    setDropoffTime: (time: string) => void;
}

const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
        const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        opciones.push(hora);
    }
    }
return opciones;
};

const SelectorHoraAlquiler: React.FC<SelectorHoraAlquilerProps> = ({
    pickupTime,
    dropoffTime,
    setPickupTime,
    setDropoffTime,
}) => {
    const opcionesHora = generarOpcionesHora();

return (
    <div className="border-2 border-gray-300 rounded-xl p-4 mt-4">
        <h3 className="text-lg font-semibold text-[#002a5c] mb-3">Hora de Alquiler</h3>

        <div className="flex flex-col gap-4">
            <div>
                <label className="block mb-1 text-sm text-[#002a5c] font-medium">Hora de recogida:</label>
                <div className="relative">
                    <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                {opcionesHora.map((hora) => (
                    <option key={hora} value={hora}>
                    {hora}
                    </option>
                    ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
                        ⌄
                    </div>
                </div>
            </div>

            <div>
                <label className="block mb-1 text-sm text-[#002a5c] font-medium">Hora de devolución:</label>
                <div className="relative">
                    <select
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                    {opcionesHora.map((hora) => (
                    <option
                        key={hora}
                        value={hora}
                        disabled={hora <= pickupTime}
                    >
                        {hora}
                    </option>
                    ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
                    ⌄
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default SelectorHoraAlquiler;
