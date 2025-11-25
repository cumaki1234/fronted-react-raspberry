import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination
} from "@mui/material";
import { useState } from "react";

function TablaMediciones({ data }) {

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const keys = Object.keys(data[0]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 4 }}>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {keys.map((k) => (
                <TableCell key={k} sx={{ fontWeight: "bold" }}>
                  {k}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow key={i} hover>
                  {keys.map((key) => (
                    <TableCell key={key} align="center">
                      {key === "riesgo_detectado" ? (
                        row[key] ? (
                          <span style={{
                            padding: "4px 8px",
                            background: "red",
                            color: "white",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}>
                            Riesgo
                          </span>
                        ) : (
                          <span style={{
                            padding: "4px 8px",
                            background: "green",
                            color: "white",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}>
                            OK
                          </span>
                        )
                      ) : key === "notificacion_enviada" ? (
                        row[key] ? "Sí" : "No"
                      ) : (
                        row[key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      <TablePagination
        component="div"
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
      />
    </Paper>
  );
}

export default TablaMediciones;
