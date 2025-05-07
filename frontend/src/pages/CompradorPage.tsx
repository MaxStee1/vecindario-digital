import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const CompradorPage = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [pedidoDialogVisible, setPedidoDialogVisible] = useState(false);
    const [calificacionDialogVisible, setCalificacionDialogVisible] = useState(false);
    const [calificacion, setCalificacion] = useState(0);

    // Filtros
    const [categorias, setCategorias] = useState([
        { label: "Alimentos", value: "Alimentos", checked: false },
        { label: "Bebidas", value: "Bebidas", checked: false },
        { label: "Ropa", value: "Ropa", checked: false },
    ]);
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                // Obtener productos
                const productosRes = await axios.get("http://localhost:3001/api/productos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProductos(productosRes.data);
                setFilteredProductos(productosRes.data); // Inicialmente, todos los productos están visibles
            } catch (error) {
                console.error("Error al obtener datos", error);
                alert("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
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
            productosFiltrados = productosFiltrados.filter((producto) => producto.price >= parseFloat(precioMin));
        }
        if (precioMax) {
            productosFiltrados = productosFiltrados.filter((producto) => producto.price <= parseFloat(precioMax));
        }

        setFilteredProductos(productosFiltrados);
    };

    const crearPedido = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost:3001/api/pedidos",
                { productoId: selectedProducto.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Pedido creado exitosamente.");
            setPedidoDialogVisible(false);
        } catch (error) {
            console.error("Error al crear el pedido", error);
            alert("Hubo un problema al crear el pedido.");
        }
    };

    const calificarVendedor = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `http://localhost:3001/api/vendedores/${selectedProducto.vendedorId}/calificar`,
                { calificacion },
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
        <div>
            <header>
                <h2>Panel de Comprador</h2>
            </header>
            <main className="compradorMain" style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                {/* Panel de filtros */}
                <aside
                    className="filtros"
                    style={{
                        width: "20%",
                        backgroundColor: "rgba(20% 20% 20% / 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                        marginRight: "20px",
                    }}
                >
                    <h3>Filtros</h3>
                    <div>
                        <h4>Categorías</h4>
                        {categorias.map((categoria, index) => (
                            <div key={index} className="p-field-checkbox">
                                <Checkbox
                                    inputId={`categoria-${index}`}
                                    checked={categoria.checked}
                                    onChange={(e) => {
                                        const updatedCategorias = [...categorias];
                                        updatedCategorias[index].checked = e.checked;
                                        setCategorias(updatedCategorias);
                                    }}
                                />
                                <label htmlFor={`categoria-${index}`}>{categoria.label}</label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h4>Precio</h4>
                        <div className="p-field">
                            <label htmlFor="precioMin">Mínimo</label>
                            <input
                                type="number"
                                id="precioMin"
                                value={precioMin}
                                onChange={(e) => setPrecioMin(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="precioMax">Máximo</label>
                            <input
                                type="number"
                                id="precioMax"
                                value={precioMax}
                                onChange={(e) => setPrecioMax(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <Button label="Aplicar Filtros" onClick={aplicarFiltros} style={{ marginTop: "20px" }} />
                </aside>

                {/* Tabla de productos */}
                <section
                    className="productos"
                    style={{
                        width: "75%",
                        backgroundColor: "rgba(20% 20% 20% / 0.8)",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    <h3>Productos</h3>
                    <DataTable value={filteredProductos} tableStyle={{ minWidth: "auto", alignItems: "center" }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Nombre"></Column>
                        <Column field="price" header="Precio"></Column>
                        <Column field="categoria" header="Categoría"></Column>
                        <Column
                            header="Acciones"
                            body={(rowData) => (
                                <div>
                                    <Button
                                        label="Comprar"
                                        className="p-button-success"
                                        style={{ marginRight: "10px" }}
                                        onClick={() => {
                                            setSelectedProducto(rowData);
                                            setPedidoDialogVisible(true);
                                        }}
                                    />
                                    <Button
                                        label="Calificar"
                                        className="p-button-warning"
                                        onClick={() => {
                                            setSelectedProducto(rowData);
                                            setCalificacionDialogVisible(true);
                                        }}
                                    />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </section>
            </main>

            {/* Dialogo para crear pedido */}
            <Dialog
                header="Crear Pedido"
                visible={pedidoDialogVisible}
                style={{ width: "50vw" }}
                onHide={() => setPedidoDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Confirmar" icon="pi pi-check" onClick={crearPedido} />
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setPedidoDialogVisible(false)} />
                    </div>
                }
            >
                {selectedProducto && (
                    <p>
                        ¿Estás seguro de que deseas comprar el producto <strong>{selectedProducto.name}</strong> por{" "}
                        <strong>${selectedProducto.price}</strong>?
                    </p>
                )}
            </Dialog>

            {/* Dialogo para calificar vendedor */}
            <Dialog
                header="Calificar Vendedor"
                visible={calificacionDialogVisible}
                style={{ width: "50vw" }}
                onHide={() => setCalificacionDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Enviar" icon="pi pi-check" onClick={calificarVendedor} />
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setCalificacionDialogVisible(false)} />
                    </div>
                }
            >
                {selectedProducto && (
                    <div>
                        <p>
                            Califica al vendedor del producto <strong>{selectedProducto.name}</strong>:
                        </p>
                        <input
                            type="number"
                            value={calificacion}
                            onChange={(e) => setCalificacion(e.target.value)}
                            placeholder="Ingresa una calificación del 1 al 5"
                            style={{ width: "100%" }}
                        />
                    </div>
                )}
            </Dialog>

            <footer>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>
        </div>
    );
};

export default CompradorPage;