import React, { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const LocatarioPage = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [historialVentas, setHistorialVentas] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);

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

                // Obtener proveedores
                const proveedoresRes = await axios.get("http://localhost:3001/api/proveedores", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Obtener pedidos
                const pedidosRes = await axios.get("http://localhost:3001/api/pedidos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Obtener historial de ventas
                const historialRes = await axios.get("http://localhost:3001/api/ventas", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProductos(productosRes.data);
                setProveedores(proveedoresRes.data);
                setPedidos(pedidosRes.data);
                setHistorialVentas(historialRes.data);
            } catch (error) {
                console.error("Error al obtener datos", error);
                alert("Hubo un problema al cargar los datos. Por favor, intenta nuevamente.");
            }
        };

        fetchData();
    }, []);

    const openEditDialog = (producto) => {
        setSelectedProducto(producto);
        setEditDialogVisible(true);
    };

    const saveProducto = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:3001/api/productos/${selectedProducto.id}`, selectedProducto, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Producto actualizado correctamente.");
            setEditDialogVisible(false);
            // Actualizar la lista de productos
            setProductos((prev) =>
                prev.map((p) => (p.id === selectedProducto.id ? selectedProducto : p))
            );
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            alert("Hubo un problema al actualizar el producto.");
        }
    };

    return (
        <div>
            <header>
                <h2>Panel de Locatario</h2>
            </header>
            <main className="locatarioMain" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Sección de productos */}
                <h3>Productos</h3>
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
                    <DataTable value={productos} tableStyle={{ minWidth: "auto", alignItems: "center" }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Nombre"></Column>
                        <Column field="description" header="Descripción"></Column>
                        <Column field="price" header="Precio"></Column>
                        <Column
                            header="Acciones"
                            body={(rowData) => (
                                <div>
                                    <Button
                                        label="Editar"
                                        className="p-button-warning"
                                        style={{ marginRight: "10px" }}
                                        onClick={() => openEditDialog(rowData)}
                                    />
                                    <Button label="Eliminar" className="p-button-danger" />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>

                {/* Sección de proveedores */}
                <h3>Proveedores</h3>
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
                    <DataTable value={proveedores} tableStyle={{ minWidth: "auto", alignItems: "center" }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Nombre"></Column>
                        <Column field="contact" header="Contacto"></Column>
                        <Column
                            header="Acciones"
                            body={(rowData) => (
                                <div>
                                    <Button label="Editar" className="p-button-warning" style={{ marginRight: "10px" }} />
                                    <Button label="Eliminar" className="p-button-danger" />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>

                {/* Sección de pedidos */}
                <h3>Pedidos Recibidos</h3>
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
                    <DataTable value={pedidos} tableStyle={{ minWidth: "auto", alignItems: "center" }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="cliente" header="Cliente"></Column>
                        <Column field="estado" header="Estado"></Column>
                        <Column field="total" header="Total"></Column>
                    </DataTable>
                </div>

                {/* Sección de historial de ventas */}
                <h3>Historial de Ventas</h3>
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
                    <DataTable value={historialVentas} tableStyle={{ minWidth: "auto", alignItems: "center" }}>
                        <Column field="id" header="ID"></Column>
                        <Column field="producto" header="Producto"></Column>
                        <Column field="cantidad" header="Cantidad"></Column>
                        <Column field="total" header="Total"></Column>
                    </DataTable>
                </div>
            </main>

            {/* Dialogo para editar productos */}
            <Dialog
                header="Editar Producto"
                visible={editDialogVisible}
                style={{ width: "50vw" }}
                onHide={() => setEditDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Guardar" icon="pi pi-check" onClick={saveProducto} />
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setEditDialogVisible(false)} />
                    </div>
                }
            >
                {selectedProducto && (
                    <div>
                        <div className="p-field">
                            <label htmlFor="name">Nombre</label>
                            <InputText
                                id="name"
                                value={selectedProducto.name}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="description">Descripción</label>
                            <InputText
                                id="description"
                                value={selectedProducto.description}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="price">Precio</label>
                            <InputText
                                id="price"
                                value={selectedProducto.price}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, price: e.target.value })
                                }
                            />
                        </div>
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

export default LocatarioPage;