import React from "react";
import { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import './tabla.css';

interface UsersProps {
    usuarios: any[];
    formatDate: (fecha: string) => string;
    openEditDialog: (usuario: any) => void;
    openDeleteDialog: (usuario: any) => void;
    setCreateDialogVisible: (visible: boolean) => void;
}

const UsersSection: React.FC<UsersProps> = ({ 
    usuarios, 
    formatDate, 
    openEditDialog, 
    openDeleteDialog, 
    setCreateDialogVisible 
}) => {

    const menuRefs = useRef<Record<number, any>>({});

    const getMenuRef = (id: number) => {
        if (!menuRefs.current[id]) {
            menuRefs.current[id] = React.createRef();
        }
        return menuRefs.current[id];
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ width: "80%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <Button
                    label="Crear Usuario"
                    icon={() =><i className="pi pi-plus" style={{color:"#ff6600", marginRight:"0.5rem"}} />}
                    className="p-button-success"
                    onClick={() => setCreateDialogVisible(true)}
                />
            </div>
            <div
                style={{
                    padding: "0",
                    borderRadius: "10px",
                    width: "80%",
                    marginTop:"1rem"
                }}
            >
                <DataTable
                    className="mi-tabla"
                    value={usuarios}
                    paginator
                    rows={10}
                    //rowsPerPageOptions={[5, 10, 25]}
                    style={{ borderRadius: "5px", width: '100%' }}
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                >
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column field="email" header="Correo" sortable></Column>
                    <Column field="rol" header="Rol" sortable></Column>
                    <Column field="CreatedAt" header="Fecha Registro" sortable body={(rowData) => formatDate(rowData.CreatedAt)}></Column>
                    <Column
                        header="Acciones"
                        body={(rowData) => {
                            const menuItems = [
                                {
                                    label: 'Editar',
                                    icon: 'pi pi-pencil',
                                    command: () => openEditDialog(rowData)
                                },
                                {
                                    label: 'Eliminar',
                                    icon: 'pi pi-trash',
                                    command: () => openDeleteDialog(rowData)
                                }
                            ];

                            const menuRef = getMenuRef(rowData.id)
                            return (
                                <>
                                <Button 
                                    icon="pi pi-cog"
                                    onClick={(e) => menuRef.current.toggle(e)}
                                />
                                <Menu model={menuItems} popup ref={menuRef} />
                                </>
                            );
                        }}
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default UsersSection;