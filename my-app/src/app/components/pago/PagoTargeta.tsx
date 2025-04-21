'use client';

import { FC } from 'react';

interface PagoTarjetaProps {
  nombreTitular: string;
  numeroTarjeta: string;
  mes: string;
  anio: string;
  cvv: string;
  direccion: string;
  correoElectronico: string;
  setNombreTitular: (value: string) => void;
  setNumeroTarjeta: (value: string) => void;
  setMes: (value: string) => void;
  setAnio: (value: string) => void;
  setCvv: (value: string) => void;
  setDireccion: (value: string) => void;
  setCorreoElectronico: (value: string) => void;
  handleConfirmacion: () => void;
  onCancel: () => void;
}

const PagoTarjeta: FC<PagoTarjetaProps> = ({
  nombreTitular,
  numeroTarjeta,
  mes,
  anio,
  cvv,
  direccion,
  correoElectronico,
  setNombreTitular,
  setNumeroTarjeta,
  setMes,
  setAnio,
  setCvv,
  setDireccion,
  setCorreoElectronico,
  handleConfirmacion,
  onCancel
}) => {
  return (
    <div className="flex-1 h-full bg-[#E4D5C1] p-6 rounded-xl shadow-lg space-y-6 text-[#000000] text-[clamp(16px,1.5vw,60px)] overflow-y-auto">
      <h2 className="text-center font-bold text-[clamp(24px,2.5vw,56px)]">
        TRANSFERENCIA BANCARIA
      </h2>

      <div>
        <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
          Nombre del titular
        </label>
        <input
          type="text"
          className="w-full border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
          placeholder="Ej. Juan Pérez"
          value={nombreTitular}
          onChange={(e) => {
            let letrasSolo = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            letrasSolo = letrasSolo
              .toLowerCase()
              .split(' ')
              .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
              .join(' ');
            setNombreTitular(letrasSolo);
          }}
        />
      </div>

      <div>
  <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
    Número de tarjeta
  </label>
  <input
    type="text"
    className="w-full border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
    placeholder="1234 5678 9012 3456"
    value={numeroTarjeta}
    onChange={(e) => {
      let value = e.target.value.replace(/\D/g, ""); // Solo números
      value = value.slice(0, 16); // Máximo 16 dígitos
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Espacio cada 4 dígitos
      setNumeroTarjeta(formattedValue);
    }}
  />
</div>

      {/* Fecha y CVV */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
            Fecha de expiración
          </label>
          <div className="flex gap-2 w-full">
            <input
              type="number"
              className="w-1/2 border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)] text-center"
              placeholder="MM"
              max={12}
              min={1}
              value={mes}
              onChange={(e) => {
                let val = e.target.value.slice(0, 2);
                if (parseInt(val) > 12) val = "12";
                if (parseInt(val) < 1) val = "01";
                setMes(val);
              }}
            />
            <input
  type="text"
  className="w-1/2 border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)] text-center"
  placeholder="AA"
  value={anio}
  onChange={(e) => {
    let val = e.target.value.replace(/\D/g, ''); // Solo números
    val = val.slice(0, 2); // Máximo 2 dígitos

    if (val === "") {
      setAnio("");
      return;
    }

    const num = parseInt(val);

    // Si hay dos dígitos, validar rango
    if (val.length === 2) {
      if (num < 25) {
        val = "25";
      } else if (num > 35) {
        val = "35";
      }
    }

    setAnio(val);
  }}
/>

          </div>
        </div>

        <div className="w-1/3">
          <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
            CVV
          </label>
          <input
            type="number"
            className="w-full border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
            placeholder="123"
            value={cvv}
            onChange={(e) => {
              const val = e.target.value.slice(0, 3);
              setCvv(val);
            }}
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
          Dirección
        </label>
        <input
          type="text"
          className="w-full border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
          placeholder="Ej. Calle Oquendo"
          value={direccion}
          onChange={(e) => {
            const textoLimpio = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '');
            setDireccion(textoLimpio);
          }}
        />
      </div>

      <div>
        <label className="block font-semibold text-[clamp(15px,1.4vw,60px)]">
          Correo electrónico
        </label>
        <input
          type="email"
          className="w-full border bg-[#FFFFFF] text-[#000000] rounded p-[clamp(8px,1vw,25px)] text-[clamp(15px,1.4vw,60px)]"
          placeholder="Ej. juan.perez@gmail.com"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-center gap-[75px] px-6 mt-50">
        <button
          onClick={handleConfirmacion}
          className="bg-[#FCA311] text-[#000000] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold hover:bg-gray-300 text-[clamp(16px,1.4vw,60px)]"
        >
          CONFIRMAR TRANSFERENCIA
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-300 text-[#000000] mx-auto w-[70%] py-[clamp(12px,1.2vw,24px)] rounded font-bold hover:bg-gray-400 text-[clamp(16px,1.4vw,60px)]"
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
};

export default PagoTarjeta;
