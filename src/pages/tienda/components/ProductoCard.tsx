import { Producto } from "../../../types/Producto";
import { useCarrito } from "../context/CarritoContext";
import { PlusIcon, CheckCircleIcon } from "../../../icons";

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

        {/* Badge de Promoción */}
        {producto.promocionActiva && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="bg-[#FF4D4D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              {producto.tituloPromocion || "Oferta"}
            </span>
            {producto.precioOferta && (
              <span className="bg-white text-[#FF4D4D] text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-[#FF4D4D] shadow-sm">
                -{Math.round((1 - Number(producto.precioOferta) / Number(producto.precio)) * 100)}%
              </span>
            )}
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
          <div className="flex flex-col">
            {producto.promocionActiva && producto.precioOferta ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  Bs. {Number(producto.precio).toFixed(2)}
                </span>
                <span className="text-lg font-bold text-[#FF4D4D]">
                  Bs. {Number(producto.precioOferta).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gray-800">
                Bs. {Number(producto.precio).toFixed(2)}
              </span>
            )}
          </div>

          {!sinStock && (
            <button
              onClick={() => agregar(producto)}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl font-medium transition ${
                enCarrito
                  ? "bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#9FE1CB]"
                  : "bg-[#1a1a2e] text-white hover:bg-[#2d2d4e]"
              }`}
            >
              {enCarrito ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>({enCarrito.cantidad})</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  <span>Añadir</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}