import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation } from "react-query";
import metodoVentaServices from "../../async/services/delete/metodoVentaServices.js";
import useStyles from "./tableMetodoVenta.styles";

const TableMetodoVentaComponent = ({
  data,
  products,
  onProductSelect,
  refetch,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");
  const classes = useStyles();

  useEffect(() => {
    if (selectedProduct) {
      onProductSelect(selectedProduct.id_producto);
    }
  }, [selectedProduct, onProductSelect]);

  // Configurar el uso de useMutation
  const mutation = useMutation((id) => metodoVentaServices(id), {
    onSuccess: () => {
      setMessage("Método eliminado");
      refetch(); // Refresca los datos después de eliminar
      setTimeout(() => setMessage(""), 3000); // Limpia el mensaje después de 3 segundos
    },
    onError: () => {
      setMessage("Error al eliminar el método");
      setTimeout(() => setMessage(""), 3000); // Limpia el mensaje después de 3 segundos
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id); // Ejecutar la función de eliminación
  };

  return (
    <Box>
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, newValue) => {
          setSelectedProduct(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Producto"
            variant="outlined"
          />
        )}
      />

      <TableContainer
        component={Paper}
        style={{ marginTop: "20px" }}
        className={classes.tableContainer}
      >
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Descripción
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Cantidad por Método
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Precio
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id_metodo_venta}>
                <TableCell>{row.descripcion}</TableCell>
                <TableCell>{row.cantidad_por_metodo}</TableCell>
                <TableCell>
                  {row.precio !== null ? row.precio : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.id_metodo_venta)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {message && (
        <Typography
          variant="body2"
          color="success.main"
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default TableMetodoVentaComponent;