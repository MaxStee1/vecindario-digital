import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "../utils/auth";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : null;

    if(!user) {
        return <Navigate to="/login" replace />;
    }

    if(!allowedRoles.includes(user.rol)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;