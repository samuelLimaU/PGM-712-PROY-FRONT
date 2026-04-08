import { http } from "./httpClient";

const API_URL = "http://localhost:8080/usuario-roles";

export interface UsuarioRol {
  id: number;
  usuarioId: number;
  rolId: number;
}

export const getUsuarioRoles = async (): Promise<UsuarioRol[]> => {
  const res = await http.get(API_URL);
  if (!res.ok) throw new Error("Error GET usuario-rol");
  return await res.json();
};

export const createUsuarioRol = async (usuarioId: number, rolId: number) => {
  const res = await http.post(API_URL, { usuarioId, rolId });
  if (!res.ok) throw new Error("Error creando relación usuario-rol");
};

export const updateUsuarioRol = async (id: number, usuarioId: number, rolId: number) => {
  const res = await http.put(`${API_URL}/${id}`, { usuarioId, rolId });
  if (!res.ok) throw new Error("Error actualizando rol");
};