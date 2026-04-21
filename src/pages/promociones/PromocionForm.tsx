import React, { useEffect, useState } from "react";
import { Promocion } from "../../types/Promocion";
import { Producto } from "../../types/Producto";
import { useSound } from "../../hooks/useSound";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  isOpen: boolean;
  editing: Promocion | null;
  productos: Producto[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function PromocionForm({ isOpen, editing, productos, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "BANNER",
    valor: 0,
    fechaInicio: "",
    fechaFin: "",
    activo: true,
    productoIds: [] as number[],
  });

  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const { playClick } = useSound();

  useEffect(() => {
    if (editing) {
      setFormData({
        titulo: editing.titulo || "",
        descripcion: editing.descripcion || "",
        tipo: editing.tipo || "BANNER",
        valor: editing.valor || 0,
        fechaInicio: editing.fechaInicio || "",
        fechaFin: editing.fechaFin || "",
        activo: editing.activo ?? true,
        productoIds: editing.productoIds || [],
      });
    } else {
      setFormData({
        titulo: "",
        descripcion: "",
        tipo: "BANNER",
        valor: 0,
        fechaInicio: "",
        fechaFin: "",
        activo: true,
        productoIds: [],
      });
    }
  }, [editing, isOpen]);

  // Manejo de visibilidad y animación igual que UsuarioForm
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimate(false);
      const timeout = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setAnimate(false);
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleProducto = (id: number) => {
    setFormData(prev => ({
      ...prev,
      productoIds: prev.productoIds.includes(id)
        ? prev.productoIds.filter(pid => pid !== id)
        : [...prev.productoIds, id]
    }));
  };

  if (!show) return null;

  return (
    <div
      onClick={onCancel}
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-lg transform transition-all duration-300 dark:bg-boxdark ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {editing ? "Editar Promoción" : "Nueva Promoción"}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2.5 block text-black dark:text-white font-medium">Título</label>
            <input
              type="text"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white font-medium">Descripción</label>
            <textarea
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white font-medium">Tipo</label>
              <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="BANNER">BANNER (Solo imagen)</option>
                <option value="DESCUENTO_PORCENTAJE">Descuento (%)</option>
                <option value="DESCUENTO_FIJO">Descuento Fijo (Bs.)</option>
              </select>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white font-medium">Valor</label>
              <input
                type="number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                disabled={formData.tipo === "BANNER"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white font-medium">Fecha Inicio</label>
              <input
                type="date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white font-medium">Fecha Fin</label>
              <input
                type="date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                value={formData.fechaFin}
                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2.5 block text-black dark:text-white font-medium">Productos Aplicables</label>
            <div className="max-h-40 overflow-y-auto border border-stroke p-3 rounded dark:border-strokedark">
              {productos.map(p => (
                <label key={p.id} className="flex items-center space-x-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.productoIds.includes(p.id!)}
                    onChange={() => toggleProducto(p.id!)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-black dark:text-white">{p.nombre} (Bs. {p.precio})</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            />
            <span className="text-black dark:text-white font-medium">Activo</span>
          </label>

          <div className="flex justify-end gap-3 mt-6">
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
