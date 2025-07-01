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
import { FaChartBar, FaUserCog } from "react-icons/fa";

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
        pedidosPorEstado: [],
        topProductos: [],
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
                const usuarioRes = await api.get('/admin/users');
                const stateRes = await api.get('/admin/metrics');
                setUsuarios(usuarioRes.data);
                setEstadisticas({
                    totalUsuarios: stateRes.data.totalUsuarios,
                    totalVentas: stateRes.data.totalVentas,
                    localesActivos: stateRes.data.localesActivos,
                    totalCompradores: stateRes.data.totalCompradores,
                    totalLocatarios: stateRes.data.totalLocatarios,
                    totalRepartidores: stateRes.data.totalRepartidores,
                    pedidosPorEstado: stateRes.data.pedidosPorEstado,
                    topProductos: stateRes.data.topProductos,
                });
            } catch (error) {
                console.error("Error al obtener datos", error);
                alert("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
            }
        };
        fetchData();
    }, []);

    const handleEditSubmit = async () => {
        if (!isValidGmail(editForm.email)) {
            toast.current?.show({
                closable: false,
                severity: "error",
                summary: "Error",
                detail: "El correo debe ser un Gmail válido (ejemplo@gmail.com)",
                life: 3000,
            });
            return;
        }
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

    const isValidGmail = (email: string) => {
        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 8;
    };

    const handleCreateSubmit = async () => {
        if (!isValidGmail(createForm.email)) {
            toast.current?.show({
                closable: false,
                severity:"error",
                summary:"Error",
                detail:"El correo de ser un gmail valido (ejemplo@gmail.com)",
                life:3000,
            })
            return;
        }
        if (!isValidPassword(createForm.password)) {
            toast.current?.show({
                closable: false,
                severity: "error",
                summary: "Error",
                detail: "La contraseña debe tener al menos 8 caracteres",
                life: 3000,
            });
            return;
        }

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
        <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
            <header style={{
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                padding: "2.5rem 0 1.5rem 0",
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)"
            }}>
                <h2 style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "2.5rem",
                    letterSpacing: "1px",
                    marginBottom: "1.2rem"
                }}>
                    Panel de Administración
                </h2>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.5rem",
                    marginBottom: "1.5rem"
                }}>
                    <Button
                        label="Ver Métricas"
                        icon={<FaChartBar style={{ color: "#fff", marginRight: 8 }} />}
                        onClick={() => setShowUsers(false)}
                        className={!showUsers ? "p-button-primary" : ""}
                        style={{
                            background: !showUsers ? "#43A047" : "#fff",
                            color: !showUsers ? "#fff" : "#1976D2",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            boxShadow: !showUsers ? "0 2px 8px #43A04744" : "none"
                        }}
                    />
                    <Button
                        label="Administrar Usuarios"
                        icon={<FaUserCog style={{ color: "#fff", marginRight: 8 }} />}
                        onClick={() => setShowUsers(true)}
                        className={showUsers ? "p-button-primary" : ""}
                        style={{
                            background: showUsers ? "#1976D2" : "#fff",
                            color: showUsers ? "#fff" : "#43A047",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            boxShadow: showUsers ? "0 2px 8px #1976D244" : "none"
                        }}
                    />
                </div>
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
                style={{ width: "50vw" }}
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

            <footer style={{
                placeItems: 'center',
                padding: "1.5rem 0 0.5rem 0",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                color: "#fff",
                marginTop: "2rem",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                textAlign: "center"
            }}>
                <LogoutButton />
                <p style={{ margin: "0.5rem 0 0 0" }}>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
                <p style={{ margin: 0 }}>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default AdminPage;