import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Funcion para manejar el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // POST a la api con axios
            const response = await axios.post("http://localhost:3001/api/auth/login", {
                email,
                password,
            });
            // Guardar el token en el localStorage
            const token = response.data.token;
            localStorage.setItem("token", response.data.token);

            const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        // Redirigir según el rol
        if (role === "ADMIN") {
            navigate("/admin");
        } else if (role === "LOCATARIO") {
            navigate("/locatario");
        } else if (role === "COMPRADOR") {
            navigate("/comprador");
        } else {
            navigate("/"); // Redirigir a una página por defecto
        }
        } catch (err) {
            setError("Credenciales incorrectas. Por favor, intente de nuevo.");
        }  
    };

    return (
        <div>
            <header>
                <h2>Iniciar Sesion</h2>
            </header>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div id="login-form">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Iniciar Sesion</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;