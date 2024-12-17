import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import productosInventarioService from "../../../async/services/get/productosInventarioService";
import { useQuery } from "react-query";

function ModalViewProduct({ handleClose, product }) {
  const { data, isLoading, error } = useQuery(
    `InventarioProducts`,
    () => productosInventarioService(product?.id_producto),
    {
      enabled: !!product?.id_producto,
    }
  );

  if (isLoading) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Ver Producto</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ocurrió un error al cargar los inventarios. Por favor, intenta de
            nuevo.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Ver Producto</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Producto: {data.producto}</Typography>
        <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
          <Table>
            <TableHead style={{ backgroundColor: "#3d97ef" }}>
              <TableRow>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Número de Lote
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Cantidad (c/p)
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Unidades
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Peso (kg)
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Caducidad
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Ingreso
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.inventarios.map((inventario, index) => (
                <TableRow key={index}>
                  <TableCell>{inventario.numero_lote}</TableCell>
                  <TableCell style={{ color: "green" }}>
                    {inventario.cantidad > 0 && inventario.subCantidad === 0
                      ? inventario.subCantidad
                      : inventario.cantidad}
                  </TableCell>
                  <TableCell
                    style={{
                      color: "green",
                    }}
                  >
                    {inventario.cantidad > 0 && inventario.subCantidad === 0
                      ? inventario.cantidad
                      : inventario.subCantidad}
                  </TableCell>
                  <TableCell
                    style={{ color: inventario.peso > 0 ? "green" : "red" }}
                  >
                    {inventario.peso}
                  </TableCell>
                  <TableCell>
                    {inventario.fecha_caducidad
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                  <TableCell>
                    {inventario.fecha_ingreso
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalViewProduct;
