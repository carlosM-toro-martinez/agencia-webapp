import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formMetodoVenta.styles";
import metodoVentasAddService from "../../async/services/post/metodoVentasAddService";

function FormMetodoVenta({ handleClose, refetchMetodoVentas, productos }) {
  const classes = useStyles();

  const [descripcion, setDescripcion] = useState("");
  const [cantidadPorMetodo, setCantidadPorMetodo] = useState();
  const [precio, setPrecio] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(metodoVentasAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Método de venta creado exitosamente!",
        severity: "success",
      });
      setCantidadPorMetodo();
      setPrecio();
      setDescripcion("");
      setSelectedProduct(null);
      refetchMetodoVentas();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el método de venta: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      const data = {
        descripcion,
        cantidad_por_metodo: cantidadPorMetodo,
        precio,
        id_producto: selectedProduct.id_producto,
      };
      mutation.mutate(data);
    } else {
      setSnackbar({
        open: true,
        message: "Por favor, selecciona un producto.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={productos || []}
              getOptionLabel={(option) => (option.nombre ? option.nombre : "")}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar Producto"
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.input}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              variant="outlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad por Método"
              variant="outlined"
              value={cantidadPorMetodo}
              onChange={(e) => setCantidadPorMetodo(e.target.value)}
              fullWidth
              required
              className={classes.input}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio"
              variant="outlined"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              fullWidth
              required
              className={classes.input}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creando..." : "Crear Método de Venta"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FormMetodoVenta;
