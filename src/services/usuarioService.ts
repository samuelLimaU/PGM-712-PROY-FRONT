import { Usuario } from "../types/Usuario";
import { http } from "./httpClient";

const API_URL = "http://localhost:8080/usuarios";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await http.get(API_URL);
  if (!res.ok) throw new Error("Error GET");
  return await res.json();
};

export const createUsuario = async (data: Usuario) => {
  const res = await http.post(API_URL, data);
  const text = await res.text();
  if (!res.ok) throw new Error("Error POST");
  return JSON.parse(text);
};

export const updateUsuario = async (id: number, data: Usuario) => {
  const res = await http.put(`${API_URL}/${id}`, data);
  if (!res.ok) throw new Error("Error PUT");
};

export const deleteUsuario = async (id: number) => {
  const res = await http.delete(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error DELETE");
};