import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";
import { TabView, TabPanel } from "primereact/tabview";
import { useNavigate } from "react-router-dom";
import "../styles/mis-pedidos.css"

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
        <div className="loading-spinner">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        </div>
      );
    }

    if (filtrados.length === 0) {
      return <div>No hay pedidos en esta categoría.</div>;
    }

    return (
      <div className="pedidos-grid">
        {filtrados.map((pedido) => (
          <div key={pedido.id} className="pedido-card">
            <h4>Pedido #{pedido.id} - Estado: {pedido.estado}</h4>
            <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
            <p><strong>Total:</strong> ${pedido.total}</p>
            <div>
              <strong>Productos:</strong>
              <ul>
                {pedido.productos.map((prod, idx) => (
                  <li key={idx}>
                    {prod.producto?.nombre} x{prod.cantidad} (${prod.precio})
                    {pedido.estado === "entregado" && !productosValorados.includes(prod.productoId) && (
                      <span style={{ marginLeft: 16 }}>
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
                          style={{ marginLeft: 8 }}
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
    <div className="principal-container">
      <Toast ref={toast} />

      <header className="principal-header">
        <h1>Mis Pedidos</h1>
        <Button
          label="Volver al Inicio"
          icon="pi pi-home"
          onClick={() => navigate("/shop")}
          className="p-button-rounded p-button-secondary"
        />
      </header>

      <hr className="separador-naranja" />

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

          <h3>Productos ya valorados</h3>
          {productosValorados.length === 0 ? (
            <div>No has valorado productos aún.</div>
          ) : (
            <ul>
              {pedidos
                .filter(p => p.estado === "entregado")
                .flatMap(p => p.productos)
                .filter(prod => productosValorados.includes(prod.productoId))
                .map(prod => (
                  <li key={prod.productoId}>
                    {prod.producto?.nombre} - Valoración: {valoraciones[`${prod.productoId}`]}
                  </li>
                ))}
            </ul>
          )}
        </TabPanel>
      </TabView>

      <footer className="principal-footer">
        <p>© 2023 Comercio Digital y Local - Todos los derechos reservados</p>
        <p>Creado por <b>Run Mafia</b></p>
      </footer>
    </div>
  );
};

export default MisPedidosPage;
