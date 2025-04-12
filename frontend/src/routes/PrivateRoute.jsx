import React from "react";

// Componente para proteger rutas, verifica si hay un token
const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("token");

    // Si no hay token muestra mensaje de error 401
    if (!token){
        return (
            <div style={{
                display:"flex", justifyContent:"center",
                alignItems:"center", height:"80vh", margin:0,
            }}>
            <div style={{ 
                    backgroundColor:"rgba(10% 10% 10% / 0.8)", 
                    borderRadius:"10px", boxShadow:"0 0 10px rgba(80% 0 0 / 1)",
                    width:"100%", maxWidth:"400px",
                    padding: "2rem", 
                    textAlign: "center",
                    }}>

                <h2 style={{color:"red"}}>Error 401 - No Autorizado</h2>
                <p style={{color:"rgba(80% 0 0 / 1)"}}> Debes iniciar sesion para acceder a esta seccion</p>
            </div>
            </div>
        );
    }

    return element;
};

export default PrivateRoute;