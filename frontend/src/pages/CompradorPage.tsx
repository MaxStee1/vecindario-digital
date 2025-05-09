import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { useNavigate } from "react-router-dom";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    vendedorId: number;
}

const CompradorPage = () => {
    // Estado para almacenar todos los productos
    const [productos, setProductos] = useState<Producto[]>([]);

    // Estado para almacenar los productos filtrados
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);

    // Estado para los productos seleccionados para la compra
    const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>([]);

    // Estado para el producto seleccionado en acciones específicas
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

    // Estado para mostrar el diálogo de pedido
    const [pedidoDialogVisible, setPedidoDialogVisible] = useState(false);

    // Estado para mostrar el diálogo de productos seleccionados
    const [productosSeleccionadosDialogVisible, setProductosSeleccionadosDialogVisible] = useState(false);

    // Estado para mostrar el diálogo de calificación
    const [calificacionDialogVisible, setCalificacionDialogVisible] = useState(false);

    // Estado para la calificación del vendedor
    const [calificacion, setCalificacion] = useState<number>(0);

    // Estado para el filtro global por nombre
    const [globalFilterNombre, setGlobalFilterNombre] = useState<string>("");

    // Estado para las categorías disponibles
    const [categorias, setCategorias] = useState([
        { label: "Alimentos", value: "Alimentos", checked: false },
        { label: "Bebidas", value: "Bebidas", checked: false },
        { label: "Ropa", value: "Ropa", checked: false },
    ]);

    // Estado para los rangos de precios
    const [precioMin, setPrecioMin] = useState<string>("");
    const [precioMax, setPrecioMax] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Ruta necesaria en el backend: GET /comprador/productos
        // Esta ruta debe devolver todos los productos disponibles para los compradores
        const fetchData = async () => {
            try {
                const productosRes = await axios.get("http://localhost:3001/comprador/productos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductos(productosRes.data);
                setFilteredProductos(productosRes.data);
            } catch (error) {
                console.error("Error al obtener productos", error);
                alert("Hubo un problema al cargar los productos.");
            }
        };

        fetchData();
    }, []);

    const aplicarFiltros = () => {
        let productosFiltrados = productos;

        // Filtrar por categorías seleccionadas
        const categoriasSeleccionadas = categorias.filter((cat) => cat.checked).map((cat) => cat.value);
        if (categoriasSeleccionadas.length > 0) {
            productosFiltrados = productosFiltrados.filter((producto) =>
                categoriasSeleccionadas.includes(producto.categoria)
            );
        }

        // Filtrar por rango de precios
        if (precioMin) {
            productosFiltrados = productosFiltrados.filter((producto) => producto.precio >= parseFloat(precioMin));
        }
        if (precioMax) {
            productosFiltrados = productosFiltrados.filter((producto) => producto.precio <= parseFloat(precioMax));
        }

        // Filtrar por nombre
        productosFiltrados = productosFiltrados.filter((producto) =>
            producto.nombre.toLowerCase().includes(globalFilterNombre.toLowerCase())
        );

        setFilteredProductos(productosFiltrados);
    };

    const agregarProductoSeleccionado = (producto: Producto) => {
        // Agregar un producto a la lista de productos seleccionados
        setProductosSeleccionados((prev) => [...prev, producto]);
    };

    const eliminarProductoSeleccionado = (productoId: number) => {
        // Eliminar un producto de la lista de productos seleccionados
        setProductosSeleccionados((prev) => prev.filter((producto) => producto.id !== productoId));
    };

    const realizarCompra = async () => {
        const token = localStorage.getItem("token");

        // Ruta necesaria en el backend: POST /comprador/pedidos
        // Esta ruta debe crear un pedido con los productos seleccionados
        try {
            const pedidos = productosSeleccionados.map((producto) => ({
                productoId: producto.id,
                cantidad: 1, // Aquí puedes ajustar la cantidad según sea necesario
            }));

            await axios.post(
                "http://localhost:3001/comprador/pedidos",
                { pedidos },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Compra realizada exitosamente.");
            setProductosSeleccionados([]);
            setProductosSeleccionadosDialogVisible(false);
        } catch (error) {
            console.error("Error al realizar la compra", error);
            alert("Hubo un problema al realizar la compra.");
        }
    };

    const calificarVendedor = async () => {
        const token = localStorage.getItem("token");

        // Ruta necesaria en el backend: POST /comprador/valoraciones
        // Esta ruta debe permitir calificar al vendedor del producto seleccionado
        try {
            await axios.post(
                "http://localhost:3001/comprador/valoraciones",
                {
                    locatarioId: selectedProducto?.vendedorId,
                    calificacion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Vendedor calificado exitosamente.");
            setCalificacionDialogVisible(false);
        } catch (error) {
            console.error("Error al calificar al vendedor", error);
            alert("Hubo un problema al calificar al vendedor.");
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#ffffff", // Fondo blanco de toda la pantalla
                minHeight: "100vh", // Altura mínima para cubrir toda la pantalla
                padding: "20px",
            }}
        >
            <div
                style={{
                    marginLeft: "20px",
                    padding: "20px",
                    backgroundColor: "#ffffff", // Fondo blanco del cuadro
                    color: "#000000", // Texto negro
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ color: "#000000", marginBottom: "10px" }}>Panel de Comprador</h2>
                    <Button
                        label="Cerrar Sesión"
                        onClick={() => {
                            localStorage.removeItem("token"); // Elimina el token
                            navigate("/"); // Redirige al HomePage
                        }}
                        style={{
                            backgroundColor: "#007bff", // Botón azul
                            borderColor: "#007bff",
                            color: "#fff",
                        }}
                    />
                </div>
                <hr
                    style={{
                        border: "none",
                        height: "2px",
                        backgroundColor: "#ff6600", // Línea naranja
                        marginBottom: "20px",
                    }}
                />
                <div style={{ display: "flex", gap: "20px" }}>
                    {/* Panel de filtros */}
                    <aside
                        style={{
                            width: "25%",
                            backgroundColor: "#f8f9fa", // Fondo gris claro
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3 style={{ color: "#000000" }}>Filtros</h3>
                        <div>
                            <h4 style={{ color: "#000000" }}>Categorías</h4>
                            {categorias.map((categoria, index) => (
                                <div key={index} className="p-field-checkbox">
                                    <Checkbox
                                        inputId={`categoria-${index}`}
                                        checked={categoria.checked}
                                        onChange={(e) => {
                                            const updatedCategorias = [...categorias];
                                            updatedCategorias[index].checked = e.checked ?? false; // Asegura que sea booleano
                                            setCategorias(updatedCategorias);
                                        }}
                                    />
                                    <label htmlFor={`categoria-${index}`}>{categoria.label}</label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: "#000000" }}>Precio</h4>
                            <div className="p-field">
                                <label htmlFor="precioMin">Mínimo</label>
                                <InputText
                                    id="precioMin"
                                    value={precioMin}
                                    onChange={(e) => setPrecioMin(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="precioMax">Máximo</label>
                                <InputText
                                    id="precioMax"
                                    value={precioMax}
                                    onChange={(e) => setPrecioMax(e.target.value)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>
                        <Button
                            label="Aplicar Filtros"
                            onClick={aplicarFiltros}
                            style={{
                                marginTop: "20px",
                                backgroundColor: "#007bff", // Botón azul
                                borderColor: "#007bff",
                                color: "#fff",
                            }}
                        />
                    </aside>

                    {/* Tabla de productos */}
                    <section style={{ width: "75%" }}>
                        <DataTable
                            value={filteredProductos}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Column field="id" header="ID" sortable />
                            <Column field="nombre" header="Nombre" sortable />
                            <Column field="descripcion" header="Descripción" />
                            <Column field="precio" header="Precio" sortable />
                            <Column field="stock" header="Stock" sortable />
                            <Column
                                header="Acciones"
                                body={(rowData: Producto) => (
                                    <div>
                                        <Button
                                            label="Agregar"
                                            onClick={() => agregarProductoSeleccionado(rowData)}
                                            style={{
                                                marginRight: "10px",
                                                backgroundColor: "#007bff", // Botón azul
                                                borderColor: "#007bff",
                                                color: "#fff",
                                            }}
                                        />
                                        <Button
                                            label="Calificar"
                                            onClick={() => {
                                                setSelectedProducto(rowData);
                                                setCalificacionDialogVisible(true);
                                            }}
                                            style={{
                                                backgroundColor: "#007bff", // Botón azul
                                                borderColor: "#007bff",
                                                color: "#fff",
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </DataTable>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CompradorPage;

