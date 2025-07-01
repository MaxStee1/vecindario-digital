import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LogoutButton from '../components/LogoutButton';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    locatario: {
        nombreTienda: string;
        usuario: {
            nombre: string;
        };
    };
}

interface ItemCarrito {
    productoId: number;
    cantidad: number;
    producto: Producto;
}

const PrincipalPage = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [comprador, setComprador] = useState<any>(null);
    const [cantidadesTemporales, setCantidadesTemporales] = useState<{ [key: number]: number }>({});
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    // Función para cargar el carrito real del backend
    const cargarCarrito = useCallback(async (compradorId: number) => {
        try {
            const res = await api.get(`/carrito/${compradorId}`);
            setCarrito(res.data);
        } catch (error) {
            setCarrito([]);
        }
    }, []);

    // Cargar perfil y carrito al montar
    useEffect(() => {
        const fetchPerfilYCarrito = async () => {
            try {
                const res = await api.get("/comprador/perfil");
                setComprador(res.data);
                await cargarCarrito(res.data.id);
            } catch {
                console.error("Error al obtener usuario o carrito");
            }
        };
        fetchPerfilYCarrito();
    }, [cargarCarrito]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await api.get('/comprador/productos');
                if (response.status !== 200) {
                    throw new Error('Error al obtener productos');
                }
                setProductos(response.data);
                // Inicializar cantidades temporales
                const iniciales = response.data.reduce((acc: any, producto: Producto) => {
                    acc[producto.id] = 0;
                    return acc;
                }, {});
                setCantidadesTemporales(iniciales);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los productos',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    const handleCantidadChange = (productoId: number, cantidad: number) => {
        setCantidadesTemporales(prev => ({
            ...prev,
            [productoId]: cantidad
        }));
    };

    const agregarAlCarrito = async (producto: Producto) => {
        const cantidad = cantidadesTemporales[producto.id] || 0;

        if (cantidad <= 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Cantidad inválida',
                detail: 'Selecciona una cantidad mayor a cero',
                life: 2000
            });
            return;
        }

        try {
            // Obtener el id del comprador autenticado
            const perfil = await api.get("/comprador/perfil");
            const compradorId = perfil.data.id;

            // Agregar al carrito en el backend
            await api.post("/carrito/agregar", {
                compradorId,
                productoId: producto.id,
                cantidad
            });

            toast.current?.show({
                closable: false,
                severity: 'success',
                summary: 'Producto agregado',
                detail: `${cantidad} ${producto.nombre} añadido(s) al carrito`,
                life: 2000
            });

            // Resetear la cantidad temporal
            setCantidadesTemporales(prev => ({
                ...prev,
                [producto.id]: 0
            }));

            // Recargar el carrito para actualizar el contador
            await cargarCarrito(compradorId);

        } catch (error: any) {
            toast.current?.show({
                closable: false,
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.message || 'No se pudo agregar al carrito',
                life: 2000
            });
        }
    };

    const irAlCarrito = () => {
        navigate('/carrito');
    };

    const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // --- ESTILOS ---
    const pageStyle: React.CSSProperties = {
        minHeight: "100vh",
        background: "linear-gradient(120deg, #F8FAFC 60%, #E3F2FD 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column"
    };

    const headerStyle: React.CSSProperties = {
        background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
        padding: "2.5rem 0 1.5rem 0",
        marginBottom: 24,
        textAlign: "center"
    };

    const productosGridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "32px",
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        marginBottom: 40
    };

    const cardStyle: React.CSSProperties = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
        padding: "28px 24px",
        width: "100%",
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };

    const footerStyle: React.CSSProperties = {
        fontSize: "15px",
        color: "#666",
        background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
        colorScheme: "light",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        width: "100%",
        padding: "1.2rem 0 0.5rem 0",
        textAlign: "center",
        marginTop: "auto"
    };

    return (
        <div style={pageStyle}>
            <Toast ref={toast} />

            <header style={headerStyle}>
                <h1 style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "2.2rem",
                    margin: 0,
                    letterSpacing: "1px"
                }}>
                    {comprador ? `Bienvenido ${comprador.usuario.nombre}` : 'Bienvenido'}
                </h1>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
                    <Button
                        label={`Carrito (${totalItemsCarrito})`}
                        icon="pi pi-shopping-cart"
                        onClick={irAlCarrito}
                        style={{
                            background: "#fff",
                            color: "#1976D2",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 16,
                            boxShadow: "0 2px 8px #1976D211"
                        }}
                        disabled={totalItemsCarrito === 0}
                    />
                    <Button
                        label="Mis Pedidos"
                        icon="pi pi-list"
                        onClick={() => navigate('/mis-pedidos')}
                        style={{
                            background: "#fff",
                            color: "#43A047",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 16,
                            boxShadow: "0 2px 8px #43A04722"
                        }}
                    />
                </div>
            </header>

            <hr
                style={{
                    border: "none",
                    height: "2px",
                    backgroundColor: "#ff6600",
                    marginBottom: "20px",
                    width: "80%",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            />

            <div style={productosGridStyle}>
                {loading ? (
                    <div style={{ gridColumn: "1/-1", textAlign: "center" }}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: "#1976D2" }}></i>
                    </div>
                ) : (
                    productos.map(producto => (
                        <Card
                            key={producto.id}
                            style={cardStyle}
                            title={<span style={{ color: "#1976D2", fontWeight: 700 }}>{producto.nombre}</span>}
                            subTitle={
                                <span style={{ color: "#43A047", fontWeight: 600 }}>
                                    ${producto.precio} - {producto.locatario.nombreTienda}
                                </span>
                            }
                        >
                            <div style={{ alignItems: 'center', display: "flex", flexDirection: "column", gap: 12 }}>
                                <Tag
                                    severity={producto.stock > 5 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}
                                    value={producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 15,
                                        borderRadius: 8,
                                        marginBottom: 8
                                    }}
                                />

                                <p style={{
                                    color: "#222",
                                    fontSize: 15,
                                    margin: 0,
                                    marginBottom: 8,
                                    textAlign: "center"
                                }}>
                                    {(producto.descripcion && producto.descripcion.length <= 30) ?
                                        producto.descripcion :
                                        producto.descripcion ? `${producto.descripcion.substring(0, 30)}...` : 'Descripción no disponible'}
                                </p>

                                <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%", justifyContent: "center" }}>
                                    <InputNumber
                                        value={cantidadesTemporales[producto.id] || 0}
                                        onValueChange={(e) => handleCantidadChange(producto.id, e.value || 0)}
                                        showButtons
                                        min={0}
                                        max={producto.stock}
                                        buttonLayout="horizontal"
                                        decrementButtonClassName="p-button-danger"
                                        incrementButtonClassName="p-button-success"
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus"
                                        style={{ width: 90 }}
                                    />
                                    <Button
                                        label="Agregar al carrito"
                                        icon="pi pi-shopping-cart"
                                        style={{
                                            background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                                            border: "none",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 15,
                                            color: "#fff",
                                            boxShadow: "0 2px 8px #1976D244"
                                        }}
                                        onClick={() => agregarAlCarrito(producto)}
                                        disabled={producto.stock <= 0 || cantidadesTemporales[producto.id] <= 0}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <footer style={footerStyle}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <LogoutButton />
                    <p style={{ color: "#fff", margin: 0 }}>&copy; 2023 Comercio Digital y Local - Todos los derechos reservados</p>
                    <p style={{ color: "#fff", margin: 0 }}>Creado por <b>Run Mafia</b></p>
                </div>
            </footer>
        </div>
    );
};

export default PrincipalPage;