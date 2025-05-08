import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeToken } from "../utils/auth";
import '../styles/login.css';

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
                    navigate('/shop')
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
        <div className="login-body">
            <h2 id="login-tittle">Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="login-section">
                    <label className="login-label">EMAIL</label>
                    <input className="login-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-section">
                    <label className="login-label">PASSWORD</label>
                    <input className="login-input"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button">Iniciar Sesion</button>
            </form>
            {error && <p className="login-error">{error}</p>}
        </div>
    );
}

export default Login;