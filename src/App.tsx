import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Usuarios from "./pages/usuarios";
import Roles from "./pages/roles";
import Pedidos from "./pages/pedidos";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Producto from "./pages/productos";
import AnalisisApriori from "./pages/pedidos/AnalisisApriori";
import { CarritoProvider } from "./pages/tienda/context/CarritoContext";
import CatalogoPage from "./pages/tienda/";
import CheckoutPage from "./pages/tienda/CheckoutPage";
import Promocion from "./pages/promociones";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/tienda" replace />} />

          {/* PROTEGIDO */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/productos" element={<Producto />} />
              <Route path="/promociones" element={<Promocion />} />
              <Route path="/estimacion" element={<AnalisisApriori />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/form-elements" element={<FormElements />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>
          </Route>

          {/* PÚBLICO — auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* PÚBLICO — tienda (CarritoProvider como layout wrapper) */}
          <Route
            element={
              <CarritoProvider>
                <Outlet />
              </CarritoProvider>
            }
          >
            <Route path="/tienda" element={<CatalogoPage />} />
            <Route path="/tienda/checkout" element={<CheckoutPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}