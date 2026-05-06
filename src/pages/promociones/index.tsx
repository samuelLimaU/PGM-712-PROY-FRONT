import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { Promocion } from "../../types/Promocion";
import { Producto } from "../../types/Producto";
import {
  getPromociones,
  createPromocion,
  deletePromocion,
  updatePromocion,
} from "../../services/PromocionService";
import { getProductos } from "../../services/ProductoService";
import { useSound } from "../../hooks/useSound";
import PromocionTable from "./PromocionTable";
import PromocionForm from "./PromocionForm";
import { showSuccess, showError, showConfirm, showInfo } from "../../utils/sweetAlert";
import Pagination from "../../components/ui/Pagination";

export default function PromocionPage() {
  const [data, setData] = useState<Promocion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Promocion | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { playClick } = useSound();

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const load = async () => {
    try {
      setLoading(true);
      const [promos, prods] = await Promise.all([getPromociones(), getProductos()]);
      setData(promos);
      setProductos(prods);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al cargar datos:", error);
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
  const currentPromos = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleSave = async (formData: any) => {
    try {
        const payload = {
          titulo: formData.titulo,
          descripcion: formData.descripcion || null,
          tipo: formData.tipo,
          valor: formData.valor || 0,
          fechaInicio: formData.fechaInicio || null,
          fechaFin: formData.fechaFin || null,
          activo: formData.activo,
          productoIds: formData.productoIds || [],
        };
        
        if (editing) {
          await updatePromocion(editing.id!, payload);
          showSuccess("¡Actualizado!", "Promoción actualizada con éxito");
        } else {
          await createPromocion(payload);
          showSuccess("¡Guardado!", "Nueva promoción creada con éxito");
        }
        await load();
        setOpenModal(false);
        setEditing(null);
    } catch (error: any) {
        showError("Error al guardar", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await showConfirm(
      "¿Eliminar promoción?",
      "Esta acción no se puede deshacer."
    );
    if (!isConfirmed) return;

    try {
        await deletePromocion(id);
        showSuccess("¡Eliminado!", "La promoción ha sido removida.");
        load();
    } catch (error: any) {
        showError("Error al eliminar", error.message);
    }
  };

  const handleToggleActivo = async (promo: Promocion) => {
    try {
      const payload = {
        titulo: promo.titulo,
        descripcion: promo.descripcion || null,
        tipo: promo.tipo,
        valor: promo.valor || 0,
        fechaInicio: promo.fechaInicio || null,
        fechaFin: promo.fechaFin || null,
        activo: !promo.activo,
        productoIds: promo.productoIds || [],
      };
      
      await updatePromocion(promo.id!, payload);
      showInfo(
        !promo.activo ? "Activada" : "Desactivada",
        `Promoción "${promo.titulo}" actualizada.`
      );
      await load();
    } catch (error: any) {
      showError("Error al cambiar estado", error.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Promociones" />

      <div className="space-y-6">
        <ComponentCard title="Gestión de Promociones">
          <button
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
            onMouseEnter={playClick}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Nueva Promoción
          </button>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <PromocionTable
              data={currentPromos}
              productos={productos}
              onEdit={(item) => {
                setEditing(item);
                setOpenModal(true);
              }}
              onDelete={handleDelete}
              onToggleActivo={handleToggleActivo}
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

      <PromocionForm
        isOpen={openModal}
        editing={editing}
        productos={productos}
        onSave={handleSave}
        onCancel={() => {
            setOpenModal(false);
            setEditing(null);
        }}
      />
    </>
  );
}
