import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";

import UsuarioTable from "./UsuarioTable";
import UsuarioForm from "./UsuarioForm";

import { Usuario } from "../../types/Usuario";
import { createUsuarioRol } from "../../services/UsuarioRolService";
import { getUsuarioRoles } from "../../services/UsuarioRolService";
import { getRoles } from "../../services/RolService";
import { updateUsuarioRol } from "../../services/UsuarioRolService";

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
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const [usuarios, usuarioRoles, roles] = await Promise.all([
        getUsuarios(),
        getUsuarioRoles(),
        getRoles(),
      ]);

      console.log("USUARIOS:", usuarios);
      console.log("USUARIO-ROL:", usuarioRoles);
      console.log("ROLES:", roles);

      const rolMap = new Map(roles.map((r) => [r.id, r.nombre]));
      const usuarioRolMap = new Map(
        usuarioRoles.map((ur) => [ur.usuarioId, ur]),
      );
      const dataFinal = usuarios.map((u) => {
        const rel = usuarioRolMap.get(u.id!);

        return {
          ...u,
          rolId: rel?.rolId,
          usuarioRolId: rel?.id, // 🔥 ESTE ES CLAVE
          rolNombre: rel ? rolMap.get(rel.rolId) : "Sin rol",
        };
      });

      console.log("DATA FINAL:", dataFinal);

      setData(dataFinal);
    } catch (error) {
      console.error("ERROR EN LOAD:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleSave = async (item: any) => {
    console.log("ITEM FORM:", item);

    if (editing) {
      console.log("ACTUALIZANDO:", editing.id);

      await updateUsuario(editing.id!, item);

      if (item.rolId && item.usuarioRolId) {
        console.log("ACTUALIZANDO ROL:", editing.id, item.rolId);

        await updateUsuarioRol(
          item.usuarioRolId, // id de la relación
          editing.id!, // usuarioId
          item.rolId, // nuevo rol
        );
      }
    } else {
      const nuevoUsuario = await createUsuario(item);

      console.log("USUARIO CREADO:", nuevoUsuario);

      if (item.rolId) {
        console.log("CREANDO RELACION:", nuevoUsuario.id, item.rolId);

        await createUsuarioRol(nuevoUsuario.id!, item.rolId);
      }
    }

    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await deleteUsuario(id);
    load();
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Usuarios" />

      <div className="space-y-6">
        <ComponentCard title="Gestión de Usuarios">
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Nuevo Usuario
          </button>

          {showForm && (
            <UsuarioForm
              onSave={handleSave}
              editing={editing}
              onCancel={() => setShowForm(false)}
            />
          )}

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <UsuarioTable
              data={data}
              onEdit={(item) => {
                setEditing(item);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
