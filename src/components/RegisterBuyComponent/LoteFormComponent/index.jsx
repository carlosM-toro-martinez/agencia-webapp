import React, { useEffect, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { InputAdornment, Typography } from "@mui/material";

const LoteFormComponent = ({
  lote,
  setLote,
  fechaCaducidad,
  setFechaCaducidad,
  cantidad,
  setCantidad,
  precio,
  setPrecio,
  loteData,
  setError,
  isLoteProveedorLocked,
  peso,
  setPeso,
  subCantidad,
  setSubCantidad,
}) => {
  const [errors, setErrors] = useState({
    lote: false,
    fechaCaducidad: false,
    loteExists: false,
    caducidadPasada: false,
  });

  const [productoConPeso, setProductoConPeso] = useState(false);
  const [compraPorMayor, setCompraPorMayor] = useState(false);
  const [compraPorUnidad, setCompraPorUnidad] = useState(false);

  useEffect(() => {
    validateForm();
  }, [lote, fechaCaducidad]);

  const validateForm = () => {
    let newErrors = {
      lote: false,
      fechaCaducidad: false,
      loteExists: false,
      caducidadPasada: false,
    };

    let hasErrors = false;

    if (
      loteData?.some((item) => item.numero_lote === lote) &&
      !isLoteProveedorLocked
    ) {
      newErrors.loteExists = true;
      hasErrors = true;
    }

    if (!lote && !isLoteProveedorLocked) {
      newErrors.lote = true;
      hasErrors = true;
    }

    if (!fechaCaducidad) {
      newErrors.fechaCaducidad = true;
      hasErrors = true;
    } else {
      const today = new Date();
      const selectedDate = new Date(fechaCaducidad);
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.caducidadPasada = true;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    setError(hasErrors);
  };

  const generateRandomLote = () => {
    let randomLote;
    const maxAttempts = 100;
    let attempt = 0;
    do {
      randomLote = Math.floor(100000 + Math.random() * 900000).toString();
      attempt++;
    } while (
      loteData?.some((item) => item.numero_lote === randomLote) &&
      attempt < maxAttempts
    );

    if (attempt < maxAttempts) {
      setLote(randomLote);
    } else {
      alert("No se pudo generar un número de lote único, intenta de nuevo.");
    }
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Box
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          margin: "1rem 0 1rem 0",
        }}
      >
        <TextField
          label="Número de Lote"
          fullWidth
          value={lote}
          onChange={(e) => {
            if (!isLoteProveedorLocked) {
              setLote(e.target.value);
            }
          }}
          margin="normal"
          error={errors.lote || errors.loteExists}
          helperText={
            errors.loteExists
              ? "Error: Ese número de lote ya existe"
              : errors.lote
              ? "Este campo es requerido"
              : ""
          }
          disabled={isLoteProveedorLocked}
          style={{
            width: "10rem",
          }}
        />
        <Button
          variant="contained"
          onClick={generateRandomLote}
          disabled={isLoteProveedorLocked}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Generar
        </Button>
      </Box>

      <Box style={{ display: "flex", gap: 30, width: "16rem" }}>
        <TextField
          label="Fecha de Caducidad"
          fullWidth
          type="date"
          value={fechaCaducidad}
          onChange={(e) => setFechaCaducidad(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={errors.fechaCaducidad || errors.caducidadPasada}
          helperText={
            errors.fechaCaducidad
              ? "Este campo es requerido"
              : errors.caducidadPasada
              ? "La fecha de caducidad no puede ser anterior a la fecha actual"
              : ""
          }
        />
      </Box>

      <Box style={{ display: "flex", gap: 20, margin: "1rem 0" }}>
        <FormControlLabel
          control={
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={productoConPeso}
                onChange={(e) => {
                  setProductoConPeso(e.target.checked);
                  if (e.target.checked) {
                    setCompraPorMayor(false);
                    setCompraPorUnidad(false);
                    setPeso(null);
                    setSubCantidad(null);
                    setPrecio(null);
                    setCantidad(null);
                  }
                }}
                color="primary"
              />
              <Typography
                variant="body2"
                style={{ marginTop: "4px", textAlign: "center" }}
              >
                Producto con peso
              </Typography>
            </Box>
          }
          label=""
        />
        <FormControlLabel
          control={
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={compraPorMayor}
                onChange={(e) => {
                  setCompraPorMayor(e.target.checked);
                  if (e.target.checked) {
                    setProductoConPeso(false);
                    setCompraPorUnidad(false);
                    setPeso(null);
                    setSubCantidad(null);
                    setPrecio(null);
                    setCantidad(null);
                  }
                }}
                color="primary"
              />
              <Typography
                variant="body2"
                style={{ marginTop: "4px", textAlign: "center" }}
              >
                Compra por paquetes
              </Typography>
            </Box>
          }
          label=""
        />

        <FormControlLabel
          control={
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={compraPorUnidad}
                onChange={(e) => {
                  setCompraPorUnidad(e.target.checked);
                  if (e.target.checked) {
                    setProductoConPeso(false);
                    setCompraPorMayor(false);
                    setPeso(null);
                    setSubCantidad(null);
                    setPrecio(null);
                    setCantidad(null);
                  }
                }}
                color="primary"
              />
              <Typography
                variant="body2"
                style={{ marginTop: "4px", textAlign: "center" }}
              >
                Compra por unidad
              </Typography>
            </Box>
          }
          label=""
        />
      </Box>
      {(compraPorMayor || compraPorUnidad) && (
        <TextField
          label={compraPorMayor ? "Paquetes o cajas" : "Cantidad"}
          fullWidth
          type="number"
          value={cantidad || ""}
          onChange={(e) => setCantidad(e.target.value)}
          margin="normal"
          error={errors.cantidad}
          required
          helperText={
            compraPorMayor ? "Ej. 3 paq de cocacola" : "Ej. 12 u leche gloria"
          }
          style={{ width: "70%" }}
        />
      )}

      {compraPorMayor && (
        <Box style={{ display: "flex", gap: 30 }}>
          <TextField
            id="standard-basic"
            label="Cantidad por caja o paquete"
            type="number"
            value={subCantidad || ""}
            onChange={(e) => setSubCantidad(e.target.value)}
            fullWidth
            margin="normal"
            variant="standard"
            required
            helperText="Ej. 6 cocacolas por paq."
            style={{ width: "80%" }}
          />
        </Box>
      )}

      {productoConPeso && (
        <Box style={{ display: "flex", gap: 30 }}>
          <TextField
            id="standard-basic"
            label="Peso Total (Kg)"
            type="number"
            value={peso || ""}
            onChange={(e) => setPeso(e.target.value)}
            fullWidth
            margin="normal"
            variant="standard"
            helperText="Peso Total (Kg)"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            style={{ width: "60%" }}
          />
        </Box>
      )}
      {(productoConPeso || compraPorMayor || compraPorUnidad) && (
        <TextField
          label={
            productoConPeso
              ? "Precio total"
              : compraPorMayor
              ? "Precio por caja"
              : "Precio por unidad"
          }
          type="number"
          value={precio || ""}
          onChange={(e) => setPrecio(e.target.value)}
          margin="normal"
          error={errors.precio}
          helperText={
            productoConPeso
              ? "Precio total"
              : compraPorMayor
              ? "Ej. 60Bs por paq."
              : "Ej. 8.5BS porunidad"
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">Bs</InputAdornment>,
          }}
          style={{ width: "70%" }}
        />
      )}
    </Box>
  );
};

export default LoteFormComponent;
