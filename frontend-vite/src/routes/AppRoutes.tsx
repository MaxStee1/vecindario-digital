import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import HomePage from '../pages/HomePage';
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminPage from "../pages/AdminPage";
import LocatarioPage from "../pages/LocatarioPage";
import PrincipalPage from "../pages/PrincipalPage";
import RepartidorPage from "../pages/RepartidorPage"; 
import CarritoPage from "../pages/CarritoPage";
import MisPedidosPage from "../pages/MisPedidosPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Ruta solo para el admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Ruta para locatarios */}
            <Route element={<ProtectedRoute allowedRoles={['locatario']} />}>
                <Route path="/locatario" element={<LocatarioPage />} />
            </Route>

            {/* Ruta para compradores */}
            <Route element={<ProtectedRoute allowedRoles={['comprador']} />}>
                <Route path="/shop" element={<PrincipalPage />} />
                <Route path="/carrito" element={<CarritoPage />} />
                <Route path="/mis-pedidos" element={<MisPedidosPage />} />
            </Route>

            {/* Ruta para repartidores */}
            <Route element={<ProtectedRoute allowedRoles={['repartidor']} />}>
                <Route path="/repartidor" element={<RepartidorPage />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;