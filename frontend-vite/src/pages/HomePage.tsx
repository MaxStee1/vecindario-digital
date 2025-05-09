import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                backgroundColor: "#ffffff", // Fondo blanco de toda la pantalla
                minHeight: "100vh", // Altura mínima para cubrir toda la pantalla
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <header style={{ marginBottom: "20px" }}>
                <h1 style={{ color: "#000000", marginBottom: "10px" }}>Comercio Digital y Local</h1>
                <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600", // Línea naranja
                        marginBottom: "20px",
                        width: "100%", // Línea que ocupa todo el ancho
                    }}
                />
                <p style={{ color: "#000000" }}>
                    Compra y vende todo lo que quieras dentro de tu comunidad
                </p>
            </header>
            <main>
                <div style={{ marginBottom: "20px" }}>
                    <h2 style={{ color: "#000000" }}>¿Ya tienes una cuenta?</h2>
                    <p style={{ color: "#000000" }}>Inicia sesión y empieza a comprar y vender</p>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "#007bff", // Botón azul
                            border: "none",
                            borderRadius: "4px",
                            color: "#ffffff", // Texto blanco
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </div>
                <div>
                    <h2 style={{ color: "#000000" }}>¿No tienes cuenta?</h2>
                    <p style={{ color: "#000000" }}>Regístrate para acceder al comercio local</p>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "#007bff", // Botón azul
                            border: "none",
                            borderRadius: "4px",
                            color: "#ffffff", // Texto blanco
                        }}
                    >
                        Registrarse
                    </button>
                </div>
            </main>
            <footer style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
                <p>&copy; 2023 Comercio Digital y Local. Todos los derechos reservados.</p>
                <p>
                    Desarrollado por <strong>Run mafia</strong>
                </p>
            </footer>
        </div>
    );
};

export default HomePage;