import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import useStyles from "./tableTrabajadores.styles";

function TableTrabajadoresComponent({ trabajadores }) {
  const classes = useStyles();
  //   const paginatedTrabajadores = trabajadores.slice(
  //     page * rowsPerPage,
  //     page * rowsPerPage + rowsPerPage
  //   );

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Apellido Paterno
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Apellido Materno
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Fecha de Contratación
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Rol
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Username
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trabajadores.map((trabajador) => (
              <TableRow key={trabajador.id_trabajador}>
                <TableCell>{trabajador.nombre}</TableCell>
                <TableCell>{trabajador.apellido_paterno}</TableCell>
                <TableCell>{trabajador.apellido_materno}</TableCell>
                <TableCell>{trabajador.fecha_contratacion}</TableCell>
                <TableCell>{trabajador.id_rol}</TableCell>
                <TableCell>{trabajador.username}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trabajadores.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      /> */}
    </Paper>
  );
}

export default TableTrabajadoresComponent;
