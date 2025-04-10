import React, { useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    //const [estadisticas, setEstadisticas] = useState([]);

    useEffect(() => {
        // obtener los usuarios y estadisticas
        const fetchData = async () => {
            try {
                const usuarioRes = await axios.get("http://localhost:3001/api/usuarios");
                // const statsRes = await axios.get("http://localhost:3001/api/estadisticas");
                setUsuarios(usuarioRes.data);
                // setEstadisticas(statsRes.data);
            } catch (error) {
                console.error("Error al obtener datos", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <header>
                <h2>Panel de administracion</h2>
            </header>
            <main>
                <h3>Usuarios</h3>
                <ul>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            {usuario.nombre} - {usuario.email}
                        </li>
                    ))}
                </ul>
            </main>
            <footer>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
            
    );
};

export default AdminPage;