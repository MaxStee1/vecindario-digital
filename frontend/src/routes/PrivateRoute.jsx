import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas, verifica si hay un token
const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirige a la página de inicio de sesión
    if (!token) {
        return <Navigate to="/" />;
    }

    return element;
};

export default PrivateRoute;