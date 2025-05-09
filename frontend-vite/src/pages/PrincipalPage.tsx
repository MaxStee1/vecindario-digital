import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/principal.css';
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
    const [cantidadesTemporales, setCantidadesTemporales] = useState<{[key: number]: number}>({});
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/comprador/productos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
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

    const agregarAlCarrito = (producto: Producto) => {
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

        setCarrito(prev => {
            const existe = prev.find(item => item.productoId === producto.id);
            
            if (existe) {
                return prev.map(item => 
                    item.productoId === producto.id 
                    ? {...item, cantidad: item.cantidad + cantidad} 
                    : item
                );
            }
            
            return [...prev, {
                productoId: producto.id,
                cantidad,
                producto
            }];
        });

        // Resetear la cantidad temporal
        setCantidadesTemporales(prev => ({
            ...prev,
            [producto.id]: 0
        }));

        toast.current?.show({
            severity: 'success',
            summary: 'Producto agregado',
            detail: `${cantidad} ${producto.nombre} añadido(s) al carrito`,
            life: 2000
        });
    };

    const irAlCarrito = () => {
        navigate('/carrito');
    };

    const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="principal-container">
            <Toast ref={toast} />
            
            <header className="principal-header">
                <h1>Bienvenido</h1>
                <Button 
                    label={`Carrito (${totalItemsCarrito})`}
                    icon="pi pi-shopping-cart"
                    onClick={irAlCarrito}
                    className="p-button-rounded p-button-success"
                    disabled={totalItemsCarrito === 0}
                />
            </header>
            <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600", // Línea naranja
                        marginBottom: "20px",
                        width: "80%", // Línea que ocupa todo el ancho
                    }}
                />

            <div className="productos-grid">
                {loading ? (
                    <div className="loading-spinner">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    </div>
                ) : (
                    productos.map(producto => (
                        <Card 
                            key={producto.id} 
                            className="producto-card"
                            title={producto.nombre}
                            subTitle={`$ ${producto.precio} - ${producto.locaratio.nombreTienda}`}
                        >
                            <div className="producto-content" style={{ alignItems: 'center' }}>
                                <Tag 
                                    severity={producto.stock > 5 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}
                                    value={producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                    className="stock-tag"
                                />
                                
                                <p className="producto-descripcion">
                                    {producto.descripcion.length <= 30 ?
                                        producto.descripcion : 
                                        `${producto.descripcion.substring(0, 30)}...`
                                    }
                                </p>
                                
                                <div className="producto-actions">
                                    <div className='input-container'>
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
                                        />   
                                    </div>        
                                    <Button 
                                        label="Agregar al carrito" 
                                        icon="pi pi-shopping-cart" 
                                        className="p-button-success" 
                                        onClick={() => agregarAlCarrito(producto)} 
                                        disabled={producto.stock <= 0 || cantidadesTemporales[producto.id] <= 0}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <footer className="principal-footer">
                <LogoutButton />
                <p>© 2023 Comercio Digital y Local - Todos los derechos reservados</p>
                <p>Creado por <b>Run Mafia</b></p>
            </footer>
        </div>
    );
};

export default PrincipalPage;