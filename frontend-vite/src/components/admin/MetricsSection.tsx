import React from "react";
import { Chart } from 'primereact/chart';
import { FaUsers, FaStore, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

interface PedidoPorEstado {
    estado: string;
    _count: { _all: number };
}

interface ProductoMasVendido {
    nombre: string;
    cantidadVendida: number;
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
}

const cardColors = [
    { bg: "#F5F7FA", color: "#1976D2" },
    { bg: "#FFF3E0", color: "#FFA726" },
    { bg: "#E8F5E9", color: "#43A047" },
    { bg: "#FFFDE7", color: "#FFD600" }
];

const MetricsSection: React.FC<MetricsProps> = ({ estadisticas }) => {
    // Gráficos
    const donutData = {
        labels: ['Locatarios', 'Compradores', 'Repartidores'],
        datasets: [
            {
                data: [estadisticas.totalLocatarios, estadisticas.totalCompradores, estadisticas.totalRepartidores],
                backgroundColor: [
                    '#1976D2',
                    '#43A047',
                    '#FFA726'
                ],
                hoverBackgroundColor: [
                    '#2196F3',
                    '#66BB6A',
                    '#FFB74D'
                ]
            }
        ]
    };

    const donutOptions = {
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const barData = {
        labels: ['Usuarios', 'Ventas (K)', 'Locales Activos'],
        datasets: [
            {
                label: 'Métricas',
                backgroundColor: ['#1976D2', '#43A047', '#FFA726'],
                data: [
                    estadisticas.totalUsuarios,
                    estadisticas.totalVentas / 1000,
                    estadisticas.localesActivos
                ]
            }
        ]
    };

    const barOptions = {
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };

    // Pedidos por estado
    const pedidosPorEstado = estadisticas.pedidosPorEstado || [];
    const pedidosEstadoData = {
        labels: pedidosPorEstado.map(e => e.estado),
        datasets: [
            {
                label: 'Cantidad de Pedidos',
                backgroundColor: '#1976D2',
                data: pedidosPorEstado.map(e => e._count._all)
            }
        ]
    };

    // Productos más vendidos
    const topProductos = estadisticas.topProductos || [];

    // Tarjetas de métricas rápidas
    const metricCards = [
        {
            icon: <FaUsers size={28} color={cardColors[0].color} />,
            label: "Total de Usuarios",
            value: estadisticas.totalUsuarios.toLocaleString(),
            ...cardColors[0]
        },
        {
            icon: <FaMoneyBillWave size={28} color={cardColors[1].color} />,
            label: "Total de Ventas",
            value: `$${estadisticas.totalVentas.toLocaleString()}`,
            ...cardColors[1]
        },
        {
            icon: <FaStore size={28} color={cardColors[2].color} />,
            label: "Locales Activos",
            value: estadisticas.localesActivos,
            ...cardColors[2]
        },
        {
            icon: <FaShoppingCart size={28} color={cardColors[3].color} />,
            label: "Pedidos Totales",
            value: pedidosPorEstado.reduce((acc, e) => acc + e._count._all, 0),
            ...cardColors[3]
        }
    ];

    return (
        <div style={{
            padding: "32px 0",
            background: "#F8FAFC",
            minHeight: "100vh",
            fontFamily: "Inter, Arial, sans-serif"
        }}>
            {/* Tarjetas de métricas rápidas */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
                flexWrap: "wrap",
                marginBottom: "36px"
            }}>
                {metricCards.map((card, idx) => (
                    <div key={idx} style={{
                        background: card.bg,
                        color: "#222",
                        borderRadius: "16px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                        padding: "28px 36px",
                        minWidth: "220px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transition: "box-shadow 0.2s",
                        border: `1.5px solid ${card.color}22`
                    }}>
                        <div style={{ marginBottom: 12 }}>{card.icon}</div>
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{card.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "32px",
                marginBottom: "36px"
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    padding: "28px 24px",
                    minWidth: "320px",
                    flex: 1,
                    maxWidth: 400
                }}>
                    <h3 style={{ textAlign: "center", marginBottom: 18, color: "#1976D2" }}>Distribución de Roles</h3>
                    <Chart type="doughnut" data={donutData} options={donutOptions} style={{ width: '100%' }} />
                </div>
                <div style={{
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    padding: "28px 24px",
                    minWidth: "320px",
                    flex: 1,
                    maxWidth: 500
                }}>
                    <h3 style={{ textAlign: "center", marginBottom: 18, color: "#43A047" }}>Comparación de Métricas</h3>
                    <Chart type="bar" data={barData} options={barOptions} style={{ width: '100%' }} />
                    <p style={{ textAlign: "center", fontStyle: "italic", marginTop: "10px", color: "#888" }}>
                        Nota: Las ventas están representadas en miles para mejor visualización
                    </p>
                </div>
            </div>

            {/* Gráfico de pedidos por estado */}
            <div style={{
                margin: "0 auto 36px auto",
                background: "#fff",
                padding: "28px 24px",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                maxWidth: 600
            }}>
                <h3 style={{ textAlign: "center", color: "#1976D2" }}>Pedidos por Estado</h3>
                <Chart type="bar" data={pedidosEstadoData} style={{ width: '100%' }} />
            </div>

            {/* Tabla de productos más vendidos */}
            <div style={{
                margin: "0 auto",
                background: "#fff",
                padding: "28px 24px",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                maxWidth: 600
            }}>
                <h3 style={{ textAlign: "center", color: "#FFA726" }}>Top 5 Productos Más Vendidos</h3>
                <table style={{
                    width: "100%",
                    color: "#222",
                    borderCollapse: "collapse",
                    fontSize: "16px"
                }}>
                    <thead>
                        <tr style={{ background: "#F5F7FA" }}>
                            <th style={{ borderBottom: "2px solid #EEE", padding: "10px 0" }}>Producto</th>
                            <th style={{ borderBottom: "2px solid #EEE", padding: "10px 0" }}>Cantidad Vendida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProductos.length === 0 ? (
                            <tr>
                                <td colSpan={2} style={{ textAlign: "center", padding: "16px", color: "#888" }}>
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            topProductos.map((prod, idx) => (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? "#FAFAFA" : "#FFF" }}>
                                    <td style={{ padding: "10px 0 10px 8px" }}>{prod.nombre}</td>
                                    <td style={{ padding: "10px 0", textAlign: "center", fontWeight: 600 }}>{prod.cantidadVendida}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MetricsSection;