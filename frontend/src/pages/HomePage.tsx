import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                textAlign: "center",
                padding: "20px",
            }}
        >
            <header>
                <h1>Comercio Digital y Local</h1>
                <p>Compra y vende todo lo que quieras dentro de tu comunidad</p>
            </header>
            <main>
                <div style={{ marginBottom: "20px" }}>
                    <h2>¿Ya tienes una cuenta?</h2>
                    <p>Inicia sesión y empieza a comprar y vender</p>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            marginTop: "10px",
                            cursor: "pointer",
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </div>
                <div>
                    <h2>¿No tienes cuenta?</h2>
                    <p>Regístrate para acceder al comercio local</p>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            marginTop: "10px",
                            cursor: "pointer",
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