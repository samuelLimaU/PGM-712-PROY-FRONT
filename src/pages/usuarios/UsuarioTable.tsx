import { Usuario } from "../../types/Usuario";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

const { playClick } = useSound();

interface Props {
  data: Usuario[];
  onEdit: (item: Usuario) => void;
  onDelete: (id: number) => void;
}

export default function UsuarioTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            <th className="px-4 py-2">Nombre Completo</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Activo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-2">
                {u.nombre} {u.nombre2} {u.apellido} {u.apellido2}
              </td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {u.rolNombre}
                </span>
              </td>
              <td className="px-4 py-2">{u.telefono}</td>
              <td className="px-4 py-2">{u.activo ? "Sí" : "No"}</td>

              <td className="px-4 py-2">
                <div className="flex items-center justify-center gap-3">
                  {/* EDITAR */}
                  <div className="relative group">
                    <button
                      onMouseEnter={playClick}
                      onClick={() => onEdit(u)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition hover:scale-110"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                    {/* TOOLTIP */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      Editar
                    </span>
                  </div>

                  {/* ELIMINAR */}
                  <div className="relative group">
                    <button
                      onMouseEnter={playClick}
                      onClick={() => onDelete(u.id!)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition hover:scale-110"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>

                    {/* TOOLTIP */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      Eliminar
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
