import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";


const LocatarioPage = () => {
    const [productos, setProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState<any>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [newProducto, setNewProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
    });
    const [locatarioNombre, setLocatarioNombre] = useState<string>('');
    const [NombreTienda, setNombreTienda] = useState<string>('');
    const toast = useRef<Toast>(null);

    const categorias = [
        { label: 'Vegetariano', value: 'vegetariano' },
        { label: 'Vegano', value: 'vegano' },
        { label: 'Con Gluten', value: 'con_gluten' },
        { label: 'Sin Gluten', value: 'sin_gluten' }
    ];

    const metodosEntrega = [
        { label: 'Envío', value: 'envio' },
        { label: 'Retiro en tienda', value: 'retiro' }
    ];

    useEffect(() => {
        fetchProductos();
        obtenerLocatario();
    }, []);

    const fetchProductos = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:3001/locatarios/productos", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("data", response.data);
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos", error);
            showError("Hubo un problema al cargar los productos.");
        }
    };

    const openEditDialog = (producto: any) => {
        setSelectedProducto({...producto});
        setEditDialogVisible(true);
    };

    const openCreateDialog = () => {
        setNewProducto({
            nombre: '',
            descripcion: '',
            precio: 0,
            stock: 0,
        });
        setCreateDialogVisible(true);
    };

    const saveProducto = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:3001/locatarios/productos/${selectedProducto.id}`,
                selectedProducto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showSucces("Producto actualizado correctamente");
            setEditDialogVisible(false);
            fetchProductos();
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            showError("Hubo un problema al actualizar el producto.")
        }
    };

    const createProducto = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost:3001/locatarios/productos",
                newProducto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showSucces("Producto creado correctamente.");
            setCreateDialogVisible(false);
            fetchProductos();
        } catch (error) {
            console.error("Error al crear el producto", error);
            showError("Hubo un problema al crear el producto.");
        }
    };

    const deleteProducto = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `http://localhost:3001/locatarios/productos/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showSucces("Producto eliminado correctamente.");
            fetchProductos();
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            showError("Hubo un problema al eliminar el producto.");
        }
    };

    const showSucces = (message: string) => {
        toast.current?.show({severity:'success', summary: 'Éxito', detail: message, life: 3000});
    };

    const showError = (message: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    };

    const obtenerLocatario = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3001/locatarios/info", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLocatarioNombre(response.data.usuario.nombre);
            setNombreTienda(response.data.nombreTienda);
        } catch (error) {
            console.error("Error al obtener la información del locatario", error);
            showError("Hubo un problema al cargar la información del locatario.");
        }
    }
    
    return (
        <div>
            <Toast ref={toast} />
            <header>
                <h2 style={{padding:"1rem", textAlign:"center"}}>Administracion de productos de <strong>{NombreTienda}</strong></h2>
                <h3 style={{padding:"1rem", textAlign:"center"}}>Bienvenido, {locatarioNombre}</h3>
            </header>
            <main className="locatarioMain" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Seccion de productos */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', alignItems: 'center' }}>
                    <h3>Mis Productos</h3>
                    <Button 
                        label="Agregar Producto"
                        icon="pi pi-plus"
                        onClick={openCreateDialog}
                    />
                </div>
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
                    <DataTable value={productos} tableStyle={{ minWidth: "auto", alignItems: "center" }} style={{ borderRadius: "10px" }}> 
                        <Column field="id" header="ID" sortable></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="descripcion" header="Descripcion"></Column>
                        <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio}`}></Column>
                        <Column field="stock" header="Stock"></Column>
                        <Column field="categoria" header="Categoría"></Column>
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
                                    <Button
                                        label="Eliminar"
                                        className="p-button-danger"
                                        onClick={() => deleteProducto(rowData.id)}
                                    />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </main>

            {/* Dialogo para editar productos */}
            <Dialog
                header="Editar Producto"
                visible={editDialogVisible}
                style={{ width: "50vw", backgroundColor: "rgba(10% 10% 10% / 1)", padding:"10px", borderRadius:"10px", boxShadow:"0 0 10px rgba(100% 100% 100% / 1)" }}
                onHide={() => setEditDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Guardar" icon="pi pi-check" onClick={saveProducto} />
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setEditDialogVisible(false)} />
                    </div>
                }
            >
                {selectedProducto && (
                    <div className="p-fluid">
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
                            <InputNumber
                                id="precio"
                                value={selectedProducto.precio}
                                onValueChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, precio: e.value || 0 })
                                }
                                mode="currency"
                                currency="USD"
                                locale="en-US"
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="stock">Stock</label>
                            <InputNumber
                                id="stock"
                                value={selectedProducto.stock}
                                onValueChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, stock: e.value || 0 })
                                }
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="categoria">Categoría</label>
                            <Dropdown
                                id="categoria"
                                value={selectedProducto.categoria}
                                options={categorias}
                                style={{ backgroundColor:"rgba(20% 20% 20% / 1)", borderRadius:"10px", padding:"5px"}}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, categoria: e.value })
                                }
                                placeholder="Seleccione una categoría"
                                panelStyle={{ backgroundColor:"black", padding:"10px"}}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="metodosEntrega">Métodos de Entrega</label>
                            <Dropdown
                                id="metodosEntrega"
                                value={selectedProducto.metodosEntrega}
                                options={metodosEntrega}
                                style={{ backgroundColor:"rgba(20% 20% 20% / 1)", borderRadius:"10px", padding:"5px"}}
                                onChange={(e) =>
                                    setSelectedProducto({ ...selectedProducto, metodosEntrega: e.value })
                                }
                                optionLabel="label"
                                optionValue="value"
                                multiple
                                placeholder="Seleccione métodos"
                                panelStyle={{ backgroundColor:"black", padding:"10px"}}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Dialogo para crear productos */}
            <Dialog
                header="Crear Nuevo Producto"
                visible={createDialogVisible}
                style={{ width: "50vw", backgroundColor: "rgba(10% 10% 10% / 1)", padding:"10px", borderRadius:"10px", boxShadow:"0 0 10px rgba(100% 100% 100% / 1)" }}
                onHide={() => setCreateDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Guardar" icon="pi pi-check" onClick={createProducto} />
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setCreateDialogVisible(false)} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={newProducto.nombre}
                            onChange={(e) =>
                                setNewProducto({ ...newProducto, nombre: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText
                            id="descripcion"
                            value={newProducto.descripcion}
                            onChange={(e) =>
                                setNewProducto({ ...newProducto, descripcion: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="precio">Precio</label>
                        <InputNumber
                            id="precio"
                            value={newProducto.precio}
                            onValueChange={(e) =>
                                setNewProducto({ ...newProducto, precio: e.value || 0 })
                            }
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="stock">Stock</label>
                        <InputNumber
                            id="stock"
                            value={newProducto.stock}
                            onValueChange={(e) =>
                                setNewProducto({ ...newProducto, stock: e.value || 0 })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="categoria">Categoría</label>
                        <Dropdown
                            id="categoria"
                            value={newProducto.categoria}
                            options={categorias}
                            style={{ backgroundColor:"rgba(20% 20% 20% / 1)", borderRadius:"10px", padding:"5px"}}
                            onChange={(e) =>
                                setNewProducto({ ...newProducto, categoria: e.value })
                            }
                            placeholder="Seleccione una categoría"
                            panelStyle={{ backgroundColor:"black", padding:"10px"}}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="metodosEntrega">Métodos de Entrega</label>
                        <Dropdown
                            id="metodosEntrega"
                            value={newProducto.metodosEntrega}
                            options={metodosEntrega}
                            style={{ backgroundColor:"rgba(20% 20% 20% / 1)", borderRadius:"10px", padding:"5px"}}
                            onChange={(e) =>
                                setNewProducto({ ...newProducto, metodosEntrega: e.value })
                            }
                            optionLabel="label"
                            optionValue="value"
                            multiple
                            placeholder="Seleccione métodos"
                            panelStyle={{ backgroundColor:"black", padding:"10px"}}
                        />
                    </div>
                </div>
            </Dialog>

            <footer style={{ placeItems:'center', padding:"1rem"}}>
                <LogoutButton />
                <p>&copy; 2023 Comercio Digital y Local</p>
                <p>Todos los derechos reservados</p>
            </footer>

        </div>
    )


}
    


export default LocatarioPage;