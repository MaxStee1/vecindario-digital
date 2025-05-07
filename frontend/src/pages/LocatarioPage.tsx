import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}

const LocatarioPage = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
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
    
        // Verifica que los campos obligatorios estén completos
        if (!newProducto.nombre || newProducto.precio <= 0 || newProducto.stock < 0) {
            alert("Por favor, completa todos los campos obligatorios correctamente.");
            return;
        }
    
        // Crea un objeto sin el campo `id`
        const productoData = {
            nombre: newProducto.nombre,
            descripcion: newProducto.descripcion,
            precio: newProducto.precio,
            stock: newProducto.stock,
        };
    
        console.log("Producto a agregar:", productoData); // Verifica los datos enviados
    
        try {
            const response = await axios.post("http://localhost:3001/locatarios/productos", productoData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Producto agregado correctamente.");
            setAddDialogVisible(false);
    
            // Actualiza la lista de productos con el nuevo producto
            setProductos((prev) => [...prev, response.data]);
    
            // Resetea el formulario
            setNewProducto({
                id: 0,
                nombre: "",
                descripcion: "",
                precio: 0,
                stock: 0,
            });
        } catch (error: any) {
            console.error("Error al agregar el producto:", error);
    
            // Muestra un mensaje de error más detallado si está disponible
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Hubo un problema al agregar el producto.");
            }
        }
    };
    //falta crear el servicio en el backend para eliminar el producto
    // y agregar la ruta en el controller
    // y el servicio en el locatario.service.ts
    // y el dto para eliminar el producto
    // y el guard para verificar que el locatario sea el dueño del producto
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

    return (
        <div>
            <h2>Panel de Locatario</h2>
            <Button
                label="Agregar Producto"
                onClick={() => setAddDialogVisible(true)}
                className="p-button-success"
                style={{ marginBottom: "50px" }}
            />
            <DataTable value={productos} paginator rows={10} rowsPerPageOptions={[5, 10, 20]}>
                <Column field="id" header="ID" />
                <Column field="nombre" header="Nombre" />
                <Column field="descripcion" header="Descripción" />
                <Column field="precio" header="Precio" />
                <Column field="stock" header="Stock" />
                <Column
                    header="Acciones"
                    body={(rowData: Producto) => (
                        <div>
                            <Button
                                label="Editar"
                                onClick={() => openEditDialog(rowData)}
                                className="p-button-warning"
                                style={{ marginRight: "10px" }}
                            />
                            <Button
                                label="Eliminar"
                                onClick={() => deleteProducto(rowData.id)}
                                className="p-button-danger"
                            />
                        </div>
                    )}
                />
            </DataTable>

            {/* Dialogo para agregar producto */}
                        <Dialog
                header="Agregar Producto"
                visible={addDialogVisible}
                onHide={() => setAddDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Guardar" onClick={addProducto} className="p-button-success" />
                        <Button label="Cancelar" onClick={() => setAddDialogVisible(false)} className="p-button-danger" />
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
                footer={
                    <div>
                        <Button label="Guardar" onClick={saveProducto} className="p-button-success" />
                        <Button label="Cancelar" onClick={() => setEditDialogVisible(false)} className="p-button-danger" />
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