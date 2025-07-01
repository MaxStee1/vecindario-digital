import React from "react";
import { Chart } from 'primereact/chart';

interface PedidoPorEstado {
    estado: string;
    _count: { _all: number };
}

interface ProductoMasVendido {
    nombre: string;
    cantidadVendida: number;
}

interface LocatarioProductos {
    nombre: string;
    cantidadProductos: number;
}

interface MetricsProps {
    estadisticas: {
        totalUsuarios: number,
        totalVentas: number,
        localesActivos: number,
        totalLocatarios: number;
        totalCompradores: number;
        totalRepartidores: number;
        pedidosPorEstado?: PedidoPorEstado[];
        topProductos?: ProductoMasVendido[];
    };
    topLocatariosProductos?: LocatarioProductos[];
}

const MetricsSection: React.FC<MetricsProps> = ({ estadisticas, topLocatariosProductos = [] }) => {
    console.log("topLocatariosProductos", topLocatariosProductos);
    // Configuración del gráfico de dona para métricas principales
    const donutData = {
        labels: ['Locatarios', 'Compradores', 'Repartidores'],
        datasets: [
            {
                data: [estadisticas.totalLocatarios, estadisticas.totalCompradores, estadisticas.totalRepartidores],
                backgroundColor: [
                    '#42A5F5',
                    '#66BB6A',
                    '#FFA726'
                ],
                hoverBackgroundColor: [
                    '#64B5F6',
                    '#81C784',
                    '#FFB74D'
                ]
            }
        ]
    };

    const donutOptions = {
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    // Configuración del gráfico de barras para comparación
    const barData = {
        labels: ['Métricas'],
        datasets: [
            {
                label: 'Usuarios',
                backgroundColor: '#42A5F5',
                data: [estadisticas.totalUsuarios]
            },
            {
                label: 'Ventas',
                backgroundColor: '#66BB6A',
                data: [estadisticas.totalVentas / 1000] // Escalado para mejor visualización
            },
            {
                label: 'Locales Activos',
                backgroundColor: '#FFA726',
                data: [estadisticas.localesActivos]
            }
        ]
    };

    const barOptions = {
        scales: {
            x: {
                stacked: false
            },
            y: {
                beginAtZero: true
            }
        }
    };

    // Gráfico de pedidos por estado
    const pedidosPorEstado = estadisticas.pedidosPorEstado || [];
    const pedidosEstadoData = {
        labels: pedidosPorEstado.map(e => e.estado),
        datasets: [
            {
                label: 'Cantidad de Pedidos',
                backgroundColor: '#42A5F5',
                data: pedidosPorEstado.map(e => e._count._all)
            }
        ]
    };

    // Gráfico de productos por locatario (máximo 5)
    const productosLocatarioData = {
        labels: topLocatariosProductos.map(l => l.nombre),
        datasets: [
            {
                label: 'Cantidad de Productos',
                backgroundColor: '#42A5F5',
                data: topLocatariosProductos.map(l => l.cantidadProductos)
            }
        ]
    };

    // Tabla de productos más vendidos
    const topProductos = estadisticas.topProductos || [];

    const metricCardStyle = {
        backgroundColor: "#242424", 
        padding: "20px",
        borderRadius: "10px",
        margin: "10px",
        boxShadow: "0 4px 8px rgba(0 0 0 / 40%)",
        textAlign: "center" as const,
        minWidth: "200px"
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Sección de métricas rápidas */}
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                flexWrap: "wrap", 
                marginBottom: "30px" 
            }}>
                <div style={metricCardStyle}>
                    <h3>Total de Usuarios</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{estadisticas.totalUsuarios}</p>
                </div>
                <div style={metricCardStyle}>
                    <h3>Total de Ventas</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>${estadisticas.totalVentas.toLocaleString()}</p>
                </div>
                <div style={metricCardStyle}>
                    <h3>Locales Activos</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{estadisticas.localesActivos}</p>
                </div>
            </div>
            
            {/* Sección de gráficos */}
            <div style={{ 
                display: "flex", 
                flexDirection: "row", 
                flexWrap: "wrap", 
                justifyContent: "space-around",
                gap: "20px"
            }}>
                <div style={{ 
                    flex: 1, 
                    minWidth: "300px", 
                    backgroundColor: "#242424", 
                    padding: "20px", 
                    borderRadius: "10px",
                    boxShadow: "0 0px 8px rgb(0 0 0 / 40% )"
                }}>
                    <h3 style={{ textAlign: "center" }}>Distribución de Métricas</h3>
                    <Chart type="doughnut" data={donutData} options={donutOptions} style={{ width: '100%' }} />
                </div>
                
                <div style={{ 
                    flex: 1, 
                    minWidth: "500px",
                    backgroundColor: "#242424",
                    padding: "20px", 
                    borderRadius: "10px",
                    boxShadow: "0 0px 8px rgb(0 0 0 / 40%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "350px"
                }}>
                    <h3 style={{ textAlign: "center" }}>Top 5 Locatarios con más Productos</h3>
                    <div style={{ width: "100%", height: "250px" }}>
                        <Chart
                            type="bar"
                            data={productosLocatarioData}
                            options={{
                                indexAxis: 'y',
                                plugins: { legend: { display: false } },
                                maintainAspectRatio: false,
                                scales: {
                                    x: { beginAtZero: true, title: { display: true, text: 'Cantidad de Productos' } },
                                    y: { title: { display: true, text: 'Locatario' } }
                                }
                            }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>

            {/* Gráfico de pedidos por estado */}
            <div style={{
                marginTop: "30px",
                backgroundColor: "#242424",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0px 8px rgb(0 0 0 / 40%)",
                minWidth: "300px"
            }}>
                <h3 style={{ textAlign: "center" }}>Pedidos por Estado</h3>
                <Chart type="bar" data={pedidosEstadoData} style={{ width: '100%' }} />
            </div>

            {/* Tabla de productos más vendidos */}
            <div style={{
                marginTop: "30px",
                backgroundColor: "#242424",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0px 8px rgb(0 0 0 / 40%)",
                minWidth: "300px"
            }}>
                <h3 style={{ textAlign: "center" }}>Top 5 Productos Más Vendidos</h3>
                <table style={{ width: "100%", color: "white", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: "1px solid #666" }}>Producto</th>
                            <th style={{ borderBottom: "1px solid #666" }}>Cantidad Vendida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProductos.map((prod, idx) => (
                            <tr key={idx}>
                                <td style={{ padding: "8px" }}>{prod.nombre}</td>
                                <td style={{ padding: "8px", textAlign: "center" }}>{prod.cantidadVendida}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MetricsSection;