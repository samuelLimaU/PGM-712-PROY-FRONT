const API_URL = "http://localhost:8080";

export interface LoginResponse {
  token: string;
  email: string;
  nombre: string;
  roles: string[];
}

export const loginService = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciales incorrectas");
  return await res.json();
};

export const registerService = async (data: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}) => {
  const res = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, activo: true }),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return await res.json();
};