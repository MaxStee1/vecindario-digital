import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/homePage.module.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.contHome}>
            <header className={styles.header}>
                <h1>Comercio Digita y Local</h1>
                <p>Compra y vende todo lo que quieras dentro de tu comunidad</p>
            </header>
            <main className={styles.main}>
                <div className={styles["text-container"]}>
                    <h2>¿Ya tienes una cuenta?</h2>
                    <p>Inicia sesion y empieza a comprar y vender</p>
                </div>
                <div className={styles["access-options"]}>
                    <button className={styles["home-button"]} onClick={() => navigate("/login")}>Iniciar Sesion</button>
                </div>
                <div className={styles["text-container"]}>
                    <h2>¿No tienes cuenta?</h2>
                    <p>Registrate para acceder al comercio local</p>
                </div>
                <div className={styles["access-options"]}>
                    <button className={styles["home-button"]} onClick={() => navigate("/register")}>Registrarse</button>
                </div>
            </main>
            <footer>
                <p>&copy; 2023 Comercio Digital y Local. Todos los derechos reservados.</p>
                <p>Desarrollado por <strong>Run mafia</strong></p>
            </footer>
        </div>

    );
};

export default HomePage;