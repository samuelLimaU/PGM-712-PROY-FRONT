import { useEffect, useState } from "react";
import { Rol } from "../../types/Rol";

interface Props {
  onSave: (rol: Rol) => void;
  editingRol: Rol | null;
  onCancel: () => void;
}

export default function RolForm({ onSave, editingRol, onCancel }: Props) {
  const [nombre, setNombre] = useState("");

  // 🔄 Cargar datos si estamos editando
  useEffect(() => {
    if (editingRol) {
      setNombre(editingRol.nombre);
    } else {
      setNombre("");
    }
  }, [editingRol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    onSave({ nombre });
    setNombre(""); // limpiar
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">
        {editingRol ? "Editar Rol" : "Nuevo Rol"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* INPUT NOMBRE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Rol
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Ej: ADMIN, USER..."
          />
        </div>

        {/* BOTONES */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingRol ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}