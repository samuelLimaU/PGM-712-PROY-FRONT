import { useEffect, useState } from "react";
import { PedidoResponse } from "../../types/Pedido";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

interface Props {
  isOpen: boolean;
  pedido: PedidoResponse | null;
  onClose: () => void;
}

export default function PedidoDetalleModal({
  isOpen,
  pedido,
  onClose,
}: Props) {
  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const { playClick } = useSound();

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimate(false);
    } else {
      setAnimate(false);
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (show && isOpen) {
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    }
  }, [show, isOpen]);

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 z-50 ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold">
            Detalle del Pedido #{pedido?.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
          >
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {pedido && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 uppercase text-[10px] font-bold">Cliente</p>
                <p className="font-medium text-gray-800 text-base">{pedido.clienteNombre}</p>
                <p className="text-gray-500">{pedido.clienteTelefono}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-[10px] font-bold">Dirección</p>
                <p className="text-gray-600">{pedido.direccion}</p>
              </div>
            </div>

            {pedido.notas && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-yellow-800 text-xs font-bold uppercase mb-1">Notas del cliente:</p>
                <p className="text-yellow-900 text-sm italic">"{pedido.notas}"</p>
              </div>
            )}

            <div>
              <p className="text-gray-400 uppercase text-[10px] font-bold mb-3">Productos</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {pedido.detalles.map((det, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <div>
                      <span className="font-medium text-gray-800">{det.productoNombre}</span>
                      <span className="text-gray-400 ml-2">x{det.cantidad}</span>
                    </div>
                    <div className="text-gray-800 font-semibold">
                      Bs. {Number(det.subtotal).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-800">TOTAL</span>
                <span className="font-black text-xl text-[#1D9E75]">
                  Bs. {Number(pedido.total).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
               <button 
                onMouseEnter={playClick}
                onClick={onClose}
                className="px-6 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition shadow-sm"
               >
                 Cerrar
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
