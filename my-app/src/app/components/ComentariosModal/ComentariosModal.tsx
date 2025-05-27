"use client";

import React, { useState } from "react";
import Modal from "@components/modal/Modal";

interface Comentario {
  autor: string;
  fecha: string;
  puntuacion: number;
  contenido: string;
}

interface ComentariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  comentarios: Comentario[];
}

export const VerComentarios: React.FC<ComentariosModalProps> = ({ isOpen, onClose, comentarios }) => {
  const [orden, setOrden] = useState<"recientes" | "antiguos" | "mayor" | "menor">("recientes");

  const comentariosOrdenados = [...comentarios].sort((a, b) => {
    switch (orden) {
      case "recientes":
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      case "antiguos":
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      case "mayor":
        return b.puntuacion - a.puntuacion;
      case "menor":
        return a.puntuacion - b.puntuacion;
      default:
        return 0;
    }
  });

  const renderEstrellas = (puntuacion: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={i < puntuacion ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const botones = [
    { label: "Recientes", value: "recientes" },
    { label: "Antiguos", value: "antiguos" },
    { label: "Mayor Puntuación", value: "mayor" },
    { label: "Menor Puntuación", value: "menor" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <Modal isOpen={isOpen} onClose={onClose} title="Comentarios del vehículo" width="xl">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {botones.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setOrden(value as typeof orden)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${orden === value ? "bg-[#e69300] text-white" : "bg-[#11295B] text-white hover:opacity-90 active:bg-[#e69300]"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {comentariosOrdenados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay comentarios disponibles para este vehículo.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comentariosOrdenados.map((comentario, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-[#11295B]">{comentario.autor}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(comentario.fecha).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="mb-3">
                  {renderEstrellas(comentario.puntuacion)}
                </div>
                <p className="text-gray-700">{comentario.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
    </div>
  );
};

