import { Rol } from "../../types/Rol";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

const { playClick } = useSound();

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
                <td className="px-6 py-3">{rol.nombre}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-center gap-3">
                    {/* EDITAR */}
                    <div className="relative group">
                      <button
                        onMouseEnter={playClick}
                        onClick={() => onEdit(rol)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Editar
                      </span>
                    </div>

                    {/* ELIMINAR */}
                    <div className="relative group">
                      <button
                        onMouseEnter={playClick}
                        onClick={() => onDelete(rol.id!)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                        Eliminar
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
