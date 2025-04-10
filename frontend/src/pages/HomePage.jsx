import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <header>
                <h1>Comercio Digita y Local</h1>
                <p>Compra y vende todo lo que quieras dentro de tu comunidad</p>
            </header>
            <nav>
                <ul>
                    <li><button onClick={() => navigate('login')}>Iniciar Sesion</button></li>
                    <li><button onClick={() => navigate('register')}>Registrarse</button></li>
                </ul>
            </nav>
        </div>

    );
};

export default HomePage;