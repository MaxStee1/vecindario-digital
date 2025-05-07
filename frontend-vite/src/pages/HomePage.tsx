import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{textAlign:"center"}}>
            <header>
                <h1>Comercio Digita y Local</h1>
                <p>Compra y vende todo lo que quieras dentro de tu comunidad</p>
            </header>
            <main>
                <div>
                    <h2>¿Ya tienes una cuenta?</h2>
                    <p>Inicia sesion y empieza a comprar y vender</p>
                </div>
                <div>
                    <button onClick={() => navigate("/login")}>Iniciar Sesion</button>
                </div>
                <div>
                    <h2>¿No tienes cuenta?</h2>
                    <p>Registrate para acceder al comercio local</p>
                </div>
                <div>
                    <button onClick={() => navigate("/register")}>Registrarse</button>
                </div>
            </main>
            <footer style={{ placeItems:'center', padding:"5rem"}} >
                <p>&copy; 2023 Comercio Digital y Local. Todos los derechos reservados.</p>
                <p>Desarrollado por <strong>Run mafia</strong></p>
            </footer>
        </div>

    );
};

export default HomePage;