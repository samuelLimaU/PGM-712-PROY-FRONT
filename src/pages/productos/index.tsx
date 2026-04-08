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
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (formData: FormData) => {
    if (editing) {
      await updateProducto(editing.id!, formData);
    } else {
      await createProducto(formData);
    }
    await load();
    setOpenModal(false);
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteProducto(id);
    load();
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
