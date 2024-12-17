import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Button,
  Box,
  Popper,
  Paper,
  InputLabel,
  Select,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Typography, Autocomplete, TextField } from "@mui/material";

const ProductoProveedorForm = ({
  proveedor,
  setProveedor,
  producto,
  setProducto,
  productos,
  proveedores,
  handleOpenProductoModal,
  handleOpenProveedorModal,
  isLoteProveedorLocked,
  setError,
}) => {
  const [errors, setErrors] = useState({
    proveedor: false,
    producto: false,
  });

  const [filteredProductos, setFilteredProductos] = useState([]);

  useEffect(() => {
    validateForm();
  }, [proveedor, producto]);

  const validateForm = () => {
    let newErrors = {
      proveedor: false,
      producto: false,
    };

    let hasErrors = false;

    if (!proveedor) {
      newErrors.proveedor = true;
      hasErrors = true;
    }

    if (!producto) {
      newErrors.producto = true;
      hasErrors = true;
    }

    setErrors(newErrors);
    setError(hasErrors);
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Box
        style={{
          width: "100%",
          display: "flex",
          gap: 20,
          alignItems: "flex-end",
        }}
      >
        <FormControl style={{ width: "16rem" }} error={errors.producto}>
          <Autocomplete
            id="disable-close-on-select"
            options={productos}
            getOptionLabel={(option) =>
              `${option.nombre} - ${option.codigo_barra}`
            }
            filterOptions={(options, { inputValue }) =>
              options.filter(
                (product) =>
                  product.nombre
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                  product.codigo_barra.includes(inputValue)
              )
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setProducto(newValue.id_producto);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar Producto"
                variant="standard"
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.id_producto === value.id_producto
            }
            disableClearable
            sx={{ width: "16rem" }}
            error={errors.producto}
          />
        </FormControl>
        <Button
          onClick={handleOpenProductoModal}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AddCircleOutlineIcon />
        </Button>
      </Box>
      {/* {producto && (
        <Typography>
          Producto: {productos.find((p) => p.id_producto === producto)?.nombre}
        </Typography>
      )} */}

      {errors.producto && (
        <Typography
          style={{
            color: "red",
            fontSize: ".9rem",
            fontWeight: "normal",
          }}
        >
          Este campo es requerido
        </Typography>
      )}

      <Box
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 20,
        }}
      >
        <FormControl style={{ width: "16rem" }} error={errors.proveedor}>
          <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            label="proveedor"
            id="demo-simple-select"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            disabled={isLoteProveedorLocked}
          >
            {proveedores.map((proveedor) => (
              <MenuItem
                key={proveedor.id_proveedor}
                value={proveedor.id_proveedor}
              >
                {proveedor.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={handleOpenProveedorModal}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          disabled={isLoteProveedorLocked}
        >
          <AddCircleOutlineIcon color="red" />
        </Button>
      </Box>
      {errors.proveedor && (
        <Typography style={{ color: "red" }}>
          Este campo es requerido
        </Typography>
      )}
    </Box>
  );
};

export default ProductoProveedorForm;
