import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                email,
                password,
            });
            const token = response.data.token;
            const role = response.data.user.rol;
            localStorage.setItem("token", token);
            
            // redirigir segun rol
            if(role === "admin"){
                navigate("/admin");
            } else if(role === "locatario"){
                navigate("/locatario")
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError("Credenciales invalidas");
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button>Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default Login;