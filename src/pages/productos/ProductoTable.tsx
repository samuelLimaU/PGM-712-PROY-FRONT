import { Producto } from "../../types/Producto";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

interface Props {
  data: Producto[];
  onEdit: (item: Producto) => void;
  onDelete: (id: number) => void;
}

export default function ProductoTable({ data, onEdit, onDelete }: Props) {
  const { playClick } = useSound();
console.log("datos productos:", data);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            <th className="px-4 py-2">Imagen</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Activo</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="border-t">

              {/* Imagen */}
              <td className="px-4 py-2">
                {p.imagenUrl ? (
                  <img
                    src={`http://localhost:8080${p.imagenUrl}`}
                    alt={p.nombre}
                    className="h-12 w-12 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                    Sin img
                  </div>
                )}
              </td>

              <td className="px-4 py-2 font-medium">{p.nombre}</td>
              <td className="px-4 py-2 text-gray-500 max-w-xs truncate">{p.descripcion ?? "—"}</td>
              <td className="px-4 py-2">Bs. {Number(p.precio).toFixed(2)}</td>
              <td className="px-4 py-2">{p.stock} unidades</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-xs rounded ${p.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {p.activo ? "Sí" : "No"}
                </span>
              </td>

              <td className="px-4 py-2">
                <div className="flex items-center justify-center gap-3">
                  <div className="relative group">
                    <button
                      onMouseEnter={playClick}
                      onClick={() => onEdit(p)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition hover:scale-110"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      Editar
                    </span>
                  </div>

                  <div className="relative group">
                    <button
                      onMouseEnter={playClick}
                      onClick={() => onDelete(p.id!)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition hover:scale-110"
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
          ))}
        </tbody>
      </table>
    </div>
  );
}