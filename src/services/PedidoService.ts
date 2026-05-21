import { PedidoRequestDTO, EstadoPedido, MetodoPago } from "../types/Pedido";
import { http } from "./httpClient";

const API_URL = "http://localhost:8080/api/pedidos";

export const crearPedido = async (request: PedidoRequestDTO): Promise<number> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al procesar el pedido");
  }

  return await res.json();
};

export const getPedidos = async (page?: number, size?: number): Promise<any> => {
    const url = (page !== undefined && size !== undefined) 
        ? `${API_URL}?page=${page}&size=${size}`
        : API_URL;
    const res = await http.get(url);
    if (!res.ok) throw new Error("Error obteniendo pedidos");
    return await res.json();
};

export const actualizarEstadoPedido = async (id: number, estado: EstadoPedido) => {
    const res = await http.put(`${API_URL}/${id}/estado`, { estado });
    if (!res.ok) throw new Error("Error actualizando estado del pedido");
};

export const registrarPagoPedido = async (id: number, metodo: MetodoPago, notas: string) => {
    const res = await http.post(`${API_URL}/${id}/pago`, { metodo, notas });
    if (!res.ok) throw new Error("Error registrando pago");
};
