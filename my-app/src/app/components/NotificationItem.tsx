'use client';

import { useState } from "react";
import NotificationDetailModal from "@/app/components/notificationDetailModal";

interface NotificationItemProps {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export default function NotificationItem({
  id,
  title,
  date,
  description,
  imageUrl,
}: NotificationItemProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center bg-[#E4D5C1] p-4 rounded-md shadow-sm border mb-2">
        <div>
          <p className="text-[16px] font-medium text-[#11295B] font-inter">
            {title}
          </p>
          <p className="text-[13px] text-gray-600 font-regular">{date}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FCA311] text-white px-3 py-1 rounded-full text-[16px] hover:bg-[#e2920c] transition font-medium"
        >
          Ver más
        </button>
      </div>
      {showModal && (
        <NotificationDetailModal
          id={id}
          title={title}
          date={date}
          description={description}
          imageUrl={imageUrl}
          onClose={() => setShowModal(false)}
          onDelete={(id) => {
            console.log("Borrar notificación:", id);
            // Lógica de borrado
          }}
          onView={(id) => {
            console.log("Ver detalles de renta:", id);
            // Lógica de redirección o acción
          }}
        />
      )}
    </>
  );
}
