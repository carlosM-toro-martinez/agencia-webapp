import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ProductSelectedComponent from "./ProductSelectedComponent";
import ClienteAutocompleteComponent from "./ClienteAutocompleteComponent";
import ProductoAutocompleteComponent from "./ProductoAutocompleteComponent";

const VentaForm = ({
  ventaData,
  setVentaData,
  clientes,
  productos,
  setProducto,
  setCliente,
  addProducto,
  handleOpenClientModal,
  productosSeleccionados,
  setProductosSeleccionados,
  lote,
  setLote,
  setCancelForm,
  cantLimit,
  setCantLimit,
  cantUnitLimit,
  setCantUnitLimit,
  pesoLimit,
  setPesoLimit,
  removeProducto,
  setTotalPrice,
  productosDetallados,
  setProductosDetallados,
  metodoPago,
  setMetodoPago,
}) => {
  const [lotesProducto, setLotesProducto] = useState([]);
  const [peso, setPeso] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantLote, setCantLote] = useState(null);
  const [cantidadPorUnidad, setCantidadPorUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [cantidadPorCaja, setCantidadPorCaja] = useState("");
  const [metodosVenta, setMetodosVenta] = useState(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [cantidadMetodo, setcantidadMetodo] = useState(null);

  useEffect(() => {
    const clienteDefecto = clientes.find((cliente) => cliente.id_cliente === 1);
    if (clienteDefecto) {
      setCliente(clienteDefecto.id_cliente);
    }
  }, [clientes]);

  const handleProductoChange = (productoId, newValue) => {
    setMetodosVenta(newValue?.inventarios[0].lote?.producto?.metodosVenta);

    setProducto(productoId);

    const lotesFiltrados =
      productos
        .find((producto) => producto.id_producto === productoId)
        ?.inventarios.filter((inv) => inv.cantidad >= 1 || inv.peso > 0)
        .map((inv) => inv) || [];

    setLotesProducto(lotesFiltrados);
    setCantLimit(lotesFiltrados[0]?.lote?.producto?.stock);
    setCantUnitLimit(lotesFiltrados[0]?.lote?.producto?.subCantidad);
    setPesoLimit(lotesFiltrados[0]?.lote?.producto?.peso);

    setCantidadPorCaja(
      lotesFiltrados[0]?.lote?.cantidadPorCaja
        ? lotesFiltrados[0]?.lote?.cantidadPorCaja
        : null
    );

    if (lotesFiltrados.length > 0) {
      const loteMasAntiguo = lotesFiltrados.reduce((prev, current) => {
        const prevDate = new Date(prev.lote.fecha_caducidad);
        const currentDate = new Date(current.lote.fecha_caducidad);
        return currentDate < prevDate ? current : prev;
      });

      setProductosDetallados((prev) => [
        ...prev,
        {
          productoId,
          newValue,
          lotesFiltrados,
          cantLimit: lotesFiltrados[0]?.lote?.producto?.stock,
          cantUnitLimit: lotesFiltrados[0]?.lote?.producto?.subCantidad,
          pesoLimit: lotesFiltrados[0]?.lote?.producto?.peso,
          cantidadPorCaja: lotesFiltrados[0]?.lote?.cantidadPorCaja || null,
          loteMasAntiguo: loteMasAntiguo,
          peso: lotesFiltrados[0]?.lote?.producto?.peso > 0 ? 1 : null,
          cantidad:
            lotesFiltrados[0]?.lote?.producto?.stock > 0 &&
            lotesFiltrados[0]?.lote?.producto?.subCantidad === 0
              ? 1
              : null,
          cantidadPorUnidad:
            lotesFiltrados[0]?.lote?.producto?.subCantidad > 0 &&
            lotesFiltrados[0]?.lote?.producto?.peso <= 0
              ? 1
              : null,
          ventaData,
          metodosVenta: newValue?.inventarios[0].lote?.producto?.metodosVenta,
          cantidadMetodo:
            Array.isArray(
              newValue?.inventarios[0].lote?.producto?.metodosVenta
            ) &&
            newValue?.inventarios[0].lote?.producto?.metodosVenta.length > 0
              ? 1
              : null,
        },
      ]);
      handleLoteChange(loteMasAntiguo?.lote?.id_lote, lotesFiltrados);
      setCantLote(loteMasAntiguo);
    }
  };

  const handleLoteChange = (loteId, lotesParam) => {
    setLote(loteId);
    const lotes = lotesParam || lotesProducto;
    const loteSeleccionado = lotes.find((lote) => {
      return lote.lote.id_lote === loteId;
    });

    setCantLote(loteSeleccionado);
    setVentaData((prev) => ({ ...prev, loteId }));
    setProductosDetallados((prev) =>
      prev.map((producto) =>
        producto.lotesFiltrados.some((lote) => lote.lote.id_lote === loteId)
          ? { ...producto, loteSeleccionado }
          : producto
      )
    );
  };

  const handleCancelar = () => {
    setProductosSeleccionados([]);
    setVentaData((prev) => ({
      ...prev,
      productoId: "",
      loteId: "",
    }));
    setLote("");
    setLotesProducto([]);
    setPeso("");
    setPrecio("");
    setCantidadPorUnidad("");
    setCantidad("");
    setCantLimit(0);
    setCantUnitLimit(0);
    setPesoLimit(0);
    setMetodosVenta(null);
    setcantidadMetodo(null);
    setMetodoSeleccionado(null);
    setProductosDetallados([]);
  };

  useEffect(() => {
    setCancelForm(() => handleCancelar);
  }, [setCancelForm]);

  const productosUnicos = [
    ...new Map(
      productos.map((producto) => [producto.id_producto, producto])
    ).values(),
  ];

  const productosUnicosFiltrados = productosUnicos.filter(
    (producto) => producto.inventarios.length > 0
  );

  return (
    <Box sx={{ padding: 2 }}>
      <form>
        <Grid container spacing={1} justifyContent="center">
          {lotesProducto.length > 0 && (
            <Grid item xs={12} sm={12} sx={{ display: "none" }}>
              <FormControl fullWidth>
                <InputLabel>Lote</InputLabel>
                <Select
                  value={ventaData.loteId || ""}
                  label="Lote"
                  onChange={(e) => handleLoteChange(e.target.value)}
                >
                  {lotesProducto.map((lote) => (
                    <MenuItem
                      key={lote?.lote?.id_lote}
                      value={lote?.lote?.id_lote}
                    >
                      {new Date(lote?.lote?.fecha_ingreso).toLocaleDateString(
                        "es-ES"
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* {pesoLimit > 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-number"
                label="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />
            </Grid>
          )} */}
        </Grid>
      </form>
      <ProductSelectedComponent
        productosSeleccionados={productosSeleccionados}
        removeProducto={removeProducto}
        setTotalPrice={setTotalPrice}
        productosDetallados={productosDetallados}
        setProductosDetallados={setProductosDetallados}
        handleCancelar={handleCancelar}
        clientes={clientes}
        ventaData={ventaData}
        setCliente={setCliente}
        handleOpenClientModal={handleOpenClientModal}
        productosUnicosFiltrados={productosUnicosFiltrados}
        handleProductoChange={handleProductoChange}
        setCantidad={setCantidad}
        setCantidadPorUnidad={setCantidadPorUnidad}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
      />
    </Box>
  );
};

export default VentaForm;
