import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import MetricsSection from "../components/admin/MetricsSection";
import UsersSection from "../components/admin/UsersSection";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const rolesDisponibles = [
    { label: "Administrador", value: "admin" },
    { label: "Locatario", value: "locatario" },
    { label: "Comprador", value: "comprador" },
    { label: "Repartidor", value: "repartidor" },
];

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        totalVentas: 0,
        localesActivos: 0,
        totalCompradores: 0,
        totalLocatarios: 0,
        totalRepartidores: 0,
    });
    const [editForm, setEditForm] = useState({
        nombre: '',
        email: ''
    });
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [createForm, setCreateForm] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: ''
    });
    const [showUsers, setShowUsers] = useState(false);
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
                    localesActivos: stateRes.data.localesActivos,
                    totalLocatarios: stateRes.data.totalLocatarios,
                    totalCompradores: stateRes.data.totalCompradores,
                    totalRepartidores: stateRes.data.totalRepartidores,
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
            await api.put(`/admin/users/${selectedUsuario.id}`, editForm);

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
        setEditForm({
            nombre: usuario.nombre,
            email: usuario.email,
        });
        setEditDialogVisible(true);
    };

    const openDeleteDialog = (usuario: any) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombre}?`)) {
            handleDeleteUser(usuario.id);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await api.put(`/admin/users/delete/${userId}`);
            // Actualizar la lista de usuarios
            const response = await api.get("/admin/users");
            setUsuarios(response.data);
            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario eliminado correctamente",
                life: 3000,
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo eliminar el usuario",
                life: 3000,
            });
            console.error("Error al eliminar usuario:", error);
        }
    };

    const handleCreateSubmit = async () => {
        try {
            await api.post('/admin/users', createForm);
            // Actualizar la lista de usuarios
            const response = await api.get("/admin/users");
            setUsuarios(response.data);
            setCreateDialogVisible(false);
            setCreateForm({
                nombre: '',
                email: '',
                password: '',
                rol: ''
            });
            toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Usuario creado correctamente",
                life: 3000,
            });
        } catch (error) {
            console.error("Error al crear usuario:", error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo crear el usuario",
                life: 3000,
            });
        }
    };

    return (
        <div>
            <header>
                <h2 style={{ textAlign: "center", padding: "2rem" }}>Panel de administración</h2>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <Button 
                        label="Ver Métricas"
                        icon={() =><i className="pi pi-chart-bar" style={{color:"#ff6600", marginRight:"0.5rem"}} />}
                        onClick={() => setShowUsers(false)} 
                        className={!showUsers ? "p-button-primary" : ""}
                    />
                    <Button 
                        label="Administrar Usuarios" 
                        icon={() =><i className="pi pi-user" style={{color:"#ff6600", marginRight:"0.5rem"}} />}
                        onClick={() => setShowUsers(true)} 
                        className={showUsers ? "p-button-primary" : ""}
                    />
                </div>
                <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600",
                        marginBottom: "20px",
                        width: "80%",
                    }}
                />
            </header>

            <main className="adminMain" style={{ display: "flex", flexDirection: "column", placeItems: "center" }}>
                <Toast ref={toast} />
                
                {!showUsers ? (
                    <MetricsSection estadisticas={estadisticas} />
                ) : (
                    <UsersSection 
                        usuarios={usuarios} 
                        formatDate={formatDate} 
                        openEditDialog={openEditDialog} 
                        openDeleteDialog={openDeleteDialog} 
                        setCreateDialogVisible={setCreateDialogVisible} 
                    />
                )}
            </main>

            {/* Dialogo para crear usuario */}
            <Dialog
                header="Crear Usuario"
                closeIcon={<i className="pi pi-times" style={{ color: "red" }} />}
                visible={createDialogVisible}
                style={{ width: "50vw"}}
                onHide={() => setCreateDialogVisible(false)}
                footer={
                    <div>
                        <Button
                            label="Crear"
                            icon="pi pi-check"
                            onClick={handleCreateSubmit}
                        />
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setCreateDialogVisible(false)}
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
                            value={createForm.nombre}
                            onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Correo</label>
                        <InputText
                            id="email"
                            value={createForm.email}
                            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="rol">Rol</label>
                        <Dropdown
                            id="rol"
                            value={createForm.rol}
                            options={rolesDisponibles}
                            onChange={(e) => setCreateForm({ ...createForm, rol: e.value })}
                            placeholder="Selecciona un rol"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Contraseña</label>
                        <InputText
                            id="password"
                            type="password"
                            value={createForm.password}
                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Dialogo para editar usuarios */}
            <Dialog
                header="Editar Usuario"
                closeIcon={<i className="pi pi-times" style={{ color: "red" }} />}
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
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Correo</label>
                        <InputText
                            id="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                    </div>
                </div>
            </Dialog>

            <footer style={{ placeItems: 'center', padding: "1rem", backgroundColor:"rgba(5% 5% 5% / 20%)", marginTop: "2rem" }} >
                <LogoutButton />
                <p>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default AdminPage;