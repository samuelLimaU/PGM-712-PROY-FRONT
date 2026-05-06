import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import UsuarioTable from "./UsuarioTable";
import UsuarioForm from "./UsuarioForm";
import { Usuario } from "../../types/Usuario";
import { createUsuarioRol, getUsuarioRoles, updateUsuarioRol } from "../../services/UsuarioRolService";
import { getRoles } from "../../services/RolService";
import { useSound } from "../../hooks/useSound";
import { showSuccess, showError, showConfirm } from "../../utils/sweetAlert";
import Pagination from "../../components/ui/Pagination";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../../services/usuarioService";

export default function UsuarioPage() {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { playClick } = useSound();

  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const load = async () => {
    try {
      setLoading(true);

      const [usuarios, usuarioRoles, roles] = await Promise.all([
        getUsuarios(),
        getUsuarioRoles(),
        getRoles(),
      ]);

      const rolMap = new Map(roles.map((r) => [r.id, r.nombre]));
      const usuarioRolMap = new Map(
        usuarioRoles.map((ur) => [ur.usuarioId, ur]),
      );

      const dataFinal = usuarios.map((u) => {
        const rel = usuarioRolMap.get(u.id!);

        return {
          ...u,
          rolId: rel?.rolId,
          usuarioRolId: rel?.id,
          rolNombre: rel ? rolMap.get(rel.rolId) : "Sin rol",
        };
      });

      setData(dataFinal);
      setCurrentPage(1);
    } catch (error: any) {
      showError("Error al cargar datos", error.message);
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

  const handleSave = async (item: any) => {
    try {
        if (editing) {
          await updateUsuario(editing.id!, item);
    
          if (item.rolId && item.usuarioRolId) {
            await updateUsuarioRol(
              item.usuarioRolId,
              editing.id!,
              item.rolId,
            );
          }
          showSuccess("¡Actualizado!", "Usuario actualizado con éxito");
        } else {
          const nuevoUsuario = await createUsuario(item);
    
          if (item.rolId) {
            await createUsuarioRol(nuevoUsuario.id!, item.rolId);
          }
          showSuccess("¡Guardado!", "Usuario creado correctamente");
        }
    
        await load();
    } catch (error: any) {
        showError("Error al procesar usuario", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await showConfirm(
        "¿Eliminar usuario?",
        "Esta acción quitará el acceso al sistema para este usuario."
    );
    if (!isConfirmed) return;

    try {
        await deleteUsuario(id);
        showSuccess("¡Eliminado!", "El usuario ha sido removido.");
        load();
    } catch (error: any) {
        showError("Error al eliminar", error.message);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Usuarios" />

      <div className="space-y-6">
        <ComponentCard title="Gestión de Usuarios">
          <button
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
            onMouseEnter={playClick}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Nuevo Usuario
          </button>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <UsuarioTable
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

      <UsuarioForm
        isOpen={openModal}
        editing={editing}
        onSave={async (data) => {
          await handleSave(data);
          setOpenModal(false);
        }}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
}
