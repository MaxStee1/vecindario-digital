import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compradorId, setCompradorId] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get("/comprador/perfil");
        setCompradorId(res.data.id);  // id del comprador
      } catch {
        mostrarToast("error", "No se pudo obetener el perfil");
      }
    };
    fetchPerfil();
    // eslint-disable-next-line
  })

  // Cargar carrito al montar
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

  const actualizarCantidad = async (productoId: Producto, cantidad) => {
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
      // Vaciar el carrito en el backend
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

  // Agrupa los productos del carrito por locatario
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

  if (loading) return <div>Cargando...</div>;

  const carritoAgrupado = agruparPorLocatario(carrito);

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <h2>Mi Carrito</h2>
      {carrito.length === 0 ? (
        <div>El carrito está vacío.</div>
      ) : (
        <div>
          {carritoAgrupado.map((grupo) => (
            <div key={grupo.locatario.id} style={{ marginBottom: "2rem" }}>
              <h3>{grupo.locatario.nombre}</h3>
              {grupo.productos.map((item) => (
                <div
                  key={item.producto.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "0.5rem",
                  }}
                >
                  <span style={{ flex: 2 }}>{item.producto.nombre}</span>
                  <span style={{ flex: 1 }}>${item.producto.precio}</span>
                  <InputNumber
                    value={item.cantidad}
                    min={1}
                    onValueChange={(e) =>
                      actualizarCantidad(item.producto.id, e.value)
                    }
                    style={{ width: "60px", marginRight: "1rem" }}
                  />
                  <Button
                    label="Eliminar"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => eliminarProducto(item.producto.id)}
                    size="small"
                  />
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
            Total: ${calcularTotal()}
          </div>
          <Button
            label="Confirmar compra"
            icon="pi pi-check"
            onClick={confirmarCompra}
            style={{ marginTop: "1rem" }}
            disabled={carrito.length === 0}
          />
        </div>
      )}
    </div>
  );
};

export default CarritoPage;