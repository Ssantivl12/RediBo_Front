'use client';

import NotificationItem from "@/app/components/NotificationItem";

const mockNotifications = [
  {
    id: "notif1",
    title: "Tiempo de renta concluido",
    date: "31/03/2025, 21:00",
    description:
      "Tu vehículo Nissan Sentra ya concluyó su tiempo de renta con el arrendatario El Señor X.\n\nGracias por usar Redibo.",
    imageUrl: "/vehiculos/nissan.png",
  },
  {
    id: "notif2",
    title: "Pago pendiente",
    date: "01/04/2025, 10:00",
    description:
      "El arrendatario aún no ha completado el pago de la renta del Toyota Corolla.",
    imageUrl: "/vehiculos/toyota.png",
  },
];

export default function NotificationList() {
  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h1 className="text-[40px] font-bold text-[#11295B] font-inter mb-6">
        Notificaciones
      </h1>
      {mockNotifications.map((notif) => (
        <NotificationItem key={notif.id} {...notif} />
      ))}
    </section>
  );
}
