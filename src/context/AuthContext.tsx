import { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
  id: number;
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  roles: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Recuperar sesión si existe
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: AuthUser) => {
    localStorage.setItem("auth", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}