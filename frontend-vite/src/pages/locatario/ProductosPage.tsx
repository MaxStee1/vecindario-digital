import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import api from "../../services/api";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    promedioCalificacion?: number | null;
}

interface Valoracion {
    id: number;
    calificacion: number;
    comentario: string;
    fecha: string;
    comprador: string | null;
}

interface ProductosPageProps {
    nombreTienda: string;
    toastRef: React.RefObject<Toast>;
}

const ProductosPage: React.FC<ProductosPageProps> = ({ nombreTienda, toastRef }) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [createDialogVisible, setCreateDialogVisible] = useState(false);
    const [newProducto, setNewProducto] = useState<Omit<Producto, 'id'>>({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
    });
    const [valoracionesDialogVisible, setValoracionesDialogVisible] = useState(false);
    const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
    const [productoValorado, setProductoValorado] = useState<Producto | null>(null);

    const verValoraciones = async (producto: Producto) => {
        try {
            const response = await api.get(`/locatarios/productos/${producto.id}/valoraciones`);
            setValoraciones(response.data);
            setProductoValorado(producto);
            setValoracionesDialogVisible(true);
        } catch (error) {
            showError("No se pudieron obtener las valoraciones.");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await api.get("/locatarios/productos");
            setProductos(response.data);
        } catch (error) {
            console.error("Error al obtener productos", error);
            showError("Hubo un problema al cargar los productos.");
        }
    };

    const openEditDialog = (producto: Producto) => {
        setSelectedProducto({ ...producto });
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
        if (!selectedProducto) return;

        try {
            await api.put(`/locatarios/productos/${selectedProducto.id}`, selectedProducto);
            showSuccess("Producto actualizado correctamente");
            setEditDialogVisible(false);
            fetchProductos();
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            showError("Hubo un problema al actualizar el producto.");
        }
    };

    const createProducto = async () => {
        try {
            await api.post("/locatarios/productos", newProducto);
            showSuccess("Producto creado correctamente.");
            setCreateDialogVisible(false);
            fetchProductos();
        } catch (error) {
            console.error("Error al crear el producto", error);
            showError("Hubo un problema al crear el producto.");
        }
    };

    const deleteProducto = async (id: number) => {
        try {
            await api.delete(`/locatarios/productos/${id}`);
            showSuccess("Producto eliminado correctamente.");
            fetchProductos();
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            showError("Hubo un problema al eliminar el producto.");
        }
    };

    const showSuccess = (message: string) => {
        toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
    };

    const showError = (message: string) => {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    };

    // --- ESTILOS ---
    const cardStyle: React.CSSProperties = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
        padding: "28px 24px",
        marginBottom: "24px",
        width: "100%"
    };

    const actionButtonStyle = (color: string, grad?: boolean) => ({
        background: grad
            ? "linear-gradient(90deg, #1976D2 60%, #43A047 100%)"
            : color,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "8px 18px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: "0 2px 8px #1976D244",
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginRight: 8
    });

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <h2 style={{ color: "#1976D2", fontWeight: 700, margin: 0 }}>Productos Disponibles</h2>
                <Button
                    label="Agregar Producto"
                    icon="pi pi-plus"
                    onClick={openCreateDialog}
                    style={{
                        background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        boxShadow: "0 2px 8px #1976D244"
                    }}
                />
            </div>
            <div style={cardStyle}>
                <DataTable value={productos} tableStyle={{ minWidth: "auto" }}>
                    <Column field="id" header="ID" sortable style={{ width: 60, textAlign: "center" }} />
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: 120 }} />
                    <Column field="descripcion" header="Descripción" style={{ minWidth: 180 }} />
                    <Column field="precio" header="Precio" body={(rowData) => `$${rowData.precio}`} style={{ minWidth: 100 }} />
                    <Column field="stock" header="Stock" style={{ minWidth: 80 }} />
                    <Column
                        header="Calificación Promedio"
                        body={(rowData: Producto) =>
                            rowData.promedioCalificacion !== null && rowData.promedioCalificacion !== undefined
                                ? rowData.promedioCalificacion.toFixed(1)
                                : "Sin calificaciones"
                        }
                        style={{ minWidth: 120 }}
                    />
                    <Column
                        header="Acciones"
                        body={(rowData) => (
                            <div style={{ display: "flex", gap: 8 }}>
                                <Button
                                    tooltip="Editar"
                                    icon="pi pi-pencil"
                                    style={actionButtonStyle("#1976D2", true)}
                                    onClick={() => openEditDialog(rowData)}
                                />
                                <Button
                                    tooltip="Eliminar"
                                    icon="pi pi-trash"
                                    style={actionButtonStyle("#E53935")}
                                    onClick={() => deleteProducto(rowData.id)}
                                />
                                <Button
                                    tooltip="Ver valoraciones"
                                    icon="pi pi-star"
                                    style={actionButtonStyle("#FFA726")}
                                    onClick={() => verValoraciones(rowData)}
                                />
                            </div>
                        )}
                        style={{ minWidth: 180, textAlign: "center" }}
                    />
                </DataTable>
            </div>
            {/* Mostrar valoraciones */}
            <Dialog
                header={`Valoraciones de "${productoValorado?.nombre}"`}
                closable={false}
                visible={valoracionesDialogVisible}
                style={{ width: "80%" }}
                onHide={() => setValoracionesDialogVisible(false)}
                footer={
                    <Button
                        label="Cerrar"
                        icon="pi pi-times"
                        onClick={() => setValoracionesDialogVisible(false)}
                        style={{
                            background: "#1976D2",
                            border: "none",
                            borderRadius: 8,
                            color: "#fff"
                        }}
                    />
                }
            >
                {valoraciones.length === 0 ? (
                    <p>No hay valoraciones para este producto.</p>
                ) : (
                    <table style={{ width: "100%", textAlign: "center" }}>
                        <thead>
                            <tr>
                                <th>Calificación</th>
                                <th>Comentario</th>
                                <th>Fecha</th>
                                <th>Comprador</th>
                            </tr>
                        </thead>
                        <tbody>
                            {valoraciones.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.calificacion}</td>
                                    <td>{v.comentario || "-"}</td>
                                    <td>{new Date(v.fecha).toLocaleDateString()}</td>
                                    <td>{v.comprador || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Dialog>

            {/* Diálogos de edición y creación */}
            <Dialog
                header="Editar Producto"
                visible={editDialogVisible}
                style={{ width: "50vw" }}
                closable={false}
                onHide={() => setEditDialogVisible(false)}
                footer={
                    <div>
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={saveProducto}
                            style={{
                                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                                border: "none",
                                borderRadius: 8,
                                color: "#fff",
                                fontWeight: 600
                            }}
                        />
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setEditDialogVisible(false)}
                            style={{
                                marginLeft: 8,
                                background: "#E3E7ED",
                                border: "none",
                                borderRadius: 8,
                                color: "#1976D2",
                                fontWeight: 600
                            }}
                        />
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
                                currency="CLP"
                                locale="es-CL"
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
                    </div>
                )}
            </Dialog>

            <Dialog
                header="Crear Producto"
                visible={createDialogVisible}
                closable={false}
                style={{ width: "50vw" }}
                onHide={() => setCreateDialogVisible(false)}
                footer={
                    <div>
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={createProducto}
                            style={{
                                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                                border: "none",
                                borderRadius: 8,
                                color: "#fff",
                                fontWeight: 600
                            }}
                        />
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setCreateDialogVisible(false)}
                            style={{
                                marginLeft: 8,
                                background: "#E3E7ED",
                                border: "none",
                                borderRadius: 8,
                                color: "#1976D2",
                                fontWeight: 600
                            }}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
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
                        <InputNumber
                            id="precio"
                            value={newProducto.precio}
                            onValueChange={(e) => setNewProducto({ ...newProducto, precio: e.value || 0 })}
                            mode="currency"
                            currency="CLP"
                            locale="es-CL"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="stock">Stock</label>
                        <InputNumber
                            id="stock"
                            value={newProducto.stock}
                            onValueChange={(e) => setNewProducto({ ...newProducto, stock: e.value || 0 })}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProductosPage;