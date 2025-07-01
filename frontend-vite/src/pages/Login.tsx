import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../services/api";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef<Toast>(null);

    useEffect(() => {
        api.get('/auth/me')
            .then(res => {
                const user = res.data;
                switch (user.rol) {
                    case "admin":
                        navigate("/admin");
                        break;
                    case "locatario":
                        navigate("/locatario");
                        break;
                    case "comprador":
                        navigate("/shop");
                        break;
                    case "repartidor":
                        navigate("/repartidor");
                        break;
                    default:
                        navigate("/");
                }
            })
            .catch(() => {
                // No session, stay on login
            });
    }, [navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const user = response.data;

            switch (user.rol) {
                case "admin":
                    navigate("/admin");
                    break;
                case "locatario":
                    navigate("/locatario");
                    break;
                case "comprador":
                    navigate("/shop");
                    break;
                case "repartidor":
                    navigate("/repartidor");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            showError("Credenciales Incorrectas");
        }
    };

    const showError = (message: string) => {
        toast.current?.clear();
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000, closable: false });
    }

    // Estilos para inputs y botón
    const inputStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: 8,
        border: "1.5px solid #E3E7ED",
        fontSize: 16,
        marginBottom: 8,
        background: "#fff",
        color: "#222",
        outline: "none",
        width: "100%",
        transition: "border-color 0.2s"
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F8FAFC",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, Arial, sans-serif"
        }}>
            <Toast ref={toast} />
            <div style={{
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
                padding: "40px 32px 32px 32px",
                minWidth: 340,
                maxWidth: 400,
                width: "100%"
            }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <FaSignInAlt size={38} color="#1976D2" style={{ marginBottom: 8 }} />
                    <h2 style={{
                        color: "#1976D2",
                        fontWeight: 800,
                        fontSize: "2rem",
                        margin: 0,
                        letterSpacing: "1px"
                    }}>Iniciar Sesión</h2>
                    <hr style={{ border: "none", borderTop: "2px solid #1976D2", width: "60px", margin: "12px auto 0 auto" }} />
                </div>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <label style={{ fontWeight: 600, color: "#222", marginBottom: 4 }}>
                        <FaEnvelope style={{ marginRight: 8, color: "#1976D2" }} />
                        Email
                    </label>
                    <input
                        style={inputStyle}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ejemplo@gmail.com"
                    />

                    <label style={{ fontWeight: 600, color: "#222", marginBottom: 4 }}>
                        <FaLock style={{ marginRight: 8, color: "#FFA726" }} />
                        Contraseña
                    </label>
                    <input
                        style={inputStyle}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Tu contraseña"
                    />

                    <button
                        type="submit"
                        style={{
                            marginTop: 12,
                            background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 18,
                            padding: "12px 0",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px #1976D244"
                        }}
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;