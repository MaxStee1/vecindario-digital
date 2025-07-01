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
      const responseMisProveedores = await api.get('/locatarios/proveedores');
      setMisProveedores(responseMisProveedores.data);

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

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: 8,
    border: "1.5px solid #E3E7ED",
    fontSize: 16,
    marginBottom: 18,
    background: "#fff",
    color: "#222",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    maxWidth: 350
  };

  const actionBodyTemplate = (rowData: Proveedor) => {
    return esMiProveedor(rowData.id) ? (
      <Button
        icon="pi pi-trash"
        style={actionButtonStyle("#E53935")}
        tooltip="Eliminar proveedor"
        onClick={() => handleEliminarProveedor(rowData.id)}
      />
    ) : (
      <Button
        icon="pi pi-plus"
        style={actionButtonStyle("#1976D2", true)}
        tooltip="Agregar proveedor"
        onClick={() => handleAgregarProveedor(rowData.id)}
      />
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <TabView style={{ borderRadius: "14px", margin: "1rem 0", background: "transparent" }}>
        <TabPanel header="Mis Proveedores" leftIcon={<span className="pi pi-users" style={{ color: "#43A047", fontSize: 20, marginRight: 8 }}></span>}>
          <div style={cardStyle}>
            <h2 style={{ color: "#1976D2", fontWeight: 700, marginBottom: 18 }}>Mis Proveedores</h2>
            <DataTable value={misProveedores} style={{ width: '100%' }}>
              <Column field="nombre" header="Nombre" />
              <Column field="email" header="Email" />
              <Column
                header="Acciones"
                body={(rowData) => (
                  <Button
                    icon="pi pi-trash"
                    style={actionButtonStyle("#E53935")}
                    tooltip="Eliminar proveedor"
                    onClick={() => handleEliminarProveedor(rowData.id)}
                  />
                )}
                style={{ minWidth: 120, textAlign: "center" }}
              />
            </DataTable>
          </div>
        </TabPanel>

        <TabPanel header="Agregar Proveedores" leftIcon={<span className="pi pi-plus-circle" style={{ color: "#1976D2", fontSize: 20, marginRight: 8 }}></span>}>
          <div style={cardStyle}>
            <h2 style={{ color: "#43A047", fontWeight: 700, marginBottom: 18 }}>Agregar Proveedores</h2>
            <InputText
              placeholder="Buscar proveedores por nombre o rubro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={inputStyle}
            />
            <DataTable value={proveedoresFiltrados}>
              <Column field="nombre" header="Nombre" />
              <Column field="email" header="Email" />
              <Column field="rubro" header="Rubro" />
              <Column
                header="Acciones"
                body={actionBodyTemplate}
                style={{ minWidth: 120, textAlign: "center" }}
              />
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ProveedoresPage;