import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ProductoTable from "./ProductoTable";
import ProductoForm from "./ProductoForm";
import { Producto } from "../../types/Producto";
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

  const load = async () => {
    try {
      setLoading(true);
      const productos = await getProductos();
      setData(productos);
    } catch (error: any) {
      showError("Error al cargar productos", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
              data={data}
              onEdit={(item) => {
                setEditing(item);
                setOpenModal(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </ComponentCard>
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
