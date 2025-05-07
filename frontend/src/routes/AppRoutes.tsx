import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import HomePage from '../pages/HomePage';
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminPage from "../pages/AdminPage";
import LocatarioPage from "../pages/LocatarioPage";
import CompradorPage from "../pages/CompradorPage";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
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

            { /* Ruta para compradores */}
            <Route element={<ProtectedRoute allowedRoles={['comprador']} />}>
                <Route path="/comprador" element={< CompradorPage/>} />
            </Route>
            

        </Routes>
    );
};

export default AppRoutes;