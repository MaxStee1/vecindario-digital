import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignorar error
        }
        navigate("/");
    };

        return (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <button
                onClick={handleLogout}
                style={{
                    background: "linear-gradient(90deg, #E53935 60%, #FFA726 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    margin: "12px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 2px 8px #E5393522"
                }}
            >
                <FiLogOut size={20} />
                Cerrar Sesión
            </button>
        </div>
    );
};

export default LogoutButton;