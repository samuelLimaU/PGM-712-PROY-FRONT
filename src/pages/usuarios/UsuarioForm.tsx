import { useEffect, useState } from "react";
import { Usuario } from "../../types/Usuario";
import { getRoles } from "../../services/RolService";
import { Rol } from "../../types/Rol";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

interface Props {
  isOpen: boolean;
  onSave: (data: Usuario) => void;
  editing: Usuario | null;
  onCancel: () => void;
}

export default function UsuarioForm({
  isOpen,
  onSave,
  editing,
  onCancel,
}: Props) {
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

  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  const { playClick } = useSound();

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  useEffect(() => {
    if (editing) {
      setForm(editing);
      setRolId(editing.rolId);
    }
  }, [editing]);

  // controla mount/unmount
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimate(false);
    } else {
      setAnimate(false);

      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // CONTROL ANIMACION SEPARADO
  useEffect(() => {
    if (show && isOpen) {
      const timeout = setTimeout(() => {
        setAnimate(true);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [show, isOpen]);

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

  if (!show) return null;

  return (
    <div
      onClick={onCancel}
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg transform transition-all duration-300 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {editing ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>

          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
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
            className="input col-span-2"
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

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            {/* CANCELAR */}
            <button
              type="button"
              onMouseEnter={playClick}
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </button>

            {/* GUARDAR */}
            <button
              type="submit"
              onMouseEnter={playClick}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <CheckIcon className="w-5 h-5" />
              {editing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
