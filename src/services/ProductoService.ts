import { Producto } from "../types/Producto";
import { http } from "./httpClient";

const BASE = "http://localhost:8080/productos";


export const getProductos = async (page?: number, size?: number) => {
  const url = (page !== undefined && size !== undefined) 
      ? `${BASE}?page=${page}&size=${size}`
      : BASE;
  const res = await http.get(url);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
};

export const createProducto = async (formData: FormData) => {
  const res = await http.postForm(BASE, formData);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear producto");
  }
  return await res.json();
};

export const deleteProducto = async (id: number) => {
  const res = await http.delete(`${BASE}/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al borrar el producto");
  }
};

export async function updateProducto(id: number, formData: FormData): Promise<Producto> {
  const res = await http.putForm(`${BASE}/${id}`, formData);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar producto");
  }
  return res.json();
}