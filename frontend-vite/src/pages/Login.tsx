import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeToken } from "../utils/auth";

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
            localStorage.setItem("token", token);
            
            const user = decodeToken(response.data.token);

            switch(user.rol) {
                case 'admin':
                    navigate('/admin')
                    break;
                case 'locatario':
                    navigate('/locatario')
                    break;
                case 'comprador':
                    navigate('/comprador')
                    break;
                default:
                    navigate("/")
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