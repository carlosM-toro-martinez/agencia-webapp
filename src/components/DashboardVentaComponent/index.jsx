import React, { useContext, useEffect, useState } from "react";
import { Button, Grid, Box, Snackbar, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useMutation } from "react-query";
import DenominacionForm from "./DenominacionForm";
import ClientModal from "./ClientModal";
import VentaForm from "./VentaForm";
import useStyles from "./dashboardVenta.styles";
import TableVentaComponent from "./TableVentaComponent";
import { getLocalDateTime } from "../../utils/getDate";
import ventaAddService from "../../async/services/post/ventaAddService";
import ventaDetalleAddService from "../../async/services/post/ventaDetalleAddService";
import { MainContext } from "../../context/MainContext";

function DashboardVentaComponent({
  products,
  refetchProducts,
  clients,
  refetchClients,
  caja,
  refetchCaja,
}) {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [ventaData, setVentaData] = useState({
    id_trabajador: user?.id_trabajador,
    clienteId: "",
  });
  const [precio, setPrecio] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [lote, setLote] = useState();

  const [denominaciones, setDenominaciones] = useState([
    { tipo_dinero: "billete", denominacion: 200, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 100, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 50, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 20, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 5, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 1, cantidad: 0 },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openClientModal, setOpenClientModal] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cancelForm, setCancelForm] = useState(null);
  const [restore, setRestoreDenom] = useState(null);
  const [cantLimit, setCantLimit] = useState(0);
  const [pesoLimit, setPesoLimit] = useState(0);
  const [cantUnitLimit, setCantUnitLimit] = useState(0);
  const [productosDetallados, setProductosDetallados] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldMutate, setShouldMutate] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Contado");
  const handleOpenClientModal = () => setOpenClientModal(true);
  const handleCloseClientModal = () => setOpenClientModal(false);

  const addProducto = (
    producto,
    cliente,
    loteID,
    peso,
    price,
    cantidadPorUnidad,
    cantidad
  ) => {
    setProductosSeleccionados((prev) => {
      return [
        ...prev,
        {
          ...producto,
          clienteNombre: `${cliente.nombre} ${
            cliente.apellido ? cliente.apellido : ""
          } - ${cliente.codigo ? cliente.codigo : ""}`,
          clienteId: cliente.id_cliente,
          clientePuntos: cliente.puntos_fidelidad,
          id_lote: loteID,
          peso: peso ? peso : 0,
          precio: price,
          cantidad_unidad: cantidadPorUnidad ? cantidadPorUnidad : 0,
          cantidad: cantidad ? cantidad : 0,
          id_trabajador: user?.id_trabajador,
        },
      ];
    });

    actualizarTotal(productosSeleccionados);
  };

  const removeProducto = (index) => {
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));
    actualizarTotal(productosSeleccionados);
  };

  const actualizarTotal = (productos) => {
    const nuevoTotal = productos.reduce(
      (total, producto) => total + parseFloat(producto.precio),
      0
    );
    setVentaData((prev) => ({ ...prev, total: nuevoTotal }));
  };

  const ventaMutation = useMutation(
    () =>
      ventaAddService({
        ventaData: {
          fecha_venta: getLocalDateTime(),
          total: totalPrice,
          id_cliente: ventaData.clienteId,
          id_trabajador: ventaData.id_trabajador,
          rebaja_aplicada: 0,
          descuento_fidelidad_aplicado: 0,
          metodo_pago: metodoPago,
        },
        id_caja: caja?.caja?.id_caja || 1,
        denominaciones: denominaciones,
      }),
    {
      onSuccess: (response) => {
        const idVenta = response?.newVenta?.id_venta;

        detalleMutation
          .mutateAsync(
            productosSeleccionados.map((producto) => ({
              ...producto,
              id_venta: idVenta,
            }))
          )
          .then(() => {
            setSnackbar({
              open: true,
              message: "Venta realizada exitosamente!",
              severity: "success",
            });
            refetchProducts();
            refetchCaja();
            if (cancelForm) {
              cancelForm();
            }
            if (setRestoreDenom) {
              setRestoreDenom();
            }
          })
          .catch((error) => {
            setSnackbar({
              open: true,
              message: `Error al agregar detalles de la venta: ${error.message}`,
              severity: "error",
            });
          });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al realizar la venta: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const detalleMutation = useMutation(
    (productosSeleccionados) => ventaDetalleAddService(productosSeleccionados),
    {
      onSuccess: (response) => {
        console.log("Detalles de la venta añadidos exitosamente:", response);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al agregar detalles de la venta: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = async () => {
    if (!totalPrice || totalPrice <= 0) {
      setSnackbar({
        open: true,
        message: "No se puede registrar una venta vacía.",
        severity: "error",
      });
      return;
    }

    if (!ventaData.clienteId) {
      setSnackbar({
        open: true,
        message: "Debe seleccionar un cliente para registrar la venta.",
        severity: "error",
      });
      return;
    }

    setIsProcessing(true);
    setShouldMutate(false);

    for (const item of productosDetallados) {
      const producto = item.newValue;
      const lotesProducto = item.lotesFiltrados;
      const peso = item.peso || null;
      const price = parseFloat(item.loteMasAntiguo.lote.producto.precio);
      const cantidadPorUnidad = item.cantidadPorUnidad;
      const cantidadPorCaja = item.cantidadPorCaja;
      const cantidad = item.cantidad;
      const metodoSeleccionado = item.metodoSeleccionado;
      const cantidadMetodo = item.cantidadMetodo;

      await procesarVenta(
        producto,
        lotesProducto,
        cantidadPorUnidad,
        cantidadPorCaja,
        price,
        peso,
        cantidad,
        metodoSeleccionado,
        cantidadMetodo
      );
    }

    setIsProcessing(false);
    setShouldMutate(true);
  };

  const procesarVenta = (
    newValue,
    lotesProducto,
    cantidadPorUnidad,
    cantidadPorCaja,
    price,
    peso,
    cantidad,
    metodoSeleccionado,
    cantidadMetodo
  ) => {
    const productoSeleccionado = products.find(
      (producto) => producto.id_producto === newValue.id_producto
    );
    const clienteSeleccionado = clients.find(
      (cliente) => cliente.id_cliente === ventaData.clienteId
    );

    if (!productoSeleccionado || !clienteSeleccionado) {
      console.error("Producto o cliente no encontrado");
      return;
    }

    let cajasRestantes = cantidadPorUnidad
      ? Math.floor(cantidadPorUnidad / cantidadPorCaja)
      : cantidad;

    let priceProduct =
      precio || productoSeleccionado?.inventarios[0]?.lote?.producto?.precio;
    if (!precio) setPrecio(priceProduct);

    const lotesOrdenados = lotesProducto.sort(
      (a, b) => a.lote.id_lote - b.lote.id_lote
    );

    const procesarLotes = (condicion, operacion) => {
      for (let i = 0; i < lotesOrdenados.length; i++) {
        let loteData = lotesOrdenados[i];
        if (condicion(loteData)) {
          operacion(loteData);
        } else {
          break;
        }
      }
    };

    if (metodoSeleccionado && cantidadMetodo) {
      let unidadesRestantes =
        cantidadMetodo * metodoSeleccionado.cantidad_por_metodo;
      let precioMetodo =
        metodoSeleccionado.precio / metodoSeleccionado.cantidad_por_metodo;
      let cantidadCajas = unidadesRestantes / cantidadPorCaja;
      procesarLotes(
        (loteData) => unidadesRestantes > 0,
        (loteData) => {
          if (unidadesRestantes >= loteData.subCantidad) {
            cantidadCajas -= loteData.cantidad;
            unidadesRestantes -= loteData.subCantidad;
            addProducto(
              productoSeleccionado,
              clienteSeleccionado,
              loteData.lote.id_lote,
              peso,
              precioMetodo,
              loteData.subCantidad,
              loteData.cantidad
            );
          } else {
            addProducto(
              productoSeleccionado,
              clienteSeleccionado,
              loteData.lote.id_lote,
              peso,
              precioMetodo,
              unidadesRestantes,
              Math.floor(cantidadCajas)
            );

            unidadesRestantes = 0;
          }
        }
      );
    } else {
      switch (true) {
        case cantidadPorUnidad && !peso && !cantidad:
          procesarLotes(
            (loteData) => cantidadPorUnidad > 0,
            (loteData) => {
              if (cantidadPorUnidad >= loteData.subCantidad) {
                cajasRestantes -= loteData.cantidad;
                cantidadPorUnidad -= loteData.subCantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  priceProduct,
                  loteData.subCantidad,
                  loteData.cantidad
                );
              } else {
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  priceProduct,
                  cantidadPorUnidad,
                  cajasRestantes
                );
                cantidadPorUnidad = 0;
              }
            }
          );
          break;

        case peso && !cantidadPorUnidad && !cantidad:
          procesarLotes(
            (loteData) => peso > 0,
            (loteData) => {
              if (peso >= loteData.peso) {
                peso -= loteData.peso;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  loteData.peso,
                  priceProduct,
                  0,
                  0
                );
              } else {
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  priceProduct,
                  0,
                  0
                );
                peso = 0;
              }
            }
          );
          break;

        case cantidad && !cantidadPorUnidad && !peso:
          procesarLotes(
            (loteData) => cantidad > 0,
            (loteData) => {
              if (cantidad >= loteData.cantidad) {
                cantidad -= loteData.cantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  priceProduct,
                  0,
                  loteData.cantidad
                );
              } else {
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  priceProduct,
                  0,
                  cantidad
                );
                cantidad = 0;
              }
            }
          );
          break;

        default:
          console.log("Ningún caso cumple con los criterios establecidos.");
          break;
      }
    }
  };

  useEffect(() => {
    if (!isProcessing && shouldMutate) {
      console.log(productosSeleccionados);
      ventaMutation.mutate();
      setShouldMutate(false);
    }
  }, [isProcessing, shouldMutate, productosSeleccionados]);

  return (
    <Box style={{ minWidth: "100%" }}>
      <Typography
        variant="h3"
        className={classes.header}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Registrar Venta
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={11} md={12}>
          <VentaForm
            ventaData={ventaData}
            clientes={clients}
            productos={products}
            setVentaData={setVentaData}
            setCliente={(id) =>
              setVentaData((prev) => ({ ...prev, clienteId: id }))
            }
            setProducto={(id) =>
              setVentaData((prev) => ({ ...prev, productoId: id }))
            }
            denominaciones={denominaciones}
            setDenominaciones={setDenominaciones}
            addProducto={addProducto}
            handleOpenClientModal={handleOpenClientModal}
            setProductosSeleccionados={setProductosSeleccionados}
            productosSeleccionados={productosSeleccionados}
            lote={lote}
            setLote={setLote}
            setCancelForm={setCancelForm}
            cantLimit={cantLimit}
            setCantLimit={setCantLimit}
            cantUnitLimit={cantUnitLimit}
            setCantUnitLimit={setCantUnitLimit}
            pesoLimit={pesoLimit}
            setPesoLimit={setPesoLimit}
            removeProducto={removeProducto}
            setTotalPrice={setTotalPrice}
            productosDetallados={productosDetallados}
            setProductosDetallados={setProductosDetallados}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
          />
        </Grid>
        {/* <Grid item xs={11} md={11}>
          <TableVentaComponent
            productosSeleccionados={productosSeleccionados}
            removeProducto={removeProducto}
            setTotalPrice={setTotalPrice}
          />
        </Grid> */}
        {/* {Array.isArray(caja?.denominaciones) && (
          <DenominacionForm
            caja={caja}
            refetchCaja={refetchCaja}
            denominaciones={denominaciones}
            setDenominaciones={setDenominaciones}
            totalPrice={totalPrice}
            setRestoreDenom={setRestoreDenom}
          />
        )} */}
      </Grid>
      <Box
        style={{
          margin: "2rem 0 2rem 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={ventaMutation.isLoading}
        >
          {ventaMutation.isLoading ? "Registrando..." : "Registrar Venta"}
        </Button>
      </Box>

      <ClientModal
        refetchClients={refetchClients}
        open={openClientModal}
        handleClose={handleCloseClientModal}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardVentaComponent;
