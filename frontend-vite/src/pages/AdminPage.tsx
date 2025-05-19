import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        totalVentas: 0,
        localesActivos: 0,
    });
    const [editForm, setEditForm] = useState({
        nombre: '',
        email: ''
    });
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener usuarios
                const usuarioRes = await api.get('/admin/users');

                // obtener estadisticas
                const stateRes = await api.get('/admin/metrics');

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

    

    const handleEditSubmit = async () => {
        try {
            await api.put(`/admin/users/${selectedUsuario.id}`, editForm,);
            
            // Actualizar la lista de usuarios
            const response = await api.get("/admin/users");
            setUsuarios(response.data);
            setEditDialogVisible(false);
            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario actualizado correctamente",
                life: 3000,
            });
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo actualizar el usuario",
                life: 3000,
            });
        }
    };

    const formatDate = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const openEditDialog = (usuario: any) => {
        setSelectedUsuario(usuario);
        setEditDialogVisible(true);
    };

    const contentStyle = {
        backgroundColor: "rgba(20% 20% 20% / 1)",
        padding: "1px 20px",
        borderRadius: "10px",
        marginBottom:"30px"
    };

    return (
        <div>
            <header>
                <h2 style={{textAlign:"center", padding:"2rem"}}>Panel de administración</h2>
                <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600", // Línea naranja
                        marginBottom: "20px",
                        width: "80%", // Línea que ocupa todo el ancho
                    }}
                />
            </header>
            
            <main className="adminMain" style={{ display: "flex", flexDirection: "column", placeItems:"center"}}>
                {/* Sección de estadísticas */}
                <h3>Estadísticas</h3>
                <div 
                    className="card"
                    style={{
                    backgroundColor: "#ffffff",
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
                        <div style={{...contentStyle, marginBottom:"0px"}}>
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
                    width: "80%",
                }}> 
                    <DataTable 
                        value={usuarios}
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minWidth: '50rem', alignItems:"center" }}
                        style={{ borderRadius: "10px" }}
                        stripedRows
                    >
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="email" header="Correo" sortable></Column>
                        <Column field="rol" header="Rol" sortable></Column>
                        <Column field="CreatedAt" header="Fecha Registro" sortable body={(rowData) => formatDate(rowData.CreatedAt)}></Column>
                        <Column 
                            header="Acciones"
                            body={(rowData) => (
                                <div>
                                    <Button 
                                      label="Editar" 
                                      style={{ margin: "5px",}} 
                                      className="btn btn-primary"
                                      onClick={() => openEditDialog(rowData)}
                                    />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </main>
            {/* Dialogo para editar usuarios */}
            <Dialog
                header="Editar Usuario"
                visible={editDialogVisible}
                style={{ width: "50vw" }}
                onHide={() => setEditDialogVisible(false)}
                footer={
                    <div>
                        <Button 
                            label="Guardar" 
                            icon="pi pi-check" 
                            onClick={handleEditSubmit} 
                        />
                        <Button 
                            label="Cancelar" 
                            icon="pi pi-times" 
                            onClick={() => setEditDialogVisible(false)} 
                            className="p-button-secondary" 
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={editForm.nombre}
                            onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Correo</label>
                        <InputText
                            id="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                    </div>
                </div>
            </Dialog>
            

            
            <footer style={{ placeItems:'center', padding:"1rem"}} >
                <LogoutButton />
                <p>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default AdminPage;