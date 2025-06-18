export interface VehiculoReservaDetalle {
  marca: string;
  modelo: string;
  placa: string;
  descripcion: string;
  tarifa: number;
  imagen: string;
  reserva: {
    idreserva: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
  };
}