import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import axios from "axios";
import "../styles/forms.css"

//pagina de registro

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [rol, setRol] = useState("");
    const toast = useRef<Toast>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3001/auth/register", {
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
                                background: '#2196F3',
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
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000, closable: false});
    }

    return (
        <div className="principal-div">
            <Toast ref={toast} />
            <header className="form-page-header">
                <h1>Registro</h1>
                <hr/>
            </header>
            <form 
                className="form-style"
                onSubmit={handleRegister}
            >
                <div style={{ width: "90%" }}>
                    <label className="form-label">
                        Nombre Completo
                    </label>
                    <input
                        className="form-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ width: "90%" }}>
                    <label className="form-label">
                        Email
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
                        Contraseña
                    </label>
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div style={{ width:"50%", marginTop:"20px", marginBottom:"20px" }}>
                    <select value={rol} onChange={(e) => setRol(e.target.value)} className="form-input" required>
                        <option value="">Selecciona un rol</option>
                        <option value='comprador'>Comprador</option>
                        <option value='locatario'>Locatario</option>
                        <option value='repartidor'>Repartidor</option>
                    </select>
                </div>
                <button className="form-button" type="submit" >
                    Registrar
                </button>
            </form>
        </div>
    );
}
export default Register;