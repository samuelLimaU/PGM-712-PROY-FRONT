import { Rol } from "../types/Rol";
import { http } from "./httpClient";

const API_URL = "http://localhost:8080/roles";

export const getRoles = async (): Promise<Rol[]> => {
  const res = await http.get(API_URL);
  if (!res.ok) throw new Error("Error GET Roles");
  return await res.json();
};

export const getRolById = async (id: number): Promise<Rol> => {
  const res = await http.get(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error GET Rol");
  return await res.json();
};

export const createRol = async (rol: Rol): Promise<Rol> => {
  const res = await http.post(API_URL, rol);
  if (!res.ok) throw new Error("Error POST Rol");
  return await res.json();
};

export const updateRol = async (id: number, rol: Rol): Promise<Rol> => {
  const res = await http.put(`${API_URL}/${id}`, rol);
  if (!res.ok) throw new Error("Error PUT Rol");
  return await res.json();
};

export const deleteRol = async (id: number): Promise<string> => {
  const res = await http.delete(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error DELETE Rol");
  return await res.text();
};