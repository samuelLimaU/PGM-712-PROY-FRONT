import { useEffect, useState } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { getUsuarios } from "../../services/usuarioService";
import { getProductos } from "../../services/ProductoService";
import { getUsuarioRoles } from "../../services/UsuarioRolService";
import { getRoles } from "../../services/RolService";

export default function Home() {
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [personalCount, setPersonalCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usuarios, productos, usuarioRoles, roles] = await Promise.all([
          getUsuarios(),
          getProductos(),
          getUsuarioRoles(),
          getRoles()
        ]);

        // Mapear roles para fácil búsqueda
        const rolMap = new Map(roles.map((r) => [r.id, r.nombre]));
        // Mapear relación usuario-rol
        const usuarioRolMap = new Map(usuarioRoles.map((ur) => [ur.usuarioId, ur.rolId]));
        
        // Filtrar Clientes
        const clientesOnly = usuarios.filter(u => {
          const rolId = usuarioRolMap.get(u.id!);
          const rolNombre = (rolId ? rolMap.get(rolId) : "")?.toLowerCase() || "";
          return rolNombre === "cliente" || rolNombre === "role_cliente";
        });

        // Filtrar Personal (Administrador o Cajero)
        const personalOnly = usuarios.filter(u => {
          const rolId = usuarioRolMap.get(u.id!);
          const rolNombre = (rolId ? rolMap.get(rolId) : "")?.toLowerCase() || "";
          return rolNombre === "administrador" || 
                 rolNombre === "role_administrador" ||
                 rolNombre === "cajero" ||
                 rolNombre === "role_cajero";
        });
        
        setClientesCount(clientesOnly.length);
        setProductosCount(productos.length);
        setPersonalCount(personalOnly.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <PageMeta
        title="Dashboard | Salteñería La Cruceña"
        description="Panel administrativo de Salteñería La Cruceña"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          {/* Métricas con datos reales */}
          <EcommerceMetrics 
            clientesCount={clientesCount} 
            productosCount={productosCount} 
            personalCount={personalCount}
          />

          {/* Gráfico de ventas (vacio por ahora) */}
          <MonthlySalesChart series={[]} />
        </div>

        <div className="col-span-12">
          {/* Estadísticas (vacio por ahora) */}
          <StatisticsChart series={[]} />
        </div>

        {/* Secciones ocultas hasta tener datos de pedidos/demografía */}
        {/* 
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> 
        */}
      </div>
    </>
  );
}
