import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compradorId, setCompradorId] = useState(null);
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
    if (compradorId) cargarCarrito();
    // eslint-disable-next-line
  }, [compradorId]);

  const cargarCarrito = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/carrito/${compradorId}`);
      setCarrito(res.data);
    } catch (error) {
      mostrarToast("error", "Error al cargar el carrito");
    }
    setLoading(false);
  };

  const actualizarCantidad = async (productoId, cantidad) => {
    if (cantidad < 1) return;
    try {
      await api.patch(`/carrito/actualizar/${compradorId}/${productoId}`, { cantidad });
      cargarCarrito();
    } catch (error) {
      mostrarToast("error", "No se pudo actualizar la cantidad");
    }
  };

  const eliminarProducto = async (productoId) => {
    try {
      await api.delete(`/carrito/eliminar/${compradorId}/${productoId}`);
      cargarCarrito();
      mostrarToast("success", "Producto eliminado");
    } catch (error) {
      mostrarToast("error", "No se pudo eliminar el producto");
    }
  };

  const confirmarCompra = async () => {
    if (!window.confirm("¿Estás seguro de que deseas realizar la compra?")) {
      return;
    }
    try {
      const grupos = agruparPorLocatario(carrito);

      for (const grupo of grupos) {
        const metodoEntrega = grupo.locatario.formatoEntrega || "envio";
        const direccionEntrega = "Dirección de ejemplo";

        const productos = grupo.productos.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precio: item.producto.precio,
        }));

        await api.post("/comprador/pedidos", {
          locatarioId: grupo.locatario.id,
          metodoEntrega,
          direccionEntrega,
          productos,
          total: productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
        });
      }

      mostrarToast("success", "Compra confirmada");
      await api.delete(`/carrito/vaciar/${compradorId}`);
      setCarrito([]);
      cargarCarrito();
    } catch (error) {
      mostrarToast("error", "No se pudo confirmar la compra");
    }
  };

  const mostrarToast = (severity, summary) => {
    if (toast.current) {
      toast.current.show({ severity, summary, life: 2000 });
    }
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );
  };

  const agruparPorLocatario = (carrito) => {
    const grupos = {};
    carrito.forEach(item => {
      const locatarioId = item.producto.locatario.id;
      if (!grupos[locatarioId]) {
        grupos[locatarioId] = {
          locatario: item.producto.locatario,
          productos: []
        };
      }
      grupos[locatarioId].productos.push(item);
    });
    return Object.values(grupos);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #F8FAFC 60%, #E3F2FD 100%)"
      }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: "#1976D2" }}></i>
      </div>
    );
  }

  const carritoAgrupado = agruparPorLocatario(carrito);

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
        }}>
          Mi Carrito
        </h1>
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

      <div style={{ flex: 1, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {carrito.length === 0 ? (
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
            padding: "2.5rem",
            textAlign: "center",
            color: "#888",
            marginTop: 40
          }}>
            El carrito está vacío.
          </div>
        ) : (
          <div>
            {carritoAgrupado.map((grupo) => (
              <div key={grupo.locatario.id} style={{
                marginBottom: "2rem",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(25,118,210,0.08)",
                padding: "1.5rem"
              }}>
                <h3 style={{ color: "#1976D2", fontWeight: 700, marginBottom: 18 }}>
                  {grupo.locatario.nombre}
                </h3>
                {grupo.productos.map((item) => (
                  <div
                    key={item.producto.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.5rem",
                      gap: 18,
                      background: "#F5F7FA",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ flex: 3 }}>
                      <span style={{ fontWeight: 700, color: "#1976D2" }}>{item.producto.nombre}</span>
                      <div style={{ color: "#444", fontSize: 14, marginTop: 2 }}>
                        {item.producto.descripcion || "Sin descripción"}
                      </div>
                    </div>
                    <span style={{ flex: 1, color: "#43A047", fontWeight: 600, fontSize: 16 }}>
                      ${item.producto.precio}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        minWidth: 0
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0,
                          background: "#fff",
                          borderRadius: 8,
                          border: "1.5px solid #E3E7ED",
                          padding: "2px 4px",
                          minWidth: 0
                        }}
                      >
                        <Button
                          icon="pi pi-minus"
                          className="p-button-sm p-button-rounded"
                          style={{
                            marginRight: 2,
                            background: "#E57373",
                            border: "none",
                            color: "#fff"
                          }}
                          onClick={() =>
                            actualizarCantidad(item.producto.id, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                        />
                        <span
                          style={{
                            minWidth: 32,
                            textAlign: "center",
                            fontWeight: 600,
                            fontSize: 16,
                            color: "#222",
                            display: "inline-block"
                          }}
                        >
                          {item.cantidad}
                        </span>
                        <Button
                          icon="pi pi-plus"
                          className="p-button-sm p-button-rounded"
                          style={{
                            marginLeft: 2,
                            background: "#43A047",
                            border: "none",
                            color: "#fff"
                          }}
                          onClick={() =>
                            actualizarCantidad(item.producto.id, item.cantidad + 1)
                          }
                          disabled={item.cantidad >= item.producto.stock}
                        />
                      </div>
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={() => eliminarProducto(item.producto.id)}
                        size="small"
                        style={{
                          background: "#E53935",
                          border: "none",
                          borderRadius: 6,
                          color: "#fff",
                          padding: "6px 8px",
                          marginLeft: 8
                        }}
                        tooltip="Eliminar"
                        className="p-button-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{
              marginTop: "1rem",
              fontWeight: "bold",
              fontSize: 18,
              color: "#1976D2",
              textAlign: "right"
            }}>
              Total: ${calcularTotal()}
            </div>
            <Button
              label="Confirmar compra"
              icon="pi pi-check"
              onClick={confirmarCompra}
              style={{
                marginTop: "1.5rem",
                background: "linear-gradient(90deg, #1976D2 60%, #43A047 100%)",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
                width: "100%"
              }}
              disabled={carrito.length === 0}
            />
          </div>
        )}
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <LogoutButton />
          <p style={{ color: "#fff", margin: 0 }}>&copy; 2023 Comercio Digital y Local - Todos los derechos reservados</p>
          <p style={{ color: "#fff", margin: 0 }}>Creado por <b>Run Mafia</b></p>
        </div>
      </footer>
    </div>
  );
};

export default CarritoPage;