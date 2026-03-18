export interface Usuario {
  id?: number;
  nombre: string;
  nombre2?: string;
  apellido: string;
  apellido2?: string;
  email: string;
  password: string;
  telefono?: string;
  activo: boolean;
  createdAt?: string;
  rolNombre?: string;
  rolId?: number;
}