import { Rol } from "../types/Rol";

const API_URL = "http://localhost:8080/roles";

// GET ALL
export const getRoles = async (): Promise<Rol[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error GET Roles");
  return await res.json();
};

// GET BY ID
export const getRolById = async (id: number): Promise<Rol> => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// CREATE
export const createRol = async (rol: Rol): Promise<Rol> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rol),
  });
  return res.json();
};

// UPDATE
export const updateRol = async (id: number, rol: Rol): Promise<Rol> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rol),
  });
  return res.json();
};

// DELETE
export const deleteRol = async (id: number): Promise<string> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.text();

  
};