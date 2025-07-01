import React, { useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { FaUserPlus } from "react-icons/fa";

interface UsersProps {
    usuarios: any[];
    formatDate: (fecha: string) => string;
    openEditDialog: (usuario: any) => void;
    openDeleteDialog: (usuario: any) => void;
    setCreateDialogVisible: (visible: boolean) => void;
}

const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "32px 32px 24px 32px",
    width: "100%",
    maxWidth: 1100,
    margin: "0 auto",
    marginTop: "32px"
};

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

    const paginatorTemplate = {
        'PrevPageLink': (options: any) => (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
                disabled={options.disabled}
                style={{
                    background: "#fff",
                    color: "#1976D2",
                    border: "1.5px solid #1976D2",
                    borderRadius: 6,
                    margin: "0 4px",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "6px 12px",
                    cursor: options.disabled ? "not-allowed" : "pointer"
                }}
            >
                {"<"}
            </button>
        ),
        'NextPageLink': (options: any) => (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
                disabled={options.disabled}
                style={{
                    background: "#fff",
                    color: "#1976D2",
                    border: "1.5px solid #1976D2",
                    borderRadius: 6,
                    margin: "0 4px",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "6px 12px",
                    cursor: options.disabled ? "not-allowed" : "pointer"
                }}
            >
                {">"}
            </button>
        ),
        'PageLinks': (options: any) => (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
                style={{
                    background: options.active ? "linear-gradient(90deg, #1976D2 60%, #43A047 100%)" : "#fff",
                    color: options.active ? "#fff" : "#1976D2",
                    border: "1.5px solid #1976D2",
                    borderRadius: 6,
                    margin: "0 2px",
                    fontWeight: 600,
                    fontSize: 16,
                    padding: "6px 12px",
                    cursor: "pointer"
                }}
            >
                {options.page + 1}
            </button>
        )
    };

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC", padding: "32px 0", fontFamily: "Inter, Arial, sans-serif" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: 1100,
                margin: "0 auto 18px auto",
                padding: "0 16px"
            }}>
                <h2 style={{
                    color: "#1976D2",
                    fontWeight: 700,
                    fontSize: "2rem",
                    letterSpacing: "0.5px",
                    margin: 0
                }}>
                    Gestión de Usuarios
                </h2>
                <Button
                    label="Crear Usuario"
                    icon={<FaUserPlus style={{ color: "#fff", marginRight: 8 }} />}
                    style={{
                        background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        padding: "10px 22px"
                    }}
                    onClick={() => setCreateDialogVisible(true)}
                />
            </div>
            <div style={cardStyle}>
                <DataTable
                    value={usuarios}
                    paginator
                    rows={10}
                    stripedRows
                    scrollable
                    scrollHeight="flex"
                    paginatorTemplate={paginatorTemplate}
                    style={{
                        borderRadius: "12px",
                        fontSize: "1rem",
                        background: "#fff"
                    }}
                    emptyMessage="No hay usuarios para mostrar"
                >
                    <Column field="id" header="ID" sortable style={{ width: 70, textAlign: "center" }} />
                    <Column field="nombre" header="Nombre" sortable style={{ minWidth: 120 }} />
                    <Column field="email" header="Correo" sortable style={{ minWidth: 180 }} />
                    <Column field="rol" header="Rol" sortable style={{ minWidth: 100, textTransform: "capitalize" }} />
                    <Column
                        field="CreatedAt"
                        header="Fecha Registro"
                        sortable
                        body={(rowData) => formatDate(rowData.CreatedAt)}
                        style={{ minWidth: 140 }}
                    />
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
                        const menuRef = getMenuRef(rowData.id);
                        return (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <button
                                    type="button"
                                    aria-label="Opciones"
                                    onClick={(e) => menuRef.current.toggle(e)}
                                    style={{
                                        background: "#1976D2",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 38,
                                        height: 38,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                        boxShadow: "0 1px 4px #1976D211"
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.background = "#43A047")}
                                    onMouseOut={e => (e.currentTarget.style.background = "#1976D2")}
                                >
                                    {/* Solo círculo de color */}
                                </button>
                                <Menu model={menuItems} popup ref={menuRef} />
                            </div>
                        );
                    }}
                    style={{ width: 120, textAlign: "center" }}
                />
                </DataTable>
            </div>
        </div>
    );
};

export default UsersSection;