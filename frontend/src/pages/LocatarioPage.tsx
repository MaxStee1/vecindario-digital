import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}

const LocatarioPage = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [globalFilterNombre, setGlobalFilterNombre] = useState<string>("");
    const [globalFilterDescripcion, setGlobalFilterDescripcion] = useState<string>("");
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const navigate = useNavigate();
    const [newProducto, setNewProducto] = useState<Producto>({
        id: 0,
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const productosRes = await axios.get("http://localhost:3001/locatarios/productos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProductos(productosRes.data);
            } catch (error) {
                console.error("Error al obtener productos", error);
            }
        };

        fetchData();
    }, []);

    const openEditDialog = (producto: Producto) => {
        setSelectedProducto(producto);
        setEditDialogVisible(true);
    };

    const saveProducto = async () => {
        const token = localStorage.getItem("token");
        if (!selectedProducto) return;

        try {
            await axios.put(`http://localhost:3001/locatarios/productos/${selectedProducto.id}`, selectedProducto, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Producto actualizado correctamente.");
            setEditDialogVisible(false);
            setProductos((prev) =>
                prev.map((p) => (p.id === selectedProducto.id ? selectedProducto : p))
            );
        } catch (error) {
            console.error("Error al actualizar el producto", error);
        }
    };

    const addProducto = async () => {
        const token = localStorage.getItem("token");

        if (!newProducto.nombre || newProducto.precio <= 0 || newProducto.stock < 0) {
            alert("Por favor, completa todos los campos obligatorios correctamente.");
            return;
        }

        const productoData = {
            nombre: newProducto.nombre,
            descripcion: newProducto.descripcion,
            precio: newProducto.precio,
            stock: newProducto.stock,
        };

        try {
            const response = await axios.post("http://localhost:3001/locatarios/productos", productoData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Producto agregado correctamente.");
            setAddDialogVisible(false);
            setProductos((prev) => [...prev, response.data]);
            setNewProducto({
                id: 0,
                nombre: "",
                descripcion: "",
                precio: 0,
                stock: 0,
            });
        } catch (error: any) {
            console.error("Error al agregar el producto:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Hubo un problema al agregar el producto.");
            }
        }
    };

    const deleteProducto = async (productoId: number) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:3001/locatarios/productos/${productoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Producto eliminado correctamente.");
            setProductos((prev) => prev.filter((p) => p.id !== productoId));
        } catch (error) {
            console.error("Error al eliminar el producto", error);
        }
    };

    const onFilterNombre = (value: string) => {
        setGlobalFilterNombre(value.toLowerCase());
    };

    const onFilterDescripcion = (value: string) => {
        setGlobalFilterDescripcion(value.toLowerCase());
    };

    const filteredProductos = productos.filter(
        (producto) =>
            (producto.nombre?.toLowerCase() || "").includes(globalFilterNombre) &&
            (producto.descripcion?.toLowerCase() || "").includes(globalFilterDescripcion)
    );

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
                    <h2 style={{ color: "#000000", marginBottom: "10px" }}>Panel de Locatario</h2>
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
                <Button
                    label="Agregar Producto"
                    onClick={() => setAddDialogVisible(true)}
                    className="p-button-success"
                    style={{
                        marginBottom: "20px",
                        backgroundColor: "#007bff", // Botón azul
                        borderColor: "#007bff",
                        color: "#fff",
                    }}
                />
                <DataTable
                    value={filteredProductos}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    sortMode="multiple"
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Column field="id" header="ID" sortable />
                    <Column
                        field="nombre"
                        header={
                            <div>
                                <span style={{ color: "#000000" }}>Nombre</span>
                                <InputText
                                    placeholder="Buscar"
                                    value={globalFilterNombre}
                                    onChange={(e) => onFilterNombre(e.target.value)}
                                    style={{
                                        marginLeft: "10px",
                                        width: "150px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f0f0f0", // Fondo gris claro
                                        color: "#000000", // Texto blanco
                                    }}
                                />
                            </div>
                        }
                    />
                    <Column
                        field="descripcion"
                        header={
                            <div>
                                <span style={{ color: "#000000" }}>Descripción</span>
                                <InputText
                                    placeholder="Buscar"
                                    value={globalFilterDescripcion}
                                    onChange={(e) => onFilterDescripcion(e.target.value)}
                                    style={{
                                        marginLeft: "10px",
                                        width: "150px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f0f0f0", // Fondo gris claro
                                        color: "#000000", // Texto blanco
                                    }}
                                />
                            </div>
                        }
                    />
                    <Column field="precio" header="Precio" sortable />
                    <Column field="stock" header="Stock" sortable />
                    <Column
                        header="Acciones"
                        body={(rowData: Producto) => (
                            <div>
                                <Button
                                    label="Editar"
                                    onClick={() => openEditDialog(rowData)}
                                    style={{
                                        marginRight: "10px",
                                        backgroundColor: "#007bff", // Botón azul
                                        borderColor: "#007bff",
                                        color: "#fff",
                                    }}
                                />
                                <Button
                                    label="Eliminar"
                                    onClick={() => deleteProducto(rowData.id)}
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
            </div>
        

            {/* Dialogo para agregar producto */}
            <Dialog
                header="Agregar Producto"
                visible={addDialogVisible}
                onHide={() => setAddDialogVisible(false)}
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)", // Fondo blanco semitransparente
                    color: "#000000", // Texto negro
                }}
                footer={
                    <div>
                        <Button
                            label="Guardar"
                            onClick={addProducto}
                            className="p-button-success"
                            style={{
                                backgroundColor: "#007bff", // Botón azul
                                borderColor: "#007bff",
                                color: "#fff",
                            }}
                        />
                        <Button
                            label="Cancelar"
                            onClick={() => setAddDialogVisible(false)}
                            className="p-button-danger"
                            style={{
                                backgroundColor: "#007bff", // Botón azul
                                borderColor: "#007bff",
                                color: "#fff",
                            }}
                        />
                    </div>
                }
            >
                <div>
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={newProducto.nombre}
                            onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText
                            id="descripcion"
                            value={newProducto.descripcion}
                            onChange={(e) => setNewProducto({ ...newProducto, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="precio">Precio</label>
                        <InputText
                            id="precio"
                            type="number"
                            value={newProducto.precio.toString()}
                            onChange={(e) => setNewProducto({ ...newProducto, precio: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="stock">Stock</label>
                        <InputText
                            id="stock"
                            type="number"
                            value={newProducto.stock.toString()}
                            onChange={(e) => setNewProducto({ ...newProducto, stock: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            </Dialog>

            {/* Dialogo para editar producto */}
            <Dialog
                header="Editar Producto"
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)", // Fondo blanco semitransparente
                    color: "#000000", // Texto negro
                }}
                footer={
                    <div>
                        <Button
                            label="Guardar"
                            onClick={saveProducto}
                            className="p-button-success"
                            style={{
                                backgroundColor: "#007bff", // Botón azul
                                borderColor: "#007bff",
                                color: "#fff",
                            }}
                        />
                        <Button
                            label="Cancelar"
                            onClick={() => setEditDialogVisible(false)}
                            className="p-button-danger"
                            style={{
                                backgroundColor: "#007bff", // Botón azul
                                borderColor: "#007bff",
                                color: "#fff",
                            }}
                        />
                    </div>
                }
            >
                {selectedProducto && (
                    <div>
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText
                                id="nombre"
                                value={selectedProducto.nombre}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, nombre: e.target.value })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="descripcion">Descripción</label>
                            <InputText
                                id="descripcion"
                                value={selectedProducto.descripcion}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, descripcion: e.target.value })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="precio">Precio</label>
                            <InputText
                                id="precio"
                                type="number"
                                value={selectedProducto.precio.toString()}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, precio: parseFloat(e.target.value) })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="stock">Stock</label>
                            <InputText
                                id="stock"
                                type="number"
                                value={selectedProducto.stock.toString()}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, stock: parseInt(e.target.value) })
                                }
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default LocatarioPage;