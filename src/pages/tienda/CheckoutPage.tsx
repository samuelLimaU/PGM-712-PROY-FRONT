import { useState } from "react";
import { useCarrito } from "./context/CarritoContext";
import { useNavigate } from "react-router";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const BASE = "http://localhost:8080";

interface DatosCliente {
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  referencia: string;
}

type Paso = "datos" | "resumen" | "confirmado";

export default function CheckoutPage() {
  const { items, total, vaciar } = useCarrito();
  const navigate = useNavigate();
  const [paso, setPaso] = useState<Paso>("datos");
  const [enviando, setEnviando] = useState(false);

  const [datos, setDatos] = useState<DatosCliente>({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    referencia: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      // Por ahora solo simulamos — luego conectamos al backend
      await new Promise((r) => setTimeout(r, 800));
      vaciar();
      setPaso("confirmado");
    } finally {
      setEnviando(false);
    }
  };

  // Carrito vacío y no confirmado → volver al catálogo
  if (items.length === 0 && paso !== "confirmado") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate("/tienda")}
          className="text-sm text-[#1D9E75] hover:underline"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar simple */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => paso === "datos" ? navigate("/tienda") : setPaso("datos")}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="font-medium text-gray-800">
          {paso === "datos" && "Datos de entrega"}
          {paso === "resumen" && "Resumen del pedido"}
          {paso === "confirmado" && "Pedido confirmado"}
        </span>
      </nav>

      {/* Stepper */}
      {paso !== "confirmado" && (
        <div className="flex items-center justify-center gap-2 py-4 bg-white border-b border-gray-100">
          {(["datos", "resumen"] as const).map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition ${
                paso === p
                  ? "bg-[#1a1a2e] text-white"
                  : paso === "resumen" && p === "datos"
                  ? "bg-[#1D9E75] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {paso === "resumen" && p === "datos" ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${paso === p ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                {p === "datos" ? "Tus datos" : "Resumen"}
              </span>
              {i < 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── PASO 1: Datos ── */}
        {paso === "datos" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-6">
              Completa tus datos para coordinar la entrega.
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide">
                Información personal
              </h3>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <input
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Teléfono <span className="text-red-400">*</span>
                </label>
                <input
                  name="telefono"
                  value={datos.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 70012345"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] transition"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide">
                Dirección de entrega
              </h3>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Dirección <span className="text-red-400">*</span>
                </label>
                <input
                  name="direccion"
                  value={datos.direccion}
                  onChange={handleChange}
                  placeholder="Calle, número, zona"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Ciudad</label>
                <input
                  name="ciudad"
                  value={datos.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: La Paz"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Referencia (opcional)
                </label>
                <textarea
                  name="referencia"
                  value={datos.referencia}
                  onChange={handleChange}
                  placeholder="Ej: Frente al parque, edificio azul"
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75] transition resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => setPaso("resumen")}
              disabled={!datos.nombre || !datos.telefono || !datos.direccion}
              className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#2d2d4e] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ver resumen →
            </button>
          </div>
        )}

        {/* ── PASO 2: Resumen ── */}
        {paso === "resumen" && (
          <div className="space-y-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide mb-4">
                Productos
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex items-center gap-3">
                    {item.producto.imagenUrl ? (
                      <img
                        src={`${BASE}${item.producto.imagenUrl}`}
                        alt={item.producto.nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.producto.nombre}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.cantidad} × ${Number(item.producto.precio).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                      ${(Number(item.producto.precio) * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-semibold text-gray-800">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Datos entrega */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide mb-3">
                Entrega a
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">{datos.nombre}</p>
                <p>{datos.telefono}</p>
                <p>{datos.direccion}{datos.ciudad ? `, ${datos.ciudad}` : ""}</p>
                {datos.referencia && (
                  <p className="text-gray-400 text-xs">{datos.referencia}</p>
                )}
              </div>
            </div>

            {/* Pago */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide mb-3">
                Pago
              </h3>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-lg">💵</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Contra entrega</p>
                  <p className="text-xs text-gray-400">
                    El método de pago se coordina al momento de la entrega
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmar}
              disabled={enviando}
              className="w-full bg-[#1D9E75] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#0F6E56] transition disabled:opacity-60"
            >
              {enviando ? "Confirmando..." : "Confirmar pedido"}
            </button>

            <button
              onClick={() => setPaso("datos")}
              className="w-full text-gray-400 text-xs hover:text-gray-600 transition"
            >
              Editar datos
            </button>
          </div>
        )}

        {/* ── PASO 3: Confirmado ── */}
        {paso === "confirmado" && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <CheckCircleIcon className="w-16 h-16 text-[#1D9E75]" />
            <h2 className="text-2xl font-semibold text-gray-800">¡Pedido recibido!</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Gracias {datos.nombre?.split(" ")[0]}. Nos pondremos en contacto
              al <span className="font-medium text-gray-700">{datos.telefono}</span> para
              coordinar la entrega.
            </p>
            <button
              onClick={() => navigate("/tienda")}
              className="mt-4 bg-[#1a1a2e] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#2d2d4e] transition"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}