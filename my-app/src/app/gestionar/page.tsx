import TituloDescripcion from "@components/TituloDescripcion/TituloDescripcion";

import GestionarVehiculos from "@components/GestionarVehiculos/GestionarVehiculos";
export default function GestionarSolicitudes() {
  return (
    <div>
      <TituloDescripcion />
      {/* Resto del contenido de la página */}
      <GestionarVehiculos />
    </div>
  );
}

