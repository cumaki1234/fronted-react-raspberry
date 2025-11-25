import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  TablePagination,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Legend,
} from "recharts";


function Dashboard() {
  const API_URL = "https://backend-flask-raspberry.onrender.com/api/v1";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados de paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Cambiar página 1
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Cambiar cantidad de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


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

  // KPIs
  const totalMediciones = data.length;
  const totalRiesgos = data.filter((d) => d.riesgo_detectado).length;
  const porcentajeRiesgos = totalMediciones
    ? ((totalRiesgos / totalMediciones) * 100).toFixed(2)
    : 0;

  const dataRiesgo = data
    .filter((d) => d.riesgo_detectado)
    .map((d) => ({ timestamp: d.timestamp, score_rosa: d.score_rosa }));

  const dataNoRiesgo = data
    .filter((d) => !d.riesgo_detectado)
    .map((d) => ({ timestamp: d.timestamp, score_rosa: d.score_rosa }));

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f5f7" }}>
      {/* NAVBAR */}
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard de Postura - Lili Monitor
          </Typography>

          <Button
            color="inherit"
            onClick={cargarMediciones}
            startIcon={<RefreshIcon />}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar mediciones"}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {/* KPIs */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Mediciones</Typography>
                <Typography variant="h4">{totalMediciones}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Riesgos Detectados</Typography>
                <Typography variant="h4">{totalRiesgos}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Porcentaje de Riesgos</Typography>
                <Typography variant="h4">{porcentajeRiesgos}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TABLA */}
        {data.length > 0 && (
          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Datos recibidos
            </Typography>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  {Object.keys(data[0]).map((k) => (
                    <th
                      key={k}
                      style={{
                        padding: "8px",
                        backgroundColor: "#1976d2",
                        color: "white",
                      }}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => (
                    <tr key={i}>
                      {Object.entries(row).map(([key, val], j) => (
                        <td
                          key={j}
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #ddd",
                            textAlign: "center",
                          }}
                        >
                          {key === "riesgo_detectado" ? (
                            <Chip
                              label={val ? "Riesgo" : "OK"}
                              color={val ? "error" : "success"}
                              size="small"
                            />
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

            {/* PAGINACIÓN */}
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        )}


        {/* GRÁFICO LINEAL */}
        {data.length > 0 && (
          <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Score ROSA
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score_rosa" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {/* SCATTER CHART */}
        {data.length > 0 && (
          <Paper sx={{ p: 2, mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Distribución Score ROSA (Riesgo vs. No Riesgo)
            </Typography>

            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" type="category" />
                <YAxis dataKey="score_rosa" />
                <Tooltip />
                <Legend />

                <Scatter name="Riesgo" data={dataRiesgo} fill="red" />
                <Scatter name="Sin Riesgo" data={dataNoRiesgo} fill="green" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
