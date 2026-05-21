import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { getPedidos, actualizarEstadoPedido, registrarPagoPedido } from "../../services/PedidoService";
import { EstadoPedido, PedidoResponse } from "../../types/Pedido";
import { showSuccess, showError, showConfirm } from "../../utils/sweetAlert";
import Badge from "../../components/ui/badge/Badge";
import { useModal } from "../../hooks/useModal";
import PedidoDetalleModal from "./PedidoDetalleModal";
import Pagination from "../../components/ui/Pagination";

export default function PedidoPage() {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoResponse | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      // Spring Data usa 0 para la primera página
      const response = await getPedidos(currentPage - 1, itemsPerPage);
      
      // Si el backend devolvió un objeto de paginación
      if (response.content) {
        setPedidos(response.content);
        setTotalPages(response.totalPages);
      } else {
        // Fallback por si acaso devuelve la lista completa (compatibilidad)
        const sortedData = [...response].sort((a, b) => b.id - a.id);
        setPedidos(sortedData);
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
      }
    } catch (error: any) {
      showError("Error al cargar pedidos", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentPage, itemsPerPage]);

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
    const isConfirmed = await showConfirm(
      "¿Verificar pago?",
      "Asegúrate de haber recibido el dinero antes de marcarlo como pagado."
    );

    if (!isConfirmed) return;

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
      case "PAGADO": return "success";
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
                          <option value="PAGADO">PAGADO</option>
                          <option value="PREPARANDO">PREPARANDO</option>
                          <option value="ENVIADO">ENVIADO</option>
                          <option value="ENTREGADO">ENTREGADO</option>
                          <option value="CANCELADO">CANCELADO</option>
                        </select>
                        {p.estado !== "PAGADO" && (
                          <button 
                            onClick={() => handleRegistrarPago(p.id)}
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>

        {/* Footer de Paginación con Selector de Cantidad */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Mostrar</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); 
              }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-brand-500 bg-gray-50 font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>registros por página</span>
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
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
