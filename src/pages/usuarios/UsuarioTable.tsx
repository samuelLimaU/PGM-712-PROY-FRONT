import { Usuario } from "../../types/Usuario";

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
            <th className="px-4 py-2">ID</th>
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
              <td className="px-4 py-2">{u.id}</td>
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

              <td className="px-4 py-2 flex justify-center gap-2">
                <button
                  onClick={() => onEdit(u)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(u.id!)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
