import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

const CalcChangeComponent = ({ totalVenta }) => {
  const [dineroCliente, setDineroCliente] = useState("");
  const [cambio, setCambio] = useState(null);

  useEffect(() => {
    const total = parseFloat(totalVenta);
    const dinero = parseFloat(dineroCliente);

    if (!isNaN(dinero)) {
      if (dinero >= total) {
        setCambio(dinero - total);
      } else {
        setCambio(null); // No mostrar cambio si el dinero es menor al total
      }
    } else {
      setCambio(null); // Resetear si el input no es válido
    }
  }, [dineroCliente, totalVenta]);

  const resetearCampos = () => {
    setDineroCliente("");
    setCambio(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 4,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" textAlign="center">
        Calculadora de Cambio
      </Typography>
      <Typography variant="body1" textAlign="center">
        Total de la Venta: <strong>Bs. {parseFloat(totalVenta).toFixed(2)}</strong>
      </Typography>
      <TextField
        label="Dinero Recibido del Cliente"
        type="number"
        value={dineroCliente}
        onChange={(e) => setDineroCliente(e.target.value)}
        fullWidth
        variant="outlined"
      />
      {cambio !== null && (
        <Typography
          variant="h6"
          textAlign="center"
          color={cambio >= 0 ? "text.primary" : "error"}
        >
          Cambio: Bs. {cambio.toFixed(2)}
        </Typography>
      )}
      <Button
        variant="outlined"
        color="primary"
        onClick={resetearCampos}
        fullWidth
      >
        Limpiar
      </Button>
    </Box>
  );
};

export default CalcChangeComponent;
