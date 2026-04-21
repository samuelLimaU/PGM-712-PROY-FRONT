import { useEffect, useState } from "react";
import { Producto } from "../../types/Producto";
import { Promocion } from "../../types/Promocion";
import { getPromocionesActivas } from "../../services/PromocionService";
import ProductoCard from "./components/ProductoCard";
import CarritoDrawer from "./components/CarritoDrewer";
import { useCarrito } from "./context/CarritoContext";
import { useNavigate } from "react-router";

const BASE = "http://localhost:8080";

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resProds, resPromos] = await Promise.all([
          fetch(`${BASE}/catalogo`).then((r) => r.json()),
          getPromocionesActivas(),
        ]);
        setProductos(resProds.filter((p: Producto) => p.activo));
        setPromociones(resPromos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const promocionesValidas = promociones.filter((p) => p.activo);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-800 text-base italic">Salteñería La Cruceña</span>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-sm font-medium text-gray-600 hover:text-[#1D9E75] transition-colors"
          >
            Acceder
          </button>
          
          <button
            onClick={() => setCarritoOpen(true)}
            className="relative flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2d2d4e] transition"
          >
            🛒 Mi Pedido
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1D9E75] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Estático */}
      <div className="bg-[#1a1a2e] px-6 py-20 text-center">
        <p className="text-xs tracking-widest text-[#9FE1CB] uppercase mb-4">
          Tradición y Sabor desde 2026
        </p>
        <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
          Las mejores salteñas,{" "}
          <span className="text-[#5DCAA5]">siempre calientitas</span>
        </h1>
        <p className="text-[#B4B2A9] text-base max-w-md mx-auto mb-8 leading-relaxed">
          Disfruta del auténtico sabor cruceño en la comodidad de tu hogar. ¡Pide ahora!
        </p>
        <button
          onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-block bg-[#1D9E75] text-[#E1F5EE] px-7 py-3 rounded-full text-sm font-medium hover:bg-[#0F6E56] transition"
        >
          Ver Menú
        </button>
      </div>

      {/* Sección de Ofertas Activas */}
      {promocionesValidas.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Combos y Ofertas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promocionesValidas.map((promo) => (
              <div 
                key={promo.id} 
                className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-2xl border border-gray-100 p-6 group hover:shadow-lg transition duration-300"
              >
                <div className="relative z-10">
                  <span className="inline-block bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase">
                    {promo.tipo.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#1D9E75] transition">{promo.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{promo.descripcion}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      {promo.tipo === 'DESCUENTO_PORCENTAJE' ? `${promo.valor}% OFF` : `Bs. ${promo.valor} DCTO`}
                    </span>
                  </div>
                </div>

                {/* Decoración visual de fondo */}
                <div className="absolute -bottom-4 -right-4 text-gray-200 opacity-20 group-hover:opacity-40 transition pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.75 3.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM18.11 5.89a.75.75 0 00-1.06 0l-1.06 1.06a.75.75 0 101.06 1.06l1.06-1.06a.75.75 0 000-1.06zM20.25 12a.75.75 0 00-.75-.75h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75zM18.11 18.11a.75.75 0 000-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06a.75.75 0 001.06 0zM12.75 20.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM6.95 18.11a.75.75 0 000-1.06l-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06a.75.75 0 001.06 0zM3.75 12.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM6.95 6.95a.75.75 0 00-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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