import React, { useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    //const [estadisticas, setEstadisticas] = useState([]);

    useEffect(() => {
        // obtener los usuarios y estadisticas
        const token = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const usuarioRes = await axios.get("http://localhost:3001/api/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
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
                <h2>Panel de administración</h2>
            </header>
            <main className="adminMain" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <h3>Usuarios</h3>
                <div className="card" style={{backgroundColor:"rgba(20% 20% 20% / 0.8)", padding:"20px", textAlign:"left",
                    borderRadius:"10px", width:"70%"
                }}>
                <DataTable value={usuarios} tableStyle={{ minWidth: 'auto', alignItems:"center" }}>
                    <Column field="id" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="email" header="Category"></Column>
                </DataTable>
                </div>
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