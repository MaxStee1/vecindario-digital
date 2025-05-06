import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        totalVentas: 0,
        localesActivos: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                // Obtener usuarios
                const usuarioRes = await axios.get("http://localhost:3001/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // obtener estadisticas
                const stateRes = await axios.get("http://localhost:3001/admin/metrics", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                setUsuarios(usuarioRes.data);
                setEstadisticas({
                    totalUsuarios: usuarioRes.data.length,
                    totalVentas: stateRes.data.totalVentas,
                    localesActivos:stateRes.data.topLocatarios.length
                });
            } catch (error) {
                console.error("Error al obtener datos", error);
                alert("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
            }
        };

        fetchData();
    }, []);

    const contentStyle = {
        backgroundColor: "rgba(20% 20% 20% / 0.5)",
        padding: "1px 20px",
        borderRadius: "10px",
        marginBottom:"30px"
    };

    return (
        <div>
            <header>
                <h2>Panel de administración</h2>
            </header>
            
            <main className="adminMain" style={{ display: "flex", flexDirection: "column", placeItems:"center"}}>
                {/* Sección de estadísticas */}
                <h3>Estadísticas</h3>
                <div 
                    className="card"
                    style={{
                    backgroundColor: "rgba(20% 20% 20% / 0.8)",
                    padding: "20px",
                    textAlign: "left",
                    borderRadius: "10px",
                    width: "30rem",
                    marginBottom: "20px",
                    }} >
                    <div>
                        <div style={contentStyle}>
                            <h4>Total de usuarios</h4>
                            <p>{estadisticas.totalUsuarios}</p>
                        </div>
                    </div>
                    <div>
                        <div style={contentStyle}>
                            <h4>Total de ventas</h4>
                            <p>${estadisticas.totalVentas}</p>
                        </div>
                    </div>
                    <div>
                        <div style={contentStyle}>
                            <h4>Locales activos</h4>
                            <p>{estadisticas.localesActivos}</p>
                        </div>
                    </div>
                </div>

                {/* Sección de usuarios */}
                <h3>Usuarios</h3>
                <div
                className="card"
                style={{
                    backgroundColor: "rgba(20% 20% 20% / 0.8)",
                    padding: "20px",
                    textAlign: "left",
                    borderRadius: "10px",
                    width: "70%",
                }}> 
                    <DataTable 
                        value={usuarios}
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minWidth: '50rem', alignItems:"center" }}
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="email" header="Correo" sortable></Column>
                        <Column field="createdAt" header="Fecha Registro" sortable></Column>
                    </DataTable>
                </div>
            </main>
            
            <footer>
                <LogoutButton />
                <p>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default AdminPage;