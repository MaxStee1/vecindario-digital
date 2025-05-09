import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//pagina de registro

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [rol, setRol] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering with data: ", { name, email, password, rol });

        try {
            const response = await axios.post("http://localhost:3001/auth/register", {
                nombre: name,
                email,
                password,
                rol
            }, {
                headers: {
                    "Content-Type": "application/json"  // Asegúrate de incluir este header
                }
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Error al registrarse");
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
                <h1 style={{ fontSize: "36px", color: "#000000", marginBottom: "10px" }}>Registro</h1>
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
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                    <option value="">Selecciona un rol</option>
                    <option value='comprador'>Comprador</option>
                    <option value='locatario'>Locatario</option>
                </select>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}
export default Register;