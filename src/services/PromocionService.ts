import { Promocion, PromocionRequest } from "../types/Promocion";
import { http } from "./httpClient";

const BASE = "http://localhost:8080/promociones";

export const getPromociones = async (): Promise<Promocion[]> => {
  const res = await http.get(BASE);
  if (!res.ok) throw new Error("Error al obtener promociones");
  return await res.json();
};

export const getPromocionesActivas = async (): Promise<Promocion[]> => {
  const res = await http.get(`${BASE}/activas`);
  if (!res.ok) throw new Error("Error al obtener promociones activas");
  return await res.json();
};

export const getPromocionById = async (id: number): Promise<Promocion> => {
  const res = await http.get(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Error al obtener la promoción");
  return await res.json();
};

export const createPromocion = async (data: PromocionRequest): Promise<Promocion> => {
  const res = await http.post(BASE, data);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear la promoción");
  }
  return await res.json();
};

export const updatePromocion = async (id: number, data: PromocionRequest): Promise<Promocion> => {
  const res = await http.put(`${BASE}/${id}`, data);
  
  if (!res.ok) {
    const text = await res.text();
    let errorMessage = `Error ${res.status}: `;
    try {
      const err = JSON.parse(text);
      errorMessage += err.error || err.message || res.statusText;
    } catch (e) {
      errorMessage += text || res.statusText;
    }
    throw new Error(errorMessage);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {} as Promocion;
};

export const deletePromocion = async (id: number): Promise<void> => {
  const res = await http.delete(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Error al eliminar la promoción");
};
