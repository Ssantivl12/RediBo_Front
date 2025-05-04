"use client"

import { useState } from "react"

interface LugarRecogidaProps {
    lugarRecogida: string
    setLugarRecogida: (lugar: string) => void
}

export default function LugarRecogida({ lugarRecogida, setLugarRecogida }: LugarRecogidaProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const lugaresRecogida = [
        "aeropuerto jorge wilstermann", 
        "estadio felix capriles", 
        "aeropuerto jorge wilstermann", 
        "cine center"
    ]

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
    
    const selectLocation = (location: string) => {
        setLugarRecogida(location)
        setIsDropdownOpen(false)
    }

    return (
        <div className="border border-black rounded-xl w-[325px] h-[150px] p-4 relative">
            <h2 className='text-[#11295B] font-bold text-left'>Lugar de recogida:</h2>
            
            {/* Selector principal - siempre visible */}
            <div 
                className="mt-2 p-2 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
                onClick={toggleDropdown}
            >
                <span>{lugarRecogida || 'Seleccione una ubicación'}</span>
                <span>{isDropdownOpen ? '▲' : '▼'}</span>
            </div>
            
            {/* Menú sobrepuesto - posición ajustada con top-[70px] */}
            {isDropdownOpen && (
                <div className="absolute z-10 top-[90px] left-0 w-[325px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto ">
                    {lugaresRecogida.map((location, index) => (
                        <div 
                            key={index}
                            className={`p-3 hover:bg-gray-100 cursor-pointer ${
                                lugarRecogida === location ? "bg-gray-100 font-medium" : ""
                            }`}
                            onClick={() => selectLocation(location)}
                        >
                            {location}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Espacio reservado para mantener el tamaño */}
            {!isDropdownOpen && (
                <div className="invisible p-2">Espacio reservado</div>
            )}
        </div>
    )
}