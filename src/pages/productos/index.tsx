import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ProductoTable from "./ProductoTable";
import ProductoForm from "./ProductoForm";
import { Producto } from "../../types/Producto";
import Pagination from "../../components/ui/Pagination";
import {
  getProductos,
  createProducto,
  deleteProducto,
  updateProducto,
} from "../../services/ProductoService";
import { useSound } from "../../hooks/useSound";
import { showSuccess, showError, showConfirm } from "../../utils/sweetAlert";

export default function ProductoPage() {
  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { playClick } = useSound();

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const load = async () => {
    try {
      setLoading(true);
      const productos = await getProductos();
      setData(productos);
      setCurrentPage(1);
    } catch (error: any) {
      showError("Error al cargar productos", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Lógica de Paginación
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleSave = async (formData: FormData) => {
    try {
      if (editing) {
        await updateProducto(editing.id!, formData);
        showSuccess("¡Actualizado!", "Producto actualizado correctamente");
      } else {
        await createProducto(formData);
        showSuccess("¡Guardado!", "Nuevo producto creado con éxito");
      }
      await load();
      setOpenModal(false);
      setEditing(null);
    } catch (error: any) {
      showError("Error al procesar producto", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await showConfirm(
      "¿Eliminar producto?",
      "Esta acción eliminará el producto permanentemente del inventario."
    );
    if (!isConfirmed) return;

    try {
      await deleteProducto(id);
      showSuccess("¡Eliminado!", "El producto ha sido removido.");
      load();
    } catch (error: any) {
      showError("Error al eliminar", error.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Productos" />

      <div className="space-y-6">
        <ComponentCard title="Gestión de Productos">
          <button
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
            onMouseEnter={playClick}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Nuevo Producto
          </button>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <ProductoTable
              data={currentData}
              onEdit={(item) => {
                setEditing(item);
                setOpenModal(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </ComponentCard>

        {/* Footer de Paginación */}
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
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>

      <ProductoForm
        isOpen={openModal}
        editing={editing}
        onSave={handleSave}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}
