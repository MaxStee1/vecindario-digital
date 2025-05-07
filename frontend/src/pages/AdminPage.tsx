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

                // Obtener estadísticas
                const stateRes = await axios.get("http://localhost:3001/admin/metrics", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsuarios(usuarioRes.data);
                setEstadisticas({
                    totalUsuarios: usuarioRes.data.length,
                    totalVentas: stateRes.data.totalVentas,
                    localesActivos: stateRes.data.topLocatarios.length,
                });
            } catch (error) {
                console.error("Error al obtener datos", error);
                alert("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <header>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Panel de administración</h2>
            </header>

            <main className="adminMain" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Sección de estadísticas */}
                <h3>Estadísticas</h3>
                <div
                    className="card"
                    style={{
                        backgroundColor: "rgba(20% 20% 20% / 0.8)",
                        padding: "20px",
                        textAlign: "left",
                        borderRadius: "10px",
                        width: "70%",
                        marginBottom: "20px",
                    }}
                >
                    <p>Total de usuarios: {estadisticas.totalUsuarios}</p>
                    <p>Total de ventas: ${estadisticas.totalVentas}</p>
                    <p>Locales activos: {estadisticas.localesActivos}</p>
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
                    }}
                >
                    <DataTable
                        value={usuarios}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        tableStyle={{ minWidth: "auto", alignItems: "center" }}
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="email" header="Correo" sortable></Column>
                        <Column field="createdAt" header="Fecha Registro" sortable></Column>
                    </DataTable>
                </div>
            </main>

            <footer style={{ textAlign: "center", marginTop: "20px" }}>
                <LogoutButton />
                <p>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default AdminPage;