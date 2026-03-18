import { Usuario } from "../types/Usuario";

const API_URL = "http://localhost:8080/usuarios";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error GET");
  return await res.json();
};

export const createUsuario = async (data: Usuario) => {
  console.log("ENVIANDO:", data); // 🔥

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });

  const text = await res.text(); // 🔥 IMPORTANTE

  console.log("RESPUESTA BACK:", text);

  if (!res.ok) throw new Error("Error POST");

  return JSON.parse(text);
};

export const updateUsuario = async (id: number, data: Usuario) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error PUT");
};

export const deleteUsuario = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error DELETE");
};