import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Producto } from "../../../types/Producto";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregar: (producto: Producto) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: number;
  totalItems: number;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(() => {
    try {
      const stored = localStorage.getItem("carrito");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const agregar = (producto: Producto) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.producto.id === producto.id);
      if (existe) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) }
            : i
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const quitar = (productoId: number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      quitar(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.producto.id === productoId
          ? { ...i, cantidad: Math.min(cantidad, i.producto.stock) }
          : i
      )
    );
  };

  const vaciar = () => setItems([]);

  const total = items.reduce((acc, i) => {
    const precioActual =
      i.producto.promocionActiva && i.producto.precioOferta
        ? i.producto.precioOferta
        : i.producto.precio;
    return acc + Number(precioActual) * i.cantidad;
  }, 0);

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, totalItems }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}