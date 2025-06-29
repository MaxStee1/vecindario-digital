import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Rating } from "primereact/rating";

const MisPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compradorId, setCompradorId] = useState(null);
  const [valoraciones, setValoraciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const toast = useRef(null);

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
      res.data.forEach(val => {
        vals[`${val.productoId}`] = val.calificacion;
      });
      setValoraciones(vals);
    } catch {
      console.error("No se cargaron las valoraciones")
    }
  };

  const mostrarToast = (severity, summary) => {
    if (toast.current) {
      toast.current.show({ severity, summary, life: 2000 });
    }
  };

  const handleValorar = async (pedidoId, productoId, valor, comentario = "") => {
    try {
      await api.post("/comprador/valoraciones", {
        productoId,
        calificacion: valor,
        comentario,
      });
      mostrarToast("success", "¡Gracias por tu valoración!");
      setValoraciones((prev) => ({
        ...prev,
        [`${productoId}`]: valor,
      }));
    } catch {
      mostrarToast("error", "No se pudo guardar la valoración");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2>Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <div>No tienes pedidos aún.</div>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} style={{ border: "1px solid #eee", borderRadius: 8, marginBottom: 16, padding: 16 }}>
            <h4>Pedido #{pedido.id} - Estado: {pedido.estado}</h4>
            <p><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</p>
            <p><strong>Total:</strong> ${pedido.total}</p>
            <div>
              <strong>Productos:</strong>
              <ul>
                {pedido.productos.map((prod, idx) => (
                  <li key={idx}>
                    {prod.producto?.nombre} x{prod.cantidad} (${prod.precio})
                    {pedido.estado === "entregado" && (
                      <span style={{ marginLeft: 16 }}>
                        <Rating
                          value={valoraciones[`${prod.productoId}`] || 0}
                          cancel={false}
                          onChange={(e) => handleValorar(pedido.id, prod.productoId, e.value, comentarios[`${prod.productoId}`] || "")}
                        />
                        <input
                          type="text"
                          placeholder="Comentario"
                          value={comentarios[`${prod.productoId}`] || ""}
                          onChange={e =>
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
        ))
      )}
    </div>
  );
};

export default MisPedidosPage;