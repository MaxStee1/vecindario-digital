import { Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage';
import Login from "../pages/Login";
import Register from "../pages/Register";
import LocatarioDashboard from "../pages/LocatarioDashboard";
import AdminDashboard from "../pages/AdminDashboard";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/locatario" element={<LocatarioDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
};

export default AppRoutes;