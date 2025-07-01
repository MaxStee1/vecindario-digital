import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { TabView, TabPanel } from "primereact/tabview";
import { useNavigate } from "react-router-dom";

const MisPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compradorId, setCompradorId] = useState(null);
  const [valoraciones, setValoraciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [productosValorados, setProductosValorados] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/comprador/perfil");
        setCompradorId(res.data.id);
      } catch {
        mostrarToast("error", "No se pudo obtener el perfil");
      }
    };
    fetchPerfil();
  }, []);

  useEffect(() => {
    if (compradorId) {
      cargarPedidos();
      cargarValoraciones();
    }
  }, [compradorId]);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/comprador/pedidos`);
      setPedidos(res.data);
    } catch {
      mostrarToast("error", "Error al cargar pedidos");
    }
    setLoading(false);
  };

  const cargarValoraciones = async () => {
    try {
      const res = await api.get("/comprador/valoraciones");
      const vals = {};
      const valorados = [];
      res.data.forEach(val => {
        vals[`${val.productoId}`] = val.calificacion;
        valorados.push(val.productoId);
      });
      setValoraciones(vals);
      setProductosValorados(valorados);
    } catch {
      console.error("No se cargaron las valoraciones");
    }
  };

  const mostrarToast = (severity, summary) => {
    toast.current?.show({ severity, summary, life: 2000 });
  };

  const handleValorar = async (pedidoId, productoId, valor, comentario = "") => {
    try {
      await api.post("/comprador/valoraciones", {
        productoId,
        calificacion: valor,
        comentario,
      });
      mostrarToast("success", "¡Gracias por tu valoración!");
      setValoraciones(prev => ({
        ...prev,
        [`${productoId}`]: valor,
      }));
    } catch {
      mostrarToast("error", "No se pudo guardar la valoración");
    }
  };

  const renderPedidos = (filtro) => {
    const filtrados = pedidos.filter(p => {
      switch (filtro) {
        case "todos":
          return true;
        case "pendiente":
          return p.estado !== "entregado" && p.estado !== "enReparto";
        case "enReparto":
          return p.estado === "enReparto";
        case "entregado":
          return p.estado === "entregado";
        default:
          return true;
      }
    });

    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: "#1976D2" }}></i>
        </div>
      );
    }

    if (filtrados.length === 0) {
      return (
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
          padding: "2rem",
          textAlign: "center",
          color: "#888"
        }}>
          No hay pedidos en esta categoría.
        </div>
      );
    }

    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "28px",
        margin: "24px 0"
      }}>
        {filtrados.map((pedido) => (
          <div
            key={pedido.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}
          >
            <h4 style={{ color: "#1976D2", fontWeight: 700, marginBottom: 8 }}>
              Pedido #{pedido.id} <span style={{
                background: pedido.estado === "entregado"
                  ? "#43A047"
                  : pedido.estado === "enReparto"
                    ? "#FFA726"
                    : "#1976D2",
                color: "#fff",
                borderRadius: 8,
                padding: "2px 12px",
                fontSize: 14,
                marginLeft: 10
              }}>{pedido.estado}</span>
            </h4>
            <p style={{ margin: 0 }}><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
            <p style={{ margin: 0 }}><strong>Total:</strong> ${pedido.total}</p>
            <div>
              <strong>Productos:</strong>
              <ul style={{ paddingLeft: 18, margin: "8px 0" }}>
                {pedido.productos.map((prod, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{prod.producto?.nombre}</span> x{prod.cantidad} (${prod.precio})
                    {pedido.estado === "entregado" && !productosValorados.includes(prod.productoId) && (
                      <span style={{ marginLeft: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Rating
                          value={valoraciones[`${prod.productoId}`] || 0}
                          cancel={false}
                          onChange={(e) =>
                            handleValorar(pedido.id, prod.productoId, e.value, comentarios[`${prod.productoId}`] || "")
                          }
                        />
                        <input
                          type="text"
                          placeholder="Comentario"
                          value={comentarios[`${prod.productoId}`] || ""}
                          onChange={(e) =>
                            setComentarios(prev => ({
                              ...prev,
                              [`${prod.productoId}`]: e.target.value
                            }))
                          }
                          style={{
                            marginLeft: 8,
                            borderRadius: 6,
                            border: "1.5px solid #E3E7ED",
                            padding: "4px 10px",
                            fontSize: 14
                          }}
                        />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #F8FAFC 60%, #E3F2FD 100%)",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Toast ref={toast} />

      <header style={{
        background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        boxShadow: "0 4px 24px rgba(25, 118, 210, 0.08)",
        padding: "2.5rem 0 1.5rem 0",
        marginBottom: 24,
        textAlign: "center"
      }}>
        <h1 style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.2rem",
          margin: 0,
          letterSpacing: "1px"
        }}>Mis Pedidos</h1>
        <Button
          label="Volver al Inicio"
          icon="pi pi-home"
          onClick={() => navigate("/shop")}
          style={{
            background: "#fff",
            color: "#1976D2",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 16,
            marginTop: 18,
            boxShadow: "0 2px 8px #1976D211"
          }}
        />
      </header>

      <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 1rem", width: "100%" }}>
        <TabView>
          <TabPanel header="Todos">
            {renderPedidos("todos")}
          </TabPanel>
          <TabPanel header="Pendientes">
            {renderPedidos("pendiente")}
          </TabPanel>
          <TabPanel header="En Reparto">
            {renderPedidos("enReparto")}
          </TabPanel>
          <TabPanel header="Entregados">
            {renderPedidos("entregado")}

            <h3 style={{ color: "#1976D2", marginTop: 32 }}>Productos ya valorados</h3>
            {productosValorados.length === 0 ? (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
                padding: "1.5rem",
                textAlign: "center",
                color: "#888"
              }}>
                No has valorado productos aún.
              </div>
            ) : (
              <ul style={{ marginTop: 12 }}>
                {pedidos
                  .filter(p => p.estado === "entregado")
                  .flatMap(p => p.productos)
                  .filter(prod => productosValorados.includes(prod.productoId))
                  .map(prod => (
                    <li key={prod.productoId} style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 600 }}>{prod.producto?.nombre}</span> - Valoración: {valoraciones[`${prod.productoId}`]}
                    </li>
                  ))}
              </ul>
            )}
          </TabPanel>
        </TabView>
      </div>

      <footer
        style={{
          fontSize: "15px",
          color: "#666",
          background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
          colorScheme: "light",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          width: "100%",
          padding: "1.2rem 0 0.5rem 0",
          textAlign: "center",
          marginTop: "auto"
        }}
      >
        <p style={{ color: "#fff", margin: 0 }}>&copy; 2023 Comercio Digital y Local - Todos los derechos reservados</p>
        <p style={{ color: "#fff", margin: 0 }}>Creado por <b>Run Mafia</b></p>
      </footer>
    </div>
  );
};

export default MisPedidosPage;