import { useCarrito } from "../context/CarritoContext";
import { useNavigate } from "react-router";
import { 
  CloseIcon, 
  TrashBinIcon, 
  BoxCubeIcon, 
  ArrowRightIcon 
} from "../../../icons";

const BASE = "http://localhost:8080";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CarritoDrawer({ open, onClose }: Props) {
  const { items, quitar, cambiarCantidad, total, vaciar } = useCarrito();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-800 text-base">
            Tu pedido{" "}
            {items.length > 0 && (
              <span className="text-gray-400 font-normal text-sm">
                ({items.length} {items.length === 1 ? "ítem" : "ítems"})
              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <BoxCubeIcon className="w-10 h-10" />
              </div>
              <p className="text-gray-400 text-sm">Aún no has añadido nada</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.producto.id} className="flex gap-3">
                {item.producto.imagenUrl ? (
                  <img
                    src={`${BASE}${item.producto.imagenUrl}`}
                    alt={item.producto.nombre}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.producto.nombre}
                  </p>
                  <div className="flex items-center gap-2">
                    {item.producto.promocionActiva && item.producto.precioOferta ? (
                      <>
                        <span className="text-sm font-semibold text-[#FF4D4D]">
                          Bs. {Number(item.producto.precioOferta).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-300 line-through">
                          Bs. {Number(item.producto.precio).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Bs. {Number(item.producto.precio).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => cambiarCantidad(item.producto.id!, item.cantidad - 1)}
                      className="w-6 h-6 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 flex items-center justify-center transition"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => cambiarCantidad(item.producto.id!, item.cantidad + 1)}
                      className="w-6 h-6 rounded-lg border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => quitar(item.producto.id!)}
                    className="text-gray-300 hover:text-red-400 transition"
                  >
                    <TrashBinIcon className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-semibold text-gray-800">
                    Bs. {((item.producto.promocionActiva && item.producto.precioOferta 
                        ? Number(item.producto.precioOferta) 
                        : Number(item.producto.precio)) * item.cantidad).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total a pagar</span>
              <span className="font-medium text-gray-800">Bs. {total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => { onClose(); navigate("/tienda/checkout"); }}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] text-white py-3 rounded-xl font-medium hover:bg-[#2d2d4e] transition text-sm"
            >
              Finalizar pedido
              <ArrowRightIcon className="w-4 h-4" />
            </button>

            <button
              onClick={vaciar}
              className="w-full text-gray-400 text-xs hover:text-gray-600 transition"
            >
              Limpiar pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}