import React from "react";
import LogoutButton from "../components/LogoutButton";

const CompradorPage = () => {
    return (
        <div>
            <h2>Comprador</h2>
            <p>Bienvenido al panel de comprador</p>
            <footer>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
            </footer>
        </div>
    );
};

export default CompradorPage;