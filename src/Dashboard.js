import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Legend
} from "recharts";

function Dashboard() {
  const API_URL = "https://backend-flask-raspberry.onrender.com/api/v1";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarMediciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mediciones`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
    setLoading(false);
  };
    const datosParaGrafico = data.map((item) => ({
        ...item,
        riesgo_detectado: item.riesgo_detectado ? 1 : 0,
        notificacion_enviada: item.notificacion_enviada ? "Sí" : "No", // opcional para mostrar en tabla
    }));

     // Cálculos KPI
    const totalMediciones = data.length;
    const totalRiesgos = data.filter((d) => d.riesgo_detectado).length;
    const porcentajeRiesgos = totalMediciones
        ? ((totalRiesgos / totalMediciones) * 100).toFixed(2)
    : 0;

     // Separar datos por riesgo y no riesgo
  const dataRiesgo = data.filter((d) => d.riesgo_detectado).map(d => ({
    timestamp: d.timestamp,
    score_rosa: d.score_rosa,
  }));

  const dataNoRiesgo = data.filter((d) => !d.riesgo_detectado).map(d => ({
    timestamp: d.timestamp,
    score_rosa: d.score_rosa,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard de Postura - Lili Monitor</h1>

      <button onClick={cargarMediciones} disabled={loading}>
        {loading ? "Cargando..." : "Cargar mediciones"}
      </button>

      {data.length > 0 && (
        <>
          {/* KPIs */}
          <div style={{ margin: "20px 0" }}>
            <strong>Total mediciones:</strong> {totalMediciones} <br />
            <strong>Total riesgos detectados:</strong> {totalRiesgos} <br />
            <strong>Porcentaje de riesgos:</strong> {porcentajeRiesgos}%
          </div>

          {/* Tabla con badges */}
          <h2>Datos recibidos</h2>
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {Object.keys(data[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.entries(row).map(([key, val], j) => (
                    <td key={j} style={{ textAlign: "center" }}>
                      {key === "riesgo_detectado" ? (
                        val ? (
                          <span style={{
                            color: "white",
                            backgroundColor: "red",
                            padding: "3px 7px",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}>
                            Riesgo
                          </span>
                        ) : (
                          <span style={{
                            color: "white",
                            backgroundColor: "green",
                            padding: "3px 7px",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}>
                            OK
                          </span>
                        )
                      ) : key === "notificacion_enviada" ? (
                        val ? "Sí" : "No"
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gráfico Score ROSA */}
          <h2>Score ROSA</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score_rosa" stroke="blue" />
            </LineChart>
          </ResponsiveContainer>
           <h2>Distribución Score ROSA con Riesgo Detectado</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                name="Fecha"
                type="category"
                interval={Math.floor(data.length / 10)}
                tickFormatter={(tick) => tick.split("T")[0]}
              />
              <YAxis dataKey="score_rosa" name="Score ROSA" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Riesgo"
                data={dataRiesgo}
                fill="red"
                shape="circle"
              />
              <Scatter
                name="Sin Riesgo"
                data={dataNoRiesgo}
                fill="green"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default Dashboard;
