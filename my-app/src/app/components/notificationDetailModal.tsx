'use client';

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface NotificationDetailModalProps {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  onClose: () => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export default function NotificationDetailModal({
  id,
  title,
  date,
  description,
  imageUrl,
  onClose,
  onDelete,
  onView,
}: NotificationDetailModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white text-[#000000] w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-[#E4D5C1] relative">
        <div className="bg-[#FCA311] px-6 py-4 flex justify-center items-center relative">
          <h2 className="text-[40px] font-bold text-[#11295B] font-inter">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-[#11295B] hover:text-red-500 transition"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <p className="text-[16px] text-gray-500 font-regular">{date}</p>
            <p className="text-[16px] whitespace-pre-line font-regular">
              {description}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  onDelete(id);
                  handleClose();
                }}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition text-[16px] font-medium"
              >
                Borrar
              </button>
              <button
                onClick={() => {
                  onView(id);
                  handleClose();
                }}
                className="bg-[#FCA311] text-white px-4 py-2 rounded-full hover:bg-[#e2920c] transition text-[16px] font-medium"
              >
                Ver renta
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center bg-[#E4D5C1] rounded-md min-h-[200px]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Imagen del vehículo"
                width={200}
                height={200}
                className="rounded-md object-contain"
              />
            ) : (
              <p className="text-[13px] text-gray-500 text-center">
                Sin imagen
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
