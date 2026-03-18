import { Rol } from "../../types/Rol";

interface Props {
  roles: Rol[];
  onEdit: (rol: Rol) => void;
  onDelete: (id: number) => void;
}

export default function RolesTable({ roles, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-6 text-gray-500">
                No hay roles registrados
              </td>
            </tr>
          ) : (
            roles.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{rol.id}</td>
                <td className="px-6 py-3">{rol.nombre}</td>

                <td className="px-6 py-3 flex justify-center gap-2">
                  {/* EDITAR */}
                  <button
                    onClick={() => onEdit(rol)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>

                  {/* ELIMINAR */}
                  <button
                    onClick={() => onDelete(rol.id!)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}