import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import api from "../services/api";
import "../styles/forms.css"

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef<Toast>(null);

    useEffect(() => {
        api.get('/auth/me')
        .then(res => {
            const user = res.data;
            switch (user.rol) {
                case "admin":
                    navigate("/admin");
                    break;
                case "locatario":
                    navigate("/locatario");
                    break;
                case "comprador":
                    navigate("/shop");
                    break;
                case "repartidor":
                    navigate("/repartidor");
                    break;
                default:
                    navigate("/");
            }
        })
        .catch(() => {
            console.error("Sesion no inicaida");
        });
    }, [navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const user = response.data;

            switch (user.rol) {
                case "admin":
                    navigate("/admin");
                    break;
                case "locatario":
                    navigate("/locatario");
                    break;
                case "comprador":
                    navigate("/shop");
                    break;
                case "repartidor":
                    navigate("/repartidor");
                    break;
                default:
                    navigate("/");
            }
        } catch (err) {
            console.error(err);
            showError("Credenciales Incorrectas");
            
        }
    };

    const showError = (message: string) => {
        toast.current?.clear();
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000, closable: false});
    }


    return (
        <div className="principal-div">
            <Toast ref={toast} />
            <header className="form-page-header">
                <h1>Iniciar Sesión</h1>
                <hr/>
            </header>
            <form
                className="form-style"
                onSubmit={handleLogin}
            >
                <div style={{ width: "90%" }}>
                    <label className="form-label">
                        Email:
                    </label>
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ width: "90%" }}>
                    <label className="form-label">
                        Contraseña:
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    className="form-button"
                    type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;