export interface Promocion {
  id?: number;
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  tipo: "BANNER" | "DESCUENTO_PORCENTAJE" | "DESCUENTO_FIJO";
  valor?: number | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  activo: boolean;
  productoIds?: number[] | null;
}

export interface PromocionRequest {
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  tipo: string;
  valor?: number | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  activo?: boolean | null;
  productoIds?: number[] | null;
}
