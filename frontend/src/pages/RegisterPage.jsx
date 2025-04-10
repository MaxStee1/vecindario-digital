import React from "react";

const RegisterPage = () => {
    return (
        <div>
            <h2>Registro</h2>
            <form>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" required />
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default RegisterPage;