export interface Propietario {
    id: number;
    nombre: string;
    apellido: string;
  }
  
  export interface Auto {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    placa: string;
    color: string;
    precioRentaDiario: number;
    montoGarantia: number;
    estado: 'ACTIVO' | 'INACTIVO';
    fechaAdquisicion: string;
    kilometraje: number;
    descripcion?: string;
    transmision: string;
    combustible: string;
    capacidad: number;
    propietarioId: number;
    imagenes: string;
  
    // Agregamos el objeto completo del propietario
    propietario?: Propietario;
  }
  