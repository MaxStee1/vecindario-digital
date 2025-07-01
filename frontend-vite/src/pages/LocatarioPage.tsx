import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from 'primereact/tabview';
import ProductosPage from "./locatario/ProductosPage";
import ProveedoresPage from "./locatario/ProveedoresPage";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

type MetodoEntrega = 'envio' | 'retiro';

const LocatarioPage = () => {
    const [locatarioNombre, setLocatarioNombre] = useState<string>('');
    const [nombreTienda, setNombreTienda] = useState<string>('');
    const [tiendaInfo, setTiendaInfo] = useState({
        descripcion: '',
        direccionTienda: '',
        horarioApertura: '',
        horarioCierre: '',
        metodosEntrega: [] as MetodoEntrega[],
        puntajeVisibilidad: 100
    });
    const [editMode, setEditMode] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const metodosDisponibles: MetodoEntrega[] = ['envio', 'retiro'];
    const toast = useRef<Toast>(null);

    useEffect(() => {
        obtenerLocatario();
    }, []);

    const obtenerLocatario = async () => {
        try {
            const response = await api.get("/locatarios/info");
            setLocatarioNombre(response.data.usuario.nombre);
            setNombreTienda(response.data.nombreTienda);
            setTiendaInfo({
                descripcion: response.data.descripcion || '',
                direccionTienda: response.data.direccionTienda,
                horarioApertura: response.data.horarioApertura || '',
                horarioCierre: response.data.horarioCierre || '',
                metodosEntrega: response.data.metodosEntrega || [],
                puntajeVisibilidad: response.data.puntajeVisibilidad || 100
            });
        } catch (error) {
            console.error("Error al obtener la información del locatario", error);
            showError("Hubo un problema al cargar la información del locatario.");
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTiendaInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMetodoEntregaChange = (metodo: MetodoEntrega) => {
        setTiendaInfo(prev => {
            if (prev.metodosEntrega.includes(metodo)) {
                return {
                    ...prev,
                    metodosEntrega: prev.metodosEntrega.filter(m => m !== metodo)
                };
            } else {
                return {
                    ...prev,
                    metodosEntrega: [...prev.metodosEntrega, metodo]
                };
            }
        });
    };

    const guardarCambios = async () => {
        try {
            await api.put("/locatarios/info", {
                nombreTienda,
                ...tiendaInfo
            });
            showSuccess("Información de la tienda actualizada correctamente");
            setEditMode(false);
        } catch (error) {
            console.error("Error al actualizar la información", error);
            showError("Hubo un problema al actualizar la información de la tienda.");
        }
    };

    const showError = (message: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    };

    const showSuccess = (message: string) => {
        toast.current?.show({severity:'success', summary: 'Éxito', detail: message, life: 3000});
    };

    const getMetodoEntregaLabel = (metodo: MetodoEntrega) => {
        switch(metodo) {
            case 'envio': return 'Envío a domicilio';
            case 'retiro': return 'Retiro en tienda';
            default: return metodo;
        }
    };

    // --- ESTILOS ---
    const cardStyle: React.CSSProperties = {
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
        padding: "36px 32px",
        margin: "0 auto",
        marginTop: "24px",
        maxWidth: 900,
        width: "100%"
    };

    const inputStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: 8,
        border: "1.5px solid #E3E7ED",
        fontSize: 16,
        marginBottom: 8,
        background: "#fff",
        color: "#222",
        outline: "none",
        transition: "border-color 0.2s"
    };

    const labelStyle: React.CSSProperties = {
        fontWeight: 600,
        color: "#1976D2",
        marginBottom: 4
    };

    // --- FIN ESTILOS ---

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #F8FAFC 60%, #E3F2FD 100%)" }}>
            <Toast ref={toast} />
            <header style={{
                marginBottom: "32px",
                width: "100%",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
                padding: "2.5rem 0 1.5rem 0"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h2 style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "2.2rem",
                        margin: 0,
                        letterSpacing: "1px"
                    }}>
                        Administración de <span style={{ color: "#FFD600" }}>{nombreTienda}</span>
                    </h2>
                    <p style={{
                        color: "#fff",
                        fontSize: "1.15rem",
                        marginTop: 18,
                        marginBottom: 0,
                        fontWeight: 500
                    }}>
                        Bienvenido, <strong>{locatarioNombre}</strong>
                    </p>
                </div>
            </header>
            <main className="locatarioMain" style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                padding: "0 2rem"
            }}>
                <div style={{ width: "100%", maxWidth: "1200px" }}>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}
                        style={{ borderRadius: "14px", margin: "1rem", placeItems: "center", background: "transparent" }}
                    >
                        <TabPanel header="Mis Productos" leftIcon={<span className="pi pi-shopping-bag" style={{ color: "#1976D2", fontSize: 20, marginRight: 8 }}></span>}>
                            <ProductosPage nombreTienda={nombreTienda} toastRef={toast} />
                        </TabPanel>
                        <TabPanel header="Mis Proveedores" leftIcon={<span className="pi pi-users" style={{ color: "#43A047", fontSize: 20, marginRight: 8 }}></span>}>
                            <ProveedoresPage toastRef={toast} />
                        </TabPanel>
                        <TabPanel header="Mi tienda" leftIcon={<span className="pi pi-store" style={{ color: "#FFA726", fontSize: 20, marginRight: 8 }}></span>}>
                            <div style={cardStyle}>
                                <div className="p-fluid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <div className="p-field" style={{
                                        marginBottom: '1.5rem',
                                        padding: '1rem',
                                        backgroundColor: '#F5F7FA',
                                        borderRadius: '8px'
                                    }}>
                                        <label style={{ ...labelStyle, color: "#43A047" }}>
                                            Puntaje de Visibilidad de la Tienda
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '1.5rem',
                                                backgroundColor: '#E3E7ED',
                                                borderRadius: '6px',
                                                overflow: 'hidden'
                                            }}>
                                                <div
                                                    style={{
                                                        width: `${tiendaInfo.puntajeVisibilidad}%`,
                                                        height: '100%',
                                                        background: tiendaInfo.puntajeVisibilidad > 70
                                                            ? 'linear-gradient(90deg, #43A047 60%, #1976D2 100%)'
                                                            : tiendaInfo.puntajeVisibilidad > 40
                                                                ? '#FFA726'
                                                                : '#E53935',
                                                        transition: 'width 0.3s ease'
                                                    }}
                                                />
                                            </div>
                                            <span style={{ fontWeight: 'bold', minWidth: '3rem', color: "#1976D2" }}>
                                                {tiendaInfo.puntajeVisibilidad}%
                                            </span>
                                        </div>
                                        <small className="p-d-block" style={{ marginTop: '0.5rem', color: '#888' }}>
                                            Este puntaje afecta la visibilidad de tu tienda en la plataforma
                                        </small>
                                    </div>

                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="nombreTienda" style={labelStyle}>Nombre de la tienda</label>
                                        <InputText
                                            id="nombreTienda"
                                            value={nombreTienda}
                                            onChange={(e) => setNombreTienda(e.target.value)}
                                            disabled={!editMode}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="descripcion" style={labelStyle}>Descripción</label>
                                        <InputTextarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={tiendaInfo.descripcion}
                                            onChange={handleInputChange}
                                            rows={3}
                                            disabled={!editMode}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="direccionTienda" style={labelStyle}>Dirección</label>
                                        <InputText
                                            id="direccionTienda"
                                            name="direccionTienda"
                                            value={tiendaInfo.direccionTienda}
                                            onChange={handleInputChange}
                                            disabled={!editMode}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div className="p-field" style={{ flex: 1 }}>
                                            <label htmlFor="horarioApertura" style={labelStyle}>Horario de apertura</label>
                                            <InputText
                                                id="horarioApertura"
                                                name="horarioApertura"
                                                value={tiendaInfo.horarioApertura}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                placeholder="Ej: 08:00"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div className="p-field" style={{ flex: 1 }}>
                                            <label htmlFor="horarioCierre" style={labelStyle}>Horario de cierre</label>
                                            <InputText
                                                id="horarioCierre"
                                                name="horarioCierre"
                                                value={tiendaInfo.horarioCierre}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                placeholder="Ej: 18:00"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-field">
                                        <label style={labelStyle}>Métodos de entrega</label>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {editMode ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {metodosDisponibles.map((metodo) => (
                                                        <div key={metodo} className="flex align-items-center">
                                                            <Checkbox
                                                                inputId={`metodo-${metodo}`}
                                                                name="metodosEntrega"
                                                                value={metodo}
                                                                checked={tiendaInfo.metodosEntrega.includes(metodo)}
                                                                onChange={() => handleMetodoEntregaChange(metodo)}
                                                            />
                                                            <label htmlFor={`metodo-${metodo}`} className="ml-2">
                                                                {getMetodoEntregaLabel(metodo as MetodoEntrega)}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {tiendaInfo.metodosEntrega.length > 0 ? (
                                                        tiendaInfo.metodosEntrega.map((metodo, index) => (
                                                            <span
                                                                key={index}
                                                                className="p-tag"
                                                                style={{
                                                                    backgroundColor: '#E3F2FD',
                                                                    color: '#1976D2',
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '6px',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {getMetodoEntregaLabel(metodo as MetodoEntrega)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span style={{ color: 'red' }}>
                                                            No se han seleccionado métodos de entrega
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                                    {editMode ? (
                                        <>
                                            <Button
                                                label="Cancelar"
                                                icon="pi pi-times"
                                                className="p-button-text"
                                                onClick={() => setEditMode(false)}
                                                style={{ color: "#1976D2" }}
                                            />
                                            <Button
                                                label="Guardar"
                                                icon="pi pi-check"
                                                onClick={guardarCambios}
                                                style={{
                                                    marginLeft: '0.5rem',
                                                    background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                                                    border: "none",
                                                    borderRadius: 8,
                                                    fontWeight: 600,
                                                    fontSize: 16,
                                                    color: "#fff"
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <Button
                                            label="Editar"
                                            icon="pi pi-pencil"
                                            onClick={() => setEditMode(true)}
                                            style={{
                                                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                                                border: "none",
                                                borderRadius: 8,
                                                fontWeight: 600,
                                                fontSize: 16,
                                                color: "#fff"
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </main>
            <footer style={{
                marginTop: "auto",
                fontSize: "15px",
                color: "#666",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                colorScheme: "light",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                width: "100%",
                padding: "1.2rem 0 0.5rem 0",
                textAlign: "center"
            }}>
                <LogoutButton />
                <p style={{ color: "#fff", margin: 0 }}>&copy; {new Date().getFullYear()} Comercio Digital y Local. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LocatarioPage;