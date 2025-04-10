export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nombreSede: string;
  nombreCategoria: string;
  nombreFormador: string;
  activo: boolean;
  recomendadoPor: string;
}

export interface AlumnoInactivacionHistorial {
  id: number;
  fechaInactivacion: string;
  fechaReactivacion: string | null;
  estadoAnterior: boolean;
  estadoNuevo: boolean;
  motivo: string;
  usuarioModificacion: string;
  fechaRegistro: string;
}

export interface CambiarEstadoAlumnoDto {
  activo: boolean;
  motivo?: string;
}