import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem("token");
        // Redirigir al usuario a la página de login
        navigate("/");
    };

    return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default LogoutButton;