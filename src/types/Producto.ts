export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
  activo?: boolean;
  createdAt?: string;

  // Campos de Promoción (vienen del backend)
  promocionActiva?: boolean;
  precioOferta?: number;
  tipoPromocion?: string; // BANNER, DESCUENTO_PORCENTAJE, DESCUENTO_FIJO
  tituloPromocion?: string;
}
