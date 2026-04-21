import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { getPedidos, actualizarEstadoPedido, registrarPagoPedido } from "../../services/PedidoService";
import { EstadoPedido, PedidoResponse } from "../../types/Pedido";
import { showSuccess, showError } from "../../utils/sweetAlert";
import Badge from "../../components/ui/badge/Badge";
import { useModal } from "../../hooks/useModal";
import PedidoDetalleModal from "./PedidoDetalleModal";

export default function PedidoPage() {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getPedidos();
      setPedidos(data);
    } catch (error: any) {
      showError("Error al cargar pedidos", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEstadoChange = async (id: number, nuevoEstado: EstadoPedido) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      showSuccess("¡Actualizado!", `Pedido marcado como ${nuevoEstado}`);
      load();
    } catch (error: any) {
      showError("Error", error.message);
    }
  };

  const handleRegistrarPago = async (id: number) => {
    try {
      await registrarPagoPedido(id, "EFECTIVO", "Pago registrado por administrador");
      showSuccess("¡Pago registrado!", "El pedido ha sido marcado como pagado.");
      load();
    } catch (error: any) {
      showError("Error", error.message);
    }
  };

  const verDetalle = (pedido: PedidoResponse) => {
    setSelectedPedido(pedido);
    openModal();
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "warning";
      case "PREPARANDO": return "info";
      case "ENVIADO": return "primary";
      case "ENTREGADO": return "success";
      case "CANCELADO": return "error";
      default: return "light";
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Pedidos" />

      <div className="space-y-6">
        <ComponentCard title="Listado de Pedidos Recibidos">
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <p className="text-gray-500">No hay pedidos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Cliente</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Fecha</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pedidos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-4 text-sm font-medium text-gray-800">#{p.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        <div className="font-medium">{p.clienteNombre}</div>
                        <div className="text-xs text-gray-400">{p.clienteTelefono}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(p.fecha).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-800">
                        Bs. {Number(p.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Badge color={getBadgeColor(p.estado)}>
                          {p.estado}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm flex items-center gap-2">
                        <button 
                          onClick={() => verDetalle(p)}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition"
                        >
                          Ver
                        </button>
                        <select 
                          className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-green-500"
                          value={p.estado}
                          onChange={(e) => handleEstadoChange(p.id, e.target.value as EstadoPedido)}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="PREPARANDO">PREPARANDO</option>
                          <option value="ENVIADO">ENVIADO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                        <button 
                          onClick={() => handleRegistrarPago(p.id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                        >
                          Pagar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Modal de Detalle */}
      <PedidoDetalleModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        pedido={selectedPedido}
      />
    </>
  );
}
