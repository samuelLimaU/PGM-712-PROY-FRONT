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

export default function PromocionPage() {
  const [data, setData] = useState<Promocion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Promocion | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { playClick } = useSound();

  const load = async () => {
    try {
      setLoading(true);
      const [promos, prods] = await Promise.all([getPromociones(), getProductos()]);
      setData(promos);
      setProductos(prods);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (formData: any) => {
    try {
        // Limpiamos el payload para el backend
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
      // Re-mapeamos para asegurar que el payload sea idéntico al que espera el DTO
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
              data={data}
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
