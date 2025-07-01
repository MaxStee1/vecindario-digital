import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../services/api";
import { FaUserPlus, FaLock, FaEnvelope, FaUserTag } from "react-icons/fa";

const roles = [
    { label: "Comprador", value: "comprador" },
    { label: "Locatario", value: "locatario" },
    { label: "Repartidor", value: "repartidor" }
];

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [rol, setRol] = useState("");
    const toast = useRef<Toast>(null);

    const isValidGmail = (email: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    const isValidPassword = (password: string) => password.length >= 8;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidGmail(email)) {
            showError("El correo debe ser un Gmail válido (ejemplo@gmail.com)");
            return;
        }
        if (!isValidPassword(password)) {
            showError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            await api.post("/auth/register", {
                nombre: name,
                email,
                password,
                rol,
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Registro exitoso',
                detail: (
                    <div>
                        <span>¡Registro exitoso!</span>
                        <button
                            style={{
                                marginLeft: '1rem',
                                background: '#1976D2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.3rem 0.8rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Iniciar sesión
                        </button>
                    </div>
                ),
                life: 10000,
                closable: false
            });
        } catch (error) {
            console.error(error);
            showError("Error al registrarse");
        }
    };

    const showError = (message: string) => {
        toast.current?.clear();
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000, closable: false });
    };

    // Estilos para los inputs y el select
    const inputStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: 8,
        border: "1.5px solid #E3E7ED",
        fontSize: 16,
        marginBottom: 8,
        background: "#fff",
        color: "#222",
        outline: "none",
        transition: "border-color 0.2s"
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        background: "#fff",
        color: "#222",
        cursor: "pointer"
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
                    <FaUserPlus size={38} color="#1976D2" style={{ marginBottom: 8 }} />
                    <h2 style={{
                        color: "#1976D2",
                        fontWeight: 800,
                        fontSize: "2rem",
                        margin: 0,
                        letterSpacing: "1px"
                    }}>Registro</h2>
                    <hr style={{ border: "none", borderTop: "2px solid #1976D2", width: "60px", margin: "12px auto 0 auto" }} />
                </div>
                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <label style={{ fontWeight: 600, color: "#222", marginBottom: 4 }}>
                        <FaUserTag style={{ marginRight: 8, color: "#43A047" }} />
                        Nombre Completo
                    </label>
                    <input
                        style={inputStyle}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Tu nombre completo"
                    />

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
                        placeholder="Mínimo 8 caracteres"
                    />

                    <label style={{ fontWeight: 600, color: "#222", marginBottom: 4 }}>
                        <FaUserTag style={{ marginRight: 8, color: "#43A047" }} />
                        Rol
                    </label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                        style={selectStyle}
                    >
                        <option value="" style={{ color: "#888" }}>Selecciona un rol</option>
                        {roles.map(r => (
                            <option key={r.value} value={r.value} style={{ color: "#222", background: "#fff" }}>
                                {r.label}
                            </option>
                        ))}
                    </select>

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
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;