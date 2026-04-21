export type EstadoPedido = "PENDIENTE" | "PREPARANDO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
export type MetodoPago = "EFECTIVO" | "QR" | "TRANSFERENCIA";
export type EstadoPago = "PENDIENTE" | "COMPLETADO" | "FALLIDO";

export interface ItemPedidoDTO {
  productoId: number;
  cantidad: number;
}

export interface PedidoRequestDTO {
  usuarioId?: number;
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
  referencia?: string;
  notas?: string;
  items: ItemPedidoDTO[];
}

export interface DetallePedidoResponse {
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  clienteNombre: string;
  clienteTelefono: string;
  direccion: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  notas?: string;
  detalles: DetallePedidoResponse[];
}
