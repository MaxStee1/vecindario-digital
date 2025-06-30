import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from "primereact/card";
import { Button } from "primereact/button";

type Pedido = {
  id: number;
  direccionEntrega: string;
  fechaPedido: string;
  estado: string;
  total: number;
  comprador: {
    usuario: {
      nombre: string;
      email: string;
    }
  };
  productos: {
    producto: {
      nombre: string;
      precio: number;
    };
    cantidad: number;
    precio: number;
  }[];
};

const RepartidorPage = () => {
  const [repartidor, setRepartidor] = useState<{ id: number; nombre: string } | null>(null);
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
  const [pedidoAsignado, setPedidoAsignado] = useState<Pedido | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    obtenerRepartidor();
  }, []);

  useEffect(() => {
    if (repartidor) {
      obtenerPedidosPendientes();
      obtenerPedidoAsignado();
    }
  }, [repartidor]);

  const obtenerRepartidor = async () => {
    try {
      const res = await api.get("/repartidor/info");
      setRepartidor(res.data);
    } catch (error) {
      showError("No se pudo obtener el repartidor autenticado.");
    }
  };

  const obtenerPedidosPendientes = async () => {
    try {
      const res = await api.get("/repartidor/pedidos/pendientes");
      setPedidosPendientes(res.data);
    } catch (error) {
      showError("No se pudieron cargar los pedidos pendientes.");
    }
  };

  const obtenerPedidoAsignado = async () => {
    try {
      if (!repartidor) return;
      const res = await api.get(`/repartidor/${repartidor.id}/pedidos`);
      setPedidoAsignado(res.data && res.data.length > 0 ? res.data[0] : null);
    } catch (error) {
      showError("No se pudo cargar el pedido asignado.");
    }
  };

  const aceptarPedido = async (pedidoId: number) => {
    try {
      if (!repartidor) return;
      await api.post(`/repartidor/${repartidor.id}/aceptar-pedido/${pedidoId}`);
      showSuccess("Pedido aceptado correctamente.");
      obtenerPedidosPendientes();
      obtenerPedidoAsignado();
    } catch (error) {
      showError("No se pudo aceptar el pedido.");
    }
  };

  const entregarPedido = async (pedidoId: number) => {
    try {
      if (!repartidor) return;
      await api.post(`/repartidor/${repartidor.id}/entregar-pedido/${pedidoId}`);
      showSuccess("Pedido marcado como entregado.");
      setPedidoAsignado(null);
      obtenerPedidosPendientes();
    } catch (error) {
      showError("No se pudo marcar el pedido como entregado.");
    }
  };

  const showError = (message: string) => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  };

  const showSuccess = (message: string) => {
    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: message, life: 3000 });
  };

  return (
    <div>
      <header>
        <h2 style={{ textAlign: "center", padding: "2rem" }}>
          Panel de <strong>Repartidor</strong>
        </h2>
        <p style={{ textAlign: "center", marginTop: "-1.5rem", marginBottom: "1.5rem" }}>
          Bienvenido, <strong>{repartidor?.nombre || "..."}</strong>
        </p>
        <hr
          style={{
            border: "none",
            height: "2px",
            backgroundColor: "#ff6600",
            marginBottom: "20px",
            width: "80%",
          }}
        />
      </header>

      <main style={{ display: "flex", flexDirection: "column", placeItems: "center" }}>
        <Toast ref={toast} />
        <div style={{ width: "100%", maxWidth: "1000px"}}>
          <TabView
            style={{ borderRadius:"10px", placeItems:"center", marginBottom:"15px"}}
            activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header="Pedidos Pendientes" leftIcon="pi pi-clock mr-2">
              <Card>
                {pedidosPendientes.length === 0 ? (
                  <p style={{ color: "gray" }}>No hay pedidos pendientes.</p>
                ) : (
                  <div className="pedidos-grid">
                    {pedidosPendientes.map((pedido) => (
                      <div key={pedido.id} className="pedido-card">
                        <h4>Pedido #{pedido.id}</h4>
                        <p><strong>Cliente:</strong> {pedido.comprador.usuario.nombre} ({pedido.comprador.usuario.email})</p>
                        <p><strong>Dirección de entrega:</strong> {pedido.direccionEntrega}</p>
                        <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
                        <p><strong>Total:</strong> ${pedido.total}</p>
                        <div>
                          <strong>Productos:</strong>
                          <ul>
                            {pedido.productos.map((prod, idx) => (
                              <li key={idx}>
                                {prod.producto.nombre} x{prod.cantidad} (${prod.precio})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          label="Aceptar pedido"
                          icon="pi pi-check"
                          onClick={() => aceptarPedido(pedido.id)}
                          disabled={!!pedidoAsignado}
                          style={{ marginTop: "1rem" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {pedidoAsignado && (
                  <div style={{ color: "orange", marginTop: "1rem" }}>
                    Ya tienes un pedido asignado. Debes entregarlo antes de aceptar otro.
                  </div>
                )}
              </Card>
            </TabPanel>
            <TabPanel header="Mi Pedido Asignado" leftIcon="pi pi-truck mr-2">
              <Card style={{ placeItems:"center"}}>
                {!pedidoAsignado ? (
                  <p style={{ color: "gray" }}>No tienes pedidos asignados actualmente.</p>
                ) : (
                  <div>
                    <h4>Pedido #{pedidoAsignado.id}</h4>
                    <p><strong>Cliente:</strong> {pedidoAsignado.comprador.usuario.nombre} ({pedidoAsignado.comprador.usuario.email})</p>
                    <p><strong>Dirección de entrega:</strong> {pedidoAsignado.direccionEntrega}</p>
                    <p><strong>Fecha:</strong> {new Date(pedidoAsignado.fechaPedido).toLocaleString()}</p>
                    <p><strong>Total:</strong> ${pedidoAsignado.total}</p>
                    <div>
                      <strong>Productos:</strong>
                      <ul>
                        {pedidoAsignado.productos.map((prod, idx) => (
                          <li key={idx}>
                            {prod.producto.nombre} x{prod.cantidad} (${prod.precio})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      label="Marcar como entregado"
                      icon="pi pi-send"
                      onClick={() => entregarPedido(pedidoAsignado.id)}
                      style={{ marginTop: "1rem" }}
                    />
                  </div>
                )}
              </Card>
            </TabPanel>
          </TabView>
        </div>
      </main>

      <footer style={{ placeItems: 'center', padding: "1rem", backgroundColor: "rgba(5% 5% 5% / 20%)", marginTop: "2rem", textAlign: "center" }}>
        <LogoutButton />
        <p>&copy; {new Date().getFullYear()} Comercio Digital y Local</p>
        <p>Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default RepartidorPage;