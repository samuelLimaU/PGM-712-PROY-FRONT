import { useEffect, useState } from "react";
import { Producto } from "../../types/Producto";
import ProductoCard from "./components/ProductoCard";
import CarritoDrawer from "./components/CarritoDrewer";
import { useCarrito } from "./context/CarritoContext";

const BASE = "http://localhost:8080";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const { totalItems } = useCarrito();

  useEffect(() => {
    fetch(`${BASE}/catalogo`)
      .then((r) => r.json())
      .then((data) => setProductos(data.filter((p: Producto) => p.activo)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-800 text-base">Mi Tienda</span>
        <button
          onClick={() => setCarritoOpen(true)}
          className="relative flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2d2d4e] transition"
        >
          🛒 Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#1D9E75] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      {/* Hero */}
      <div className="bg-[#1a1a2e] px-6 py-20 text-center">
        <p className="text-xs tracking-widest text-[#9FE1CB] uppercase mb-4">
          Colección 2026
        </p>
        <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
          Los mejores productos,{" "}
          <span className="text-[#5DCAA5]">al mejor precio</span>
        </h1>
        <p className="text-[#B4B2A9] text-base max-w-md mx-auto mb-8 leading-relaxed">
          Descubre nuestra selección de calidad. Envío disponible a todo el país.
        </p>
        <button
          onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-block bg-[#1D9E75] text-[#E1F5EE] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#0F6E56] transition"
        >
          Ver catálogo
        </button>
      </div>

      {/* Productos */}
      <div className="max-w-6xl mx-auto px-4 py-12" id="productos">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-800">Todos los productos</h2>
          {!loading && (
            <span className="text-sm text-gray-400">{productos.length} disponibles</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productos.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 text-center py-8 mt-8">
        <p className="text-sm text-gray-400">
          Todos los precios incluyen impuestos. Stock sujeto a disponibilidad.
        </p>
      </div>

      {/* Carrito drawer */}
      <CarritoDrawer open={carritoOpen} onClose={() => setCarritoOpen(false)} />
    </div>
  );
}