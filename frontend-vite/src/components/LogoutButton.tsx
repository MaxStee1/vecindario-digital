import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LogoutButton = () => {
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignorar error
        }
        navigate("/");
    };

    return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default LogoutButton;