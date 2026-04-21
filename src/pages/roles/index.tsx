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

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (e: any) {
      showError("Error al cargar roles", e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

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

  useEffect(() => {
    loadRoles();
  }, []);

  const { playClick } = useSound();
  
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
              roles={roles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </ComponentCard>
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
