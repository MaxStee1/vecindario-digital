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
            localStorage.setItem("token", response.data.token);
            
            navigate("/")
        } catch (err) {
            setError("Credenciales incorrectas. Por favor, intente de nuevo.");
        }  
    };

    return (
        <div>
            <h2>Iniciar Sesion</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
    );
};

export default LoginPage;