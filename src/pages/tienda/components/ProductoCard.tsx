import { Producto } from "../../../types/Producto";
import { useCarrito } from "../context/CarritoContext";

const BASE = "http://localhost:8080";

interface Props {
  producto: Producto;
}

export default function ProductoCard({ producto }: Props) {
  const { agregar, items } = useCarrito();

  const enCarrito = items.find((i) => i.producto.id === producto.id);
  const sinStock = producto.stock === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:border-gray-300 transition group">
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {producto.imagenUrl ? (
          <img
            src={`${BASE}${producto.imagenUrl}`}
            alt={producto.nombre}
            className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-52 bg-gray-50 flex items-center justify-center text-gray-300 text-sm">
            Sin imagen
          </div>
        )}
        {sinStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-white border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        <p className="font-medium text-gray-800 text-[15px] leading-snug">
          {producto.nombre}
        </p>
        {producto.descripcion && (
          <p className="text-sm text-gray-400 line-clamp-2 flex-1 leading-relaxed">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-lg font-semibold text-gray-800">
            ${Number(producto.precio).toFixed(2)}
          </span>

          {!sinStock && (
            <button
              onClick={() => agregar(producto)}
              className={`text-sm px-3 py-1.5 rounded-xl font-medium transition ${
                enCarrito
                  ? "bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#9FE1CB]"
                  : "bg-[#1a1a2e] text-white hover:bg-[#2d2d4e]"
              }`}
            >
              {enCarrito ? `En carrito (${enCarrito.cantidad})` : "Agregar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}