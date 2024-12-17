import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function MetodoPagoComponent({ metodoPago, setMetodoPago }) {
  const handleChange = (event) => {
    setMetodoPago(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="metodo-pago-label">Método de Pago</InputLabel>
      <Select
        labelId="metodo-pago-label"
        id="metodo-pago"
        value={metodoPago}
        onChange={handleChange}
      >
        <MenuItem value="Contado">Contado</MenuItem>
        <MenuItem value="Prestamo">Préstamo</MenuItem>
        <MenuItem value="Consignacion">Consignación</MenuItem>
        <MenuItem value="QR">QR</MenuItem>
      </Select>
    </FormControl>
  );
}

export default MetodoPagoComponent;
