import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
                default:
                    navigate("/");
            }
        })
        .catch(() => {
            // No hay usuario autenticado, no hacemos nada   
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
                default:
                    navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Credenciales invalidas");
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#ffffff", // Fondo blanco de toda la pantalla
                minHeight: "100vh", // Altura mínima para cubrir toda la pantalla
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <header style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "36px", color: "#000000", marginBottom: "10px" }}>Iniciar Sesión</h1>
                <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600", // Línea naranja
                        marginBottom: "20px",
                        width: "100%", // Línea que ocupa todo el ancho
                    }}
                />
            </header>
            <form
                onSubmit={handleLogin}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                    width: "100%",
                    maxWidth: "500px",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff", // Fondo blanco del formulario
                }}
            >
                <div style={{ width: "90%" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                            color: "#000000", // Texto negro
                        }}
                    >
                        Email:
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "#f0f0f0", // Fondo gris claro
                            color: "#000000", // Texto negro
                        }}
                    />
                </div>
                <div style={{ width: "90%" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "bold",
                            color: "#000000", // Texto negro
                        }}
                    >
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "#f0f0f0", // Fondo gris claro
                            color: "#000000", // Texto negro
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#007bff", // Botón azul
                        color: "white", // Texto blanco
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                >
                    Login
                </button>
            </form>
            {error && (
                <p style={{ color: "red", marginTop: "15px", fontWeight: "bold" }}>{error}</p>
            )}
        </div>
    );
}

export default Login;