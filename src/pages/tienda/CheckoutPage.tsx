import { useState, useEffect } from "react";
import { useCarrito } from "./context/CarritoContext";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { 
  ChevronLeftIcon, 
  CheckCircleIcon, 
  UserCircleIcon, 
  DollarLineIcon, 
  ArrowRightIcon,
  HorizontalDotsIcon
} from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { crearPedido, registrarPagoPedido } from "../../services/PedidoService";
import { PedidoRequestDTO, MetodoPago } from "../../types/Pedido";
import { showError, showSuccess } from "../../utils/sweetAlert";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paso, setPaso] = useState<Paso>("datos");
  const [enviando, setEnviando] = useState(false);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("EFECTIVO");
  const [showQRModal, setShowQRModal] = useState(false);
  const [pedidoIdActual, setPedidoIdActual] = useState<number | null>(null);

  const [datos, setDatos] = useState<DatosCliente>({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    referencia: "",
  });

  // Pre-cargar datos si hay usuario logueado
  useEffect(() => {
    if (user) {
      setDatos((prev) => ({
        ...prev,
        nombre: `${user.nombre} ${user.apellido || ""}`.trim(),
        telefono: user.telefono || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      const request: PedidoRequestDTO = {
        usuarioId: user?.id,
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        ciudad: datos.ciudad,
        referencia: datos.referencia,
        items: items.map(item => ({
          productoId: item.producto.id!,
          cantidad: item.cantidad
        }))
      };

      const id = await crearPedido(request);
      setPedidoIdActual(id);

      if (metodoPago === "QR") {
        setShowQRModal(true);
      } else {
        vaciar();
        setPaso("confirmado");
      }
    } catch (error: any) {
      showError("Error al procesar pedido", error.message || "No se pudo completar la compra");
    } finally {
      setEnviando(false);
    }
  };

  const handleSimularPagoQR = async () => {
    if (!pedidoIdActual) return;
    setEnviando(true);
    try {
      await registrarPagoPedido(pedidoIdActual, "QR", "Pago simulado por QR");
      setShowQRModal(false);
      vaciar();
      setPaso("confirmado");
      showSuccess("Pago realizado", "Tu pago por QR ha sido procesado con éxito.");
    } catch (error: any) {
      showError("Error al procesar pago", error.message || "No se pudo completar el pago");
    } finally {
      setEnviando(false);
    }
  };

  // Carrito vacío y no confirmado → volver al catálogo
  if (items.length === 0 && paso !== "confirmado") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate("/tienda")}
          className="flex items-center gap-2 text-sm text-[#1D9E75] hover:text-[#0F6E56] font-semibold transition"
        >
          <ChevronLeftIcon className="w-4 h-4" />
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
          className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-50"
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
            
            {/* Banner de Login / Cambio de Cuenta */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-sm text-blue-600">
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {user ? `Estás como ${user.nombre}` : "Compra más rápido"}
                  </p>
                  <p className="text-xs text-blue-700">
                    {user 
                      ? "¿Quieres usar otra cuenta?" 
                      : "Inicia sesión para usar tus datos guardados."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/signin?redirect=/tienda/checkout`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
              >
                {user ? "Cambiar cuenta" : "Iniciar sesión"}
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-2">
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
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#2d2d4e] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ver resumen
              <ArrowRightIcon className="w-4 h-4" />
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
                        {item.cantidad} × Bs. {Number(item.producto.promocionActiva && item.producto.precioOferta ? item.producto.precioOferta : item.producto.precio).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                      Bs. {((item.producto.promocionActiva && item.producto.precioOferta 
                        ? Number(item.producto.precioOferta) 
                        : Number(item.producto.precio)) * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span className="text-sm text-gray-500">Total a pagar</span>
                <span className="text-lg font-semibold text-gray-800">
                  Bs. {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Datos entrega */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 text-sm uppercase tracking-wide mb-3">
                Entregar pedido a
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
                Método de Pago
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setMetodoPago("EFECTIVO")}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition ${
                    metodoPago === "EFECTIVO" 
                      ? "border-[#1D9E75] bg-green-50" 
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shadow-sm ${metodoPago === "EFECTIVO" ? "bg-[#1D9E75] text-white" : "bg-white text-gray-400"}`}>
                    <DollarLineIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">Contra entrega (Efectivo)</p>
                    <p className="text-xs text-gray-400">Paga al recibir tus salteñas</p>
                  </div>
                  {metodoPago === "EFECTIVO" && <CheckCircleIcon className="ml-auto w-5 h-5 text-[#1D9E75]" />}
                </button>

                <button
                  onClick={() => setMetodoPago("QR")}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition ${
                    metodoPago === "QR" 
                      ? "border-[#1D9E75] bg-green-50" 
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shadow-sm ${metodoPago === "QR" ? "bg-[#1D9E75] text-white" : "bg-white text-gray-400"}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m5-10v1m0 11v1M4 12h1m11 0h1M4 12v1m0 11v1m5-10v1m0 11v1M4 12h1m11 0h1" />
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 18h3v3h-3zM18 14h3v3h-3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">Transferencia QR</p>
                    <p className="text-xs text-gray-400">Simulación de pago bancario rápido</p>
                  </div>
                  {metodoPago === "QR" && <CheckCircleIcon className="ml-auto w-5 h-5 text-[#1D9E75]" />}
                </button>
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
            <div className="bg-white p-4 rounded-full shadow-lg text-[#1D9E75] mb-2">
               <CheckCircleIcon className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">¡Pedido recibido!</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              Gracias {datos.nombre?.split(" ")[0]}. Nos pondremos en contacto
              al <span className="font-medium text-gray-700">{datos.telefono}</span> para
              coordinar la entrega.
            </p>
            <button
              onClick={() => navigate("/tienda")}
              className="mt-4 flex items-center gap-2 bg-[#1a1a2e] text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-[#2d2d4e] transition"
            >
              Seguir comprando
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── MODAL DE PAGO QR (SIMULACIÓN) ── */}
      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            {/* Parte Izquierda: El QR */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100">
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-gray-800">Escanea para pagar</h3>
                <p className="text-sm text-gray-500">Pedido #{pedidoIdActual}</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mb-6">
                <QRCodeSVG 
                  value={`http://multimedia2.com/pay/${pedidoIdActual}?amount=${total}`} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 mb-1">Bs. {total.toFixed(2)}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Monto Total</p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[#1D9E75] bg-green-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#1D9E75] rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-tight">Esperando confirmación...</span>
              </div>
            </div>

            {/* Parte Derecha: Simulación Móvil (Actualizado a Blanco/Verde) */}
            <div className="w-full md:w-[360px] bg-white p-6 flex flex-col relative overflow-hidden border-l border-gray-100">
              
              {/* Decoración superior de "móvil" */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-100 rounded-b-2xl z-10" />
              
              <div className="mt-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <HorizontalDotsIcon className="text-gray-300 w-5 h-5" />
                </div>

                <div className="bg-[#1D9E75]/5 rounded-2xl p-4 border border-[#1D9E75]/10 mb-6">
                  <p className="text-[10px] text-[#1D9E75] uppercase font-bold tracking-widest mb-1">Banca Móvil</p>
                  <p className="text-gray-800 font-medium">La Cruceña Pay</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-gray-800 text-lg font-semibold">Detalles del pago</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Destino:</span>
                      <span className="text-gray-800 font-medium">Salteñería La Cruceña</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Concepto:</span>
                      <span className="text-gray-800 font-medium">Pedido #{pedidoIdActual}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-[#1D9E75] font-bold text-base">Bs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mb-4">
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">
                      Para efectos de la demostración, haz clic en el botón de abajo para simular la confirmación bancaria.
                    </p>
                  </div>
                  <button
                    onClick={handleSimularPagoQR}
                    disabled={enviando}
                    className="w-full bg-[#1D9E75] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-green-900/10 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-[#168965]"
                  >
                    {enviando ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Confirmar Pago
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="w-full mt-3 text-gray-400 text-xs hover:text-gray-600 transition py-2"
                  >
                    Cancelar y volver
                  </button>
                </div>
              </div>

              {/* Marca de agua / Brillo */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1D9E75] opacity-5 blur-[100px] pointer-events-none" />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}