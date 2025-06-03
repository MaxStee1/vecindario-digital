import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from 'primereact/tabview';
import ProductosPage from "./locatario/ProductosPage";
import ProveedoresPage from "./locatario/ProveedoresPage";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
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

    return (
        <div>
            <Toast ref={toast} />
            <header>
                <h2 style={{padding:"1rem", textAlign:"center", marginBottom:"0"}}>Administración de <strong>{nombreTienda}</strong></h2>
                <p style={{padding:"1rem", textAlign:"center", marginTop:"0"}}>Bienvenido, <strong>{locatarioNombre}</strong></p>
            </header>
            
            <main className="locatarioMain" style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                width: "100%",
                padding: "0 2rem"
            }}>
                <div style={{ width: "100%", maxWidth: "1200px"}}>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}
                        style={{borderRadius:"10px", margin:"1rem", placeItems:"center"}} 
                    >
                        <TabPanel header="Mis Productos" leftIcon="pi pi-shopping-bag mr-2">
                            <ProductosPage nombreTienda={nombreTienda} toastRef={toast} />
                        </TabPanel>
                        <TabPanel header="Mis Proveedores" leftIcon="pi pi-users mr-2">
                            <ProveedoresPage toastRef={toast} />
                        </TabPanel>
                        <TabPanel header="Mi tienda" leftIcon="pi pi-store mr-2">
                            <Card style={{ }}>
                                <div className="p-fluid" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <div className="p-field" style={{ 
                                        marginBottom: '1.5rem',
                                        padding: '1rem',
                                        backgroundColor: 'var(--surface-ground)',
                                        borderRadius: '6px'
                                    }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                            Puntaje de Visibilidad de la Tienda
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '100%',
                                                height: '1.5rem',
                                                backgroundColor: 'var(--surface-border)',
                                                borderRadius: '6px',
                                                overflow: 'hidden'
                                            }}>
                                                <div 
                                                    style={{ 
                                                        width: `${tiendaInfo.puntajeVisibilidad}%`,
                                                        height: '100%',
                                                        backgroundColor: tiendaInfo.puntajeVisibilidad > 70 
                                                            ? 'var(--green-500)' 
                                                            : tiendaInfo.puntajeVisibilidad > 40 
                                                                ? 'var(--orange-500)' 
                                                                : 'var(--red-500)',
                                                        transition: 'width 0.3s ease'
                                                    }}
                                                />
                                            </div>
                                            <span style={{ fontWeight: 'bold', minWidth: '3rem' }}>
                                                {tiendaInfo.puntajeVisibilidad}%
                                            </span>
                                        </div>
                                        <small className="p-d-block" style={{ marginTop: '0.5rem', color: 'var(--text-color-secondary)' }}>
                                            Este puntaje afecta la visibilidad de tu tienda en la plataforma
                                        </small>
                                    </div>
                                    
                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="nombreTienda">Nombre de la tienda</label>
                                        <InputText 
                                            id="nombreTienda" 
                                            value={nombreTienda} 
                                            onChange={(e) => setNombreTienda(e.target.value)} 
                                            disabled={!editMode}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    
                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="descripcion">Descripción</label>
                                        <InputTextarea 
                                            id="descripcion" 
                                            name="descripcion" 
                                            value={tiendaInfo.descripcion} 
                                            onChange={handleInputChange} 
                                            rows={3} 
                                            disabled={!editMode}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    
                                    <div className="p-field" style={{ marginBottom: '1.5rem' }}>
                                        <label htmlFor="direccionTienda">Dirección</label>
                                        <InputText 
                                            id="direccionTienda" 
                                            name="direccionTienda" 
                                            value={tiendaInfo.direccionTienda} 
                                            onChange={handleInputChange} 
                                            disabled={!editMode}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div className="p-field" style={{ flex: 1 }}>
                                            <label htmlFor="horarioApertura">Horario de apertura</label>
                                            <InputText 
                                                id="horarioApertura" 
                                                name="horarioApertura" 
                                                value={tiendaInfo.horarioApertura} 
                                                onChange={handleInputChange} 
                                                disabled={!editMode}
                                                placeholder="Ej: 08:00"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="p-field" style={{ flex: 1 }}>
                                            <label htmlFor="horarioCierre">Horario de cierre</label>
                                            <InputText 
                                                id="horarioCierre" 
                                                name="horarioCierre" 
                                                value={tiendaInfo.horarioCierre} 
                                                onChange={handleInputChange} 
                                                disabled={!editMode}
                                                placeholder="Ej: 18:00"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="p-field">
                                        <label>Métodos de entrega</label>
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
                                                                    backgroundColor: 'var(--surface-b)', 
                                                                    padding: '0.5rem 1rem',
                                                                    borderRadius: '6px'
                                                                }}
                                                            >
                                                                {getMetodoEntregaLabel(metodo as MetodoEntrega)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span style={{ color:'red'}}>
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
                                            />
                                            <Button 
                                                label="Guardar" 
                                                icon="pi pi-check" 
                                                onClick={guardarCambios} 
                                                style={{ marginLeft: '0.5rem' }}
                                            />
                                        </>
                                    ) : (
                                        <Button 
                                            label="Editar" 
                                            icon="pi pi-pencil" 
                                            onClick={() => setEditMode(true)} 
                                        />
                                    )}
                                </div>
                            </Card>
                        </TabPanel>
                    </TabView>
                </div>
            </main>

            <footer style={{ placeItems:'center', padding:"1rem", textAlign: "center" }}>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default LocatarioPage;