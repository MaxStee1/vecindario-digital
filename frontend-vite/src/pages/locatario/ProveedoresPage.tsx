// ProveedoresPage.tsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from "primereact/inputtext";

type Proveedor = {
  id: string;
  nombre: string;
  email?: string;
  rubro?: string;
};

const ProveedoresPage = () => {
  const [misProveedores, setMisProveedores] = useState<Proveedor[]>([]);
  const [todosProveedores, setTodosProveedores] = useState<Proveedor[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef<Toast>(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      // Cargar proveedores del locatario
      const responseMisProveedores = await api.get('/locatarios/proveedores');
      setMisProveedores(responseMisProveedores.data);
      
      // Cargar todos los proveedores disponibles
      const responseTodosProveedores = await api.get('/proveedor');
      setTodosProveedores(responseTodosProveedores.data);
    } catch (error) {
      console.error("Error al cargar proveedores", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar proveedores',
        life: 3000
      });
    }
  };

  const handleAgregarProveedor = async (proveedorId: string) => {
    try {
      await api.put(`/locatarios/proveedores/${proveedorId}`);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Proveedor agregado correctamente',
        life: 3000
      });
      cargarProveedores();
    } catch (error) {
      console.error("Error al agregar proveedor", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al agregar proveedor',
        life: 3000
      });
    }
  };

  const handleEliminarProveedor = async (proveedorId: string) => {
    try {
      await api.delete(`/locatarios/proveedores/${proveedorId}`);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Proveedor eliminado correctamente',
        life: 3000
      });
      cargarProveedores();
    } catch (error) {
      console.error("Error al eliminar proveedor", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar proveedor',
        life: 3000
      });
    }
  };

  const proveedoresFiltrados = todosProveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (proveedor.rubro && proveedor.rubro.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const esMiProveedor = (proveedorId: string) => {
    return misProveedores.some(p => p.id === proveedorId);
  };

  const actionBodyTemplate = (rowData) => {
    return esMiProveedor(rowData.id) ? (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleEliminarProveedor(rowData.id)}
      />
    ) : (
      <Button
        icon="pi pi-plus"
        className="p-button-success"
        onClick={() => handleAgregarProveedor(rowData.id)}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      
      <TabView>
        <TabPanel header="Mis Proveedores">
          <DataTable value={misProveedores} style={{ width: '100%'}}>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="email" header="Email"></Column>
            <Column body={(rowData) => (
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleEliminarProveedor(rowData.id)}
              />
            )}></Column>
          </DataTable>
        </TabPanel>
        
        <TabPanel header="Agregar Proveedores">
          <InputText 
            placeholder="Buscar proveedores..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          
          <DataTable value={proveedoresFiltrados}>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="email" header="Email"></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ProveedoresPage;