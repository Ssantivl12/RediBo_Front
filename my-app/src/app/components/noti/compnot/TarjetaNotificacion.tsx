'use client';

type NotificacionProps = {
  titulo: string;
  descripcion: string;
  fecha: string;
  destacada?: boolean;
};

export default function TarjetaNotificacion({
  titulo,
  descripcion,
  fecha,
  destacada = false,
}: NotificacionProps) {
  return (
    <div
      className={`w-full flex items-center border border-black p-4 ${
        destacada ? 'bg-[#EFE1CB]' : 'bg-white'
      }`}
    >
      {/* Círculo */}
      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />

      {/* Contenido */}
      <div className="flex-1 ml-4">
        <h3 className="font-bold text-black text-sm">{titulo}</h3>
        <p className="text-[13px] text-black">{descripcion}</p>
      </div>

      {/* Fecha y botón */}
      <div className="flex flex-col items-end ml-4">
        <span className="text-[12px] text-black">{fecha}</span>
        <button className="bg-[#FCA311] text-white text-sm px-4 py-1 rounded-full mt-2">
          Ver más
        </button>
      </div>
    </div>
  );
}
