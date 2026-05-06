import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Pagination from "../../components/ui/Pagination";
import { ArrowRightIcon, BoltIcon, ShootingStarIcon } from "../../icons";
import { http } from "../../services/httpClient";

interface AprioriRule {
  antecedente: string[];
  consecuente: string[];
  soporte: number;
  confianza: number;
  lift: number;
}

export default function AnalisisAprioriPage() {
  const [reglas, setReglas] = useState<AprioriRule[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchReglas = async () => {
    try {
      setLoading(true);
      
      const response = await http.get(
        "http://localhost:8080/api/analisis/apriori?support=0.15&confidence=0.7"
      );
      
      if (response.ok) {
        const data = await response.json();
        setReglas(data);
      } else {
        console.error("Error en la respuesta de la API:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar las reglas Apriori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReglas();
  }, []);

  // Lógica de Paginación
  const totalPages = Math.ceil(reglas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReglas = reglas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <PageBreadcrumb pageTitle="Estimación de Pedidos" />

      <div className="space-y-6">
        <ComponentCard title="Análisis de Cesta de Compra (Apriori)">
          <div className="mb-6">
            <p className="text-gray-500 text-sm">
              Este análisis identifica patrones de compra frecuentes basándose en el historial de pedidos. 
              Ayuda a entender qué productos suelen comprarse juntos para crear promociones estratégicas.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentReglas.length > 0 ? (
                currentReglas.map((regla, index) => (
                  <div 
                    key={index} 
                    className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                        <ShootingStarIcon className="w-4 h-4" />
                        LIFT: {regla.lift.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        Confianza: {(regla.confianza * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-4">
                      <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center font-semibold text-gray-800">
                        {regla.antecedente.join(", ")}
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRightIcon className="w-6 h-6 text-gray-300" />
                        <span className="text-[10px] text-gray-400 uppercase mt-1">Sugiere</span>
                      </div>

                      <div className="flex-1 p-3 bg-green-50 rounded-xl border border-green-100 text-center font-semibold text-green-700">
                        {regla.consecuente.join(", ")}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center">
                      <div className="text-xs text-gray-500">
                        Soporte: {(regla.soporte * 100).toFixed(1)}% de pedidos
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-400 italic">
                  No se encontraron asociaciones significativas con los filtros actuales.
                </div>
              )}
            </div>
          )}
        </ComponentCard>

        {/* Paginación */}
        {reglas.length > itemsPerPage && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 bg-gray-50 font-medium"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>reglas por página</span>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
