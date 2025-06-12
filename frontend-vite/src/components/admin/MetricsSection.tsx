import React from "react";
import { Chart } from 'primereact/chart';

interface MetricsProps {
    estadisticas: {
        totalUsuarios: number,
        totalVentas: number,
        localesActivos:number,
        totalLocatarios: number;
        totalCompradores: number;
        totalRepartidores: number;

    };
}

const MetricsSection: React.FC<MetricsProps> = ({ estadisticas }) => {
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
                    flex: 2, 
                    minWidth: "400px",
                    backgroundColor: "#242424",
                    padding: "20px", 
                    borderRadius: "10px",
                    boxShadow: "0 0px 8px rgb(0 0 0 / 40%)"
                }}>
                    <h3 style={{ textAlign: "center" }}>Comparación de Métricas</h3>
                    <Chart type="bar" data={barData} options={barOptions} style={{ width: '100%' }} />
                    <p style={{ textAlign: "center", fontStyle: "italic", marginTop: "10px" }}>
                        Nota: Las ventas están representadas en miles para mejor visualización
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MetricsSection;