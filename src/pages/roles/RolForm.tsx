  import { useEffect, useState } from "react";
  import { Rol } from "../../types/Rol";
  import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
  import { useSound } from "../../hooks/useSound";

  interface Props {
    isOpen: boolean;
    onSave: (rol: Rol) => void;
    editingRol: Rol | null;
    onCancel: () => void;
  }

  export default function RolModal({
    isOpen,
    onSave,
    editingRol,
    onCancel,
  }: Props) {
    const [nombre, setNombre] = useState("");
    const { playClick } = useSound();
    const [show, setShow] = useState(isOpen);
    const [animate, setAnimate] = useState(false);

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

    useEffect(() => {
      if (show && isOpen) {
        const timeout = setTimeout(() => {
          setAnimate(true);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }, [show, isOpen]);

    useEffect(() => {
      if (editingRol) {
        setNombre(editingRol.nombre);
      } else {
        setNombre("");
      }
    }, [editingRol]);

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!nombre.trim()) {
        alert("El nombre es obligatorio");
        return;
      }

      onSave({ nombre });
      setNombre("");
    };

    return (
      <div
        onClick={onCancel}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-lg transform transition-all duration-300 ${
            animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingRol ? "Editar Rol" : "Nuevo Rol"}
            </h2>
            <button
              onClick={onCancel}
              onMouseEnter={playClick}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* FOOTER */}
            <div className="flex justify-end gap-2 pt-2">
              {/* CANCELAR */}
              <button
                type="button"
                onClick={onCancel}
                onMouseEnter={playClick}
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancelar
              </button>

              {/* GUARDAR */}
              <button
                type="submit"
                onMouseEnter={playClick}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                <CheckIcon className="w-5 h-5" />
                {editingRol ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
