import { useEffect, useState } from "react";
import { useSound } from "../../hooks/useSound";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import RolesTable from "./RolTable";
import RolForm from "./RolForm"; //

import { Rol } from "../../types/Rol";
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
} from "../../services/RolService";

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
    } catch (e) {
      console.error(e);
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
      } else {
        await createRol(rol);
      }

      setOpenModal(false);
      setEditingRol(null);
      loadRoles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar rol?")) return;

    try {
      await deleteRol(id);
      loadRoles();
    } catch (e) {
      console.error(e);
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

      {/* 🔥 MODAL (RolForm ahora es modal) */}
      <RolForm
        isOpen={openModal}
        editingRol={editingRol}
        onCancel={() => setOpenModal(false)}
        onSave={handleSave}
      />
    </>
  );
}
