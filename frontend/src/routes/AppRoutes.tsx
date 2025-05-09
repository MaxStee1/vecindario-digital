import { Routes, Route } from "react-router-dom";
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/locatario" element={<LocatarioPage />} />
            <Route path="/comprador" element={<CompradorPage />} />
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
};

export default AppRoutes;