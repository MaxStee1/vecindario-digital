import React from "react";
import LogoutButton from "../components/LogoutButton";

const LocatarioPage = () => {
    return (
        <div>
            <h2>Locatario</h2>
            <p>Bienvenido al panel de locatario</p>
            <footer>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
            </footer>
        </div>
    );
};

export default LocatarioPage;