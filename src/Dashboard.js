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

  const totalMediciones = data.length;
  const totalRiesgos = data.filter((d) => d.riesgo_detectado).length;
  const porcentajeRiesgos = totalMediciones
    ? ((totalRiesgos / totalMediciones) * 100).toFixed(2)
    : 0;

  const dataRiesgo = data
    .filter((d) => d.riesgo_detectado)
    .map((d) => ({
      timestamp: d.timestamp,
      score_rosa: d.score_rosa,
    }));

  const dataNoRiesgo = data
    .filter((d) => !d.riesgo_detectado)
    .map((d) => ({
      timestamp: d.timestamp,
      score_rosa: d.score_rosa,
    }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard de Postura - <span className="text-green-600">Lili Monitor</span>
        </h1>

        <button
          onClick={cargarMediciones}
          disabled={loading}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition disabled:bg-gray-400"
        >
          {loading ? "Cargando..." : "Cargar mediciones"}
        </button>
      </div>

      {data.length > 0 && (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow flex flex-col">
              <span className="text-gray-500">Total Mediciones</span>
              <span className="text-4xl font-bold">{totalMediciones}</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex flex-col">
              <span className="text-gray-500">Riesgos Detectados</span>
              <span className="text-4xl font-bold text-red-600">{totalRiesgos}</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex flex-col">
              <span className="text-gray-500">Porcentaje de Riesgos</span>
              <span className="text-4xl font-bold text-green-600">{porcentajeRiesgos}%</span>
            </div>
          </div>

          {/* TABLA */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">Datos Recibidos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {Object.keys(data[0]).map((k) => (
                      <th key={k} className="px-3 py-2 font-semibold text-gray-700">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      {Object.entries(row).map(([key, val], j) => (
                        <td key={j} className="px-3 py-2 text-center">
                          {key === "riesgo_detectado" ? (
                            val ? (
                              <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold">
                                Riesgo
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-lg bg-green-600 text-white font-bold">
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
            </div>
          </div>

          {/* GRÁFICO LINEAL */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">Evolución del Score ROSA</h2>
            <div className="w-full h-72">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score_rosa" stroke="#22c55e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SCATTER RISK CHART */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Distribución Score ROSA con Riesgo
            </h2>
            <div className="w-full h-96">
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    name="Fecha"
                    type="category"
                    interval={Math.floor(data.length / 10)}
                    tickFormatter={(t) => t.split("T")[0]}
                  />
                  <YAxis dataKey="score_rosa" name="Score ROSA" />
                  <Tooltip />
                  <Legend />
                  <Scatter name="Riesgo" data={dataRiesgo} fill="#dc2626" />
                  <Scatter name="Sin Riesgo" data={dataNoRiesgo} fill="#22c55e" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
