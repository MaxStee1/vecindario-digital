import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
}

interface ProductosTableProps {
    productos: Producto[];
}

const ProductosTable: React.FC<ProductosTableProps> = ({ productos }) => {
    return (
        <DataTable value={productos} paginator rows={10} rowsPerPageOptions={[5, 10, 20]}>
            <Column field="id" header="ID" sortable />
            <Column field="nombre" header="Nombre" sortable />
            <Column field="descripcion" header="Descripción" />
            <Column field="precio" header="Precio" sortable />
            <Column field="stock" header="Stock" sortable />
        </DataTable>
    );
};

export default ProductosTable;