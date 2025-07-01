import { useNavigate } from "react-router-dom";
import { FaStore, FaUserPlus, FaSignInAlt } from "react-icons/fa";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                background: "linear-gradient(120deg, #F8FAFC 60%, #E3F2FD 100%)",
                minHeight: "100vh",
                padding: "0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Inter, Arial, sans-serif"
            }}
        >
            <header style={{
                marginBottom: "32px",
                width: "100%",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
                padding: "2.5rem 0 1.5rem 0"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <FaStore size={48} color="#fff" style={{ marginBottom: 8 }} />
                    <h1 style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "2.5rem",
                        margin: 0,
                        letterSpacing: "1px"
                    }}>
                        Comercio Digital y Local
                    </h1>
                    <hr
                        style={{
                            border: "none",
                            height: "2px",
                            backgroundColor: "#FFD600",
                            margin: "18px auto 0 auto",
                            width: "80px"
                        }}
                    />
                    <p style={{
                        color: "#fff",
                        fontSize: "1.15rem",
                        marginTop: 18,
                        marginBottom: 0,
                        fontWeight: 500
                    }}>
                        Compra y vende todo lo que quieras dentro de tu comunidad
                    </p>
                </div>
            </header>
            <main style={{
                display: "flex",
                flexDirection: "row",
                gap: "40px",
                marginTop: "32px",
                marginBottom: "32px"
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    padding: "36px 32px",
                    minWidth: 280,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <FaSignInAlt size={32} color="#1976D2" style={{ marginBottom: 12 }} />
                    <h2 style={{ color: "#1976D2", marginBottom: 8, fontWeight: 700 }}>¿Ya tienes una cuenta?</h2>
                    <p style={{ color: "#222", marginBottom: 18 }}>Inicia sesión y empieza a comprar y vender</p>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            padding: "12px 28px",
                            fontSize: "17px",
                            marginTop: "10px",
                            cursor: "pointer",
                            background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                            fontWeight: 700,
                            boxShadow: "0 2px 8px #1976D244",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}
                    >
                        <FaSignInAlt style={{ marginRight: 6 }} />
                        Iniciar Sesión
                    </button>
                </div>
                <div style={{
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    padding: "36px 32px",
                    minWidth: 280,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <FaUserPlus size={32} color="#43A047" style={{ marginBottom: 12 }} />
                    <h2 style={{ color: "#43A047", marginBottom: 8, fontWeight: 700 }}>¿No tienes cuenta?</h2>
                    <p style={{ color: "#222", marginBottom: 18 }}>Regístrate para acceder al comercio local</p>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            padding: "12px 28px",
                            fontSize: "17px",
                            marginTop: "10px",
                            cursor: "pointer",
                            background: "linear-gradient(90deg, #43A047 60%, #1976D2 100%)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                            fontWeight: 700,
                            boxShadow: "0 2px 8px #43A04744",
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}
                    >
                        <FaUserPlus style={{ marginRight: 6 }} />
                        Registrarse
                    </button>
                </div>
            </main>
            <footer style={{
                marginTop: "auto",
                fontSize: "15px",
                color: "#666",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                colorScheme: "light",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                width: "100%",
                padding: "1.2rem 0 0.5rem 0",
                textAlign: "center"
            }}>
                <p style={{ color: "#fff", margin: 0 }}>&copy; {new Date().getFullYear()} Comercio Digital y Local. Todos los derechos reservados.</p>
                <p style={{ color: "#fff", margin: 0 }}>
                    Desarrollado por <strong>Run mafia</strong>
                </p>
            </footer>
        </div>
    );
};

export default HomePage;