import { useEffect, useState } from "react";
import { Usuario } from "../../types/Usuario";
import { getRoles } from "../../services/RolService";
import { Rol } from "../../types/Rol";

interface Props {
  onSave: (data: Usuario) => void;
  editing: Usuario | null;
  onCancel: () => void;
}

export default function UsuarioForm({ onSave, editing, onCancel }: Props) {
  const [form, setForm] = useState<Usuario>({
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    email: "",
    password: "",
    telefono: "",
    activo: true,
  });

  const [roles, setRoles] = useState<Rol[]>([]);
  const [rolId, setRolId] = useState<number | undefined>(undefined);

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (editing) {
      setForm(editing);
      setRolId(editing.rolId);
    }
  }, [editing]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...form,
      rolId: rolId,
    });
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">
        {editing ? "Editar Usuario" : "Nuevo Usuario"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="input"
        />
        <input
          name="nombre2"
          value={form.nombre2}
          onChange={handleChange}
          placeholder="Segundo Nombre"
          className="input"
        />

        <input
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
          className="input"
        />
        <input
          name="apellido2"
          value={form.apellido2}
          onChange={handleChange}
          placeholder="Segundo Apellido"
          className="input"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="input col-span-2"
        />

        <select
          value={rolId ?? ""}
          onChange={(e) =>
            setRolId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full px-3 py-2 border rounded-lg col-span-2"
        >
          <option value="" disabled>
            Seleccione un rol
          </option>

          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>

        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="input col-span-2"
        />

        <label className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
          Activo
        </label>

        <div className="col-span-2 flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Guardar
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
