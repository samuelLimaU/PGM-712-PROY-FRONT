import { useEffect, useState, useRef } from "react";
import { Producto } from "../../types/Producto";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "../../hooks/useSound";

interface Props {
  isOpen: boolean;
  editing: Producto | null;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductoForm({
  isOpen,
  editing,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const { playClick } = useSound();

  // Igual que tu patrón de animación
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimate(false);
    } else {
      setAnimate(false);
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (show && isOpen) {
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    }
  }, [show, isOpen]);

  // Cargar datos al editar
  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre ?? "",
        descripcion: editing.descripcion ?? "",
        precio: String(editing.precio ?? ""),
        stock: String(editing.stock ?? ""),
      });
      setPreview(
        editing.imagenUrl ? `http://localhost:8080${editing.imagenUrl}` : null,
      );
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
      });
      setImagenFile(null);
      setPreview(null);
    }
  }, [editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagenFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("precio", form.precio);
    formData.append("stock", form.stock);
    if (imagenFile) {
      formData.append("imagen", imagenFile);
    }

    await onSave(formData);
  };

  if (!show) return null;

  return (
    <div
      onClick={onCancel}
      className={`fixed inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 z-50 ${
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
            {editing ? "Editar Producto" : "Nuevo Producto"}
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
            required
            className="input col-span-2"
          />

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción (opcional)"
            rows={2}
            className="input col-span-2 resize-none"
          />

          <input
            name="precio"
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio"
            required
            className="input"
          />

          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
            className="input"
          />

          {/* Upload imagen */}
          <div className="col-span-2">
            <label className="block text-sm text-gray-500 mb-1">
              Imagen del producto (opcional)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImagen}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-2 relative w-fit">
                <img
                  src={preview}
                  alt="preview"
                  className="h-28 w-28 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setImagenFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onMouseEnter={playClick}
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </button>

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
