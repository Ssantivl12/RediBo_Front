export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  fechaRegistro: string;
  contraseña: string;
  esAdmin: boolean;
  autos?: Auto[];
  comentarios?: Comentario[];
}

export interface Auto {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
  color: string;
  precioRentaDiario: string; 
  montoGarantia: string;
  estado: EstadoAuto;
  fechaAdquisicion: string;
  kilometraje: number;
  descripcion?: string;
  transmision: string;
  combustible: string;
  capacidad: number;
  capacidadMaletero: number;
  tipoAuto: string;
  propietarioId: number;
  propietario: Usuario;
  historialMantenimiento?: HistorialMantenimiento[];
  comentarios?: Comentario[];
  imagenes: Imagen[];
  disponibilidad: Disponibilidad[];
}

export interface Comentario {
  id: number;
  autoId: number;
  usuarioId: number;
  contenido: string;
  calificacion: number;
  fechaCreacion: string;
  usuario: Pick<Usuario, 'id' | 'nombre' | 'apellido'>;
}


export interface HistorialMantenimiento {
  id: number;
  autoId: number;
  fechaInicio: string;
  fechaFin?: string;
  descripcion: string;
  costo?: string;
  tipoMantenimiento: TipoMantenimiento;
  kilometraje: number;
  auto: Auto;
}

export interface Disponibilidad {
  id: number;
  autoId: number;
  fechaInicio: string;
  fechaFin: string;
  motivo: MotivoNoDisponibilidad;
  descripcion?: string;
  auto: Auto;
}

export interface Imagen {
    id: number;
    autoId: number;
    direccionImagen: string;
}

export type MotivoNoDisponibilidad = 'MANTENIMIENTO' | 'REPARACION' | 'USO_PERSONAL' | 'OTRO';

export type EstadoAuto = 'ACTIVO' | 'INACTIVO';

export type TipoMantenimiento = 'PREVENTIVO' | 'CORRECTIVO' | 'REVISION';