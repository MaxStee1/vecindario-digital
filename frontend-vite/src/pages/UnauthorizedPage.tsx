import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div style={{display:"grid", placeItems:"center"}}>
            <h1 style={{color:"rgba(100% 0 20% / 1)", marginBottom:0, padding:"10px"}}>403 - Acceso no autorizado</h1>
            <p style={{ color:"rgba(100% 0 20% / 1)", fontSize:"1.2rem"}}>No tienes permisos para acceder a esta pagina</p>
            <Link to="/">
                Volver al inicio
            </Link>
        </div>  
    );
};

export default UnauthorizedPage;