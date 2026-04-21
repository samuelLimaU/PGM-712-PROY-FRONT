import { Promocion } from "../../types/Promocion";
import { Producto } from "../../types/Producto";

interface Props {
  data: Promocion[];
  productos: Producto[];
  onEdit: (promo: Promocion) => void;
  onDelete: (id: number) => void;
  onToggleActivo: (promo: Promocion) => void;
}

export default function PromocionTable({ data, productos, onEdit, onDelete, onToggleActivo }: Props) {
  const getProductNames = (ids: number[]) => {
    if (!ids || ids.length === 0) return "Global / Sin productos";
    return productos
      .filter((p) => ids.includes(p.id!))
      .map((p) => p.nombre)
      .join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-boxdark">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="py-4 px-4 font-medium text-black dark:text-white">Título</th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">Tipo / Valor</th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">Productos Aplicables</th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">Vigencia</th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">Estado</th>
            <th className="py-4 px-4 font-medium text-black dark:text-white text-right pr-10">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((promo) => (
            <tr key={promo.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
              <td className="py-5 px-4">
                <h5 className="font-bold text-black dark:text-white uppercase text-xs mb-1 tracking-wider">{promo.titulo}</h5>
                <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">{promo.descripcion}</p>
              </td>
              <td className="py-5 px-4">
                 <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-400 uppercase">{promo.tipo.replace("_", " ")}</span>
                    <span className="text-black dark:text-white font-medium">
                        {promo.valor ? (promo.tipo === "DESCUENTO_PORCENTAJE" ? `${promo.valor}%` : `Bs. ${promo.valor}`) : "-"}
                    </span>
                 </div>
              </td>
              <td className="py-5 px-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 italic max-w-[250px] truncate" title={getProductNames(promo.productoIds || [])}>
                    {getProductNames(promo.productoIds || [])}
                </div>
              </td>
              <td className="py-5 px-4 text-xs">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase w-6">Ini:</span>
                        <span className="text-black dark:text-white">{promo.fechaInicio || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase w-6">Fin:</span>
                        <span className="text-black dark:text-white">{promo.fechaFin || "N/A"}</span>
                    </div>
                </div>
              </td>
              <td className="py-5 px-4">
                <button
                  onClick={() => onToggleActivo(promo)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 ${
                    promo.activo
                      ? "bg-success/10 text-success border border-success/20 hover:bg-success hover:text-white"
                      : "bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white"
                  }`}
                >
                  {promo.activo ? "Activa" : "Inactiva"}
                </button>
              </td>
              <td className="py-5 px-4">
                <div className="flex items-center justify-end space-x-3.5 pr-6">
                  <button
                    onClick={() => onEdit(promo)}
                    className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                    title="Editar"
                  >
                    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                      <path d="M16.2998 6.52504L11.4748 1.70004C11.1748 1.40004 10.7498 1.40004 10.4498 1.70004L1.8498 10.3C1.7248 10.425 1.6248 10.55 1.5748 10.7L0.424805 16.125C0.349805 16.45 0.449805 16.775 0.699805 17.025C0.899805 17.225 1.1498 17.325 1.4248 17.325C1.4998 17.325 1.5748 17.325 1.6498 17.3L7.0748 16.15C7.2248 16.1 7.3498 16 7.4748 15.875L16.2998 7.05004C16.5998 6.87504 16.5998 6.52504 16.2998 6.52504ZM6.7498 14.825L2.5748 15.725L3.4748 11.55L10.3998 4.62504L13.6748 7.90004L6.7498 14.825ZM14.7248 6.85004L13.8248 7.75004L10.5498 4.47504L11.4498 3.57504L14.7248 6.85004Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(promo.id!)}
                    className="p-2 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors"
                    title="Eliminar"
                  >
                    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                      <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.75315V3.9094C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM12.5723 15.4125C12.5441 16.0313 12.0379 16.5094 11.4191 16.5094H6.55352C5.93477 16.5094 5.42852 16.0313 5.40039 15.4125L4.95039 6.13127H13.0504L12.5723 15.4125Z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
