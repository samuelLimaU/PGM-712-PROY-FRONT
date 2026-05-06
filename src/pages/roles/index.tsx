import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import RolesTable from "./RolTable";
import RolForm from "./RolForm";
import { Rol } from "../../types/Rol";
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from "../../services/RolService";
import { showSuccess, showError, showConfirm } from "../../utils/sweetAlert";
import Pagination from "../../components/ui/Pagination";

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { playClick } = useSound();

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
      setCurrentPage(1);
    } catch (e: any) {
      showError("Error al cargar roles", e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // Lógica de Paginación
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);

  const handleSave = async (rol: Rol) => {
    try {
      if (editingRol) {
        await updateRol(editingRol.id!, rol);
        showSuccess("¡Actualizado!", "Rol actualizado correctamente");
      } else {
        await createRol(rol);
        showSuccess("¡Guardado!", "Nuevo rol creado correctamente");
      }

      setOpenModal(false);
      setEditingRol(null);
      loadRoles();
    } catch (e: any) {
      showError("Error al procesar rol", e.message);
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await showConfirm(
      "¿Eliminar rol?",
      "Ten en cuenta que esto podría afectar a los usuarios que tengan este rol asignado."
    );
    if (!isConfirmed) return;

    try {
      await deleteRol(id);
      showSuccess("¡Eliminado!", "El rol ha sido removido del sistema.");
      loadRoles();
    } catch (e: any) {
      showError("Error al eliminar rol", e.message);
    }
  };

  const handleNew = () => {
    setEditingRol(null);
    setOpenModal(true);
  };

  const handleEdit = (rol: Rol) => {
    setEditingRol(rol);
    setOpenModal(true);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Roles" />

      <div className="space-y-6">
        <ComponentCard title="Gestión de Roles">
          <button
            onMouseEnter={playClick}
            onClick={handleNew}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Nuevo Rol
          </button>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <RolesTable
              roles={currentRoles}
              onEdit={handleEdit}
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

      <RolForm
        isOpen={openModal}
        editingRol={editingRol}
        onCancel={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </>
  );
}
