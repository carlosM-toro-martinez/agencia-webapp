import React, { useState, useEffect, useContext } from "react";
import { Button, Grid, Box, Snackbar, TextField } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import LoteFormComponent from "./LoteFormComponent";
import ProductoProveedorForm from "./ProductoProveedorForm";
import RegistroTableComponent from "./RegistroTableComponent";
import ProveedorModalComponent from "./ProveedorModalComponent";
import ProductoModalComponent from "./ProductoModalComponent";
import useStyles from "./RegisterBuy.styles";
import detalleCompraAddServices from "../../async/services/post/detalleCompraAddServices";
import loteAddServices from "../../async/services/post/loteAddServices";
import buyLoteService from "../../async/services/get/buyLoteService";
import { useMutation, useQuery } from "react-query";
import { getLocalDateTime } from "../../utils/getDate";
import { MainContext } from "../../context/MainContext";
import { Typography } from "@mui/material";

const RegisterBuyComponent = ({
  products,
  proveedores,
  refetchProducts,
  refetchProveedores,
  lotes,
  refetchLote,
}) => {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [lote, setLote] = useState("");
  const [loteNumber, setLoteNumber] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [precio, setPrecio] = useState(null);
  const [peso, setPeso] = useState(null);
  const [subCantidad, setSubCantidad] = useState(null);
  const [registroCombinado, setRegistroCombinado] = useState([]);
  const [detalleCompraId, setDetalleCompraId] = useState(null);
  const [error, setError] = useState();
  const [isLoteProveedorLocked, setIsLoteProveedorLocked] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openProveedorModal, setOpenProveedorModal] = useState(false);
  const [openProductoModal, setOpenProductoModal] = useState(false);

  const handleOpenProveedorModal = () => setOpenProveedorModal(true);
  const handleCloseProveedorModal = () => setOpenProveedorModal(false);

  const handleOpenProductoModal = () => setOpenProductoModal(true);
  const handleCloseProductoModal = () => setOpenProductoModal(false);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const { data, refetch } = useQuery(
    ["detalle-compra", loteNumber],
    () => (loteNumber ? buyLoteService(loteNumber) : []),
    {
      enabled: true,
      onSuccess: (data) => {
        setRegistroCombinado(data);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al obtener los datos del lote: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  useEffect(() => {
    if (loteNumber) {
      refetch();
    }
  }, [loteNumber, snackbar]);

  const detalleCompraMutation = useMutation(detalleCompraAddServices, {
    onSuccess: (response) => {
      setDetalleCompraId(response.id_detalle);
      const newLote = {
        id_producto: producto,
        numero_lote: lote,
        fecha_ingreso: getLocalDateTime(),
        fecha_caducidad: fechaCaducidad,
        cantidad: cantidad ? cantidad : 0,
        precio_unitario: precio,
        peso: peso ? peso : 0,
        subCantidad: subCantidad ? subCantidad * cantidad : 0,
        cantidadPorCaja: subCantidad > 0 ? subCantidad : null,
        id_detalle_compra: response.id_detalle,
      };
      loteMutation.mutate(newLote);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al guardar el detalle de compra: ${error.message}`,
        severity: "error",
      });
    },
  });

  const loteMutation = useMutation(loteAddServices, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Lote creado exitosamente!",
        severity: "success",
      });
      setLoteNumber(lote);
      setIsLoteProveedorLocked(true);
      setFechaIngreso("");
      setFechaCaducidad("");
      setCantidad("");
      setPrecio("");
      setSubCantidad(null);
      setPeso("");
      setDetalleCompraId(null);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el lote: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSave = () => {
    const newBuy = {
      id_proveedor: proveedor,
      id_producto: producto,
      cantidad: cantidad ? cantidad : 0,
      precio_unitario: precio,
      peso: peso ? peso : null,
      subCantidad: subCantidad * cantidad ? cantidad : 0,
      fecha_compra: getLocalDateTime(),
      id_trabajador: user?.id_trabajador,
    };

    detalleCompraMutation.mutate(newBuy);
  };

  const handleFinalize = () => {
    setIsLoteProveedorLocked(false);
    setProveedor("");
    setLote("");
  };

  return (
    <Box style={{ minWidth: "100%", paddingLeft: "2rem", overflowX: "hidden" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={11} md={4}>
            <Typography
              variant="h3"
              className={classes.header}
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "2rem 0 2rem 0",
              }}
            >
              Registro de Lote
            </Typography>
            <ProductoProveedorForm
              proveedor={proveedor}
              setProveedor={setProveedor}
              producto={producto}
              setProducto={setProducto}
              productos={products}
              proveedores={proveedores}
              setError={setError}
              handleOpenProductoModal={handleOpenProductoModal}
              handleOpenProveedorModal={handleOpenProveedorModal}
              isLoteProveedorLocked={isLoteProveedorLocked}
            />
            <LoteFormComponent
              lote={lote}
              loteData={lotes}
              setLote={setLote}
              fechaIngreso={fechaIngreso}
              setFechaIngreso={setFechaIngreso}
              fechaCaducidad={fechaCaducidad}
              setFechaCaducidad={setFechaCaducidad}
              cantidad={cantidad}
              setCantidad={setCantidad}
              precio={precio}
              setPrecio={setPrecio}
              setError={setError}
              isLoteProveedorLocked={isLoteProveedorLocked}
              peso={peso}
              setPeso={setPeso}
              subCantidad={subCantidad}
              setSubCantidad={setSubCantidad}
            />
          </Grid>
          <Grid item xs={11} md={8}>
            <Typography
              variant="h3"
              className={classes.header}
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "2rem 0 2rem 0",
              }}
            >
              Compra
            </Typography>
            <RegistroTableComponent
              registroCombinado={registroCombinado}
              handleFinalize={handleFinalize}
              numeroLote={loteNumber}
            />
          </Grid>
        </Grid>
        <Button
          type="submit" // Cambiar el tipo a "submit"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#3d97ef",
            color: "#fff",
            marginTop: "20px",
            fontWeight: "bold",
          }}
          disabled={
            detalleCompraMutation.isLoading || loteMutation.isLoading || error
          }
        >
          {detalleCompraMutation.isLoading || loteMutation.isLoading
            ? "Guardando..."
            : "Guardar"}
        </Button>
      </form>

      <ProveedorModalComponent
        refetchProveedores={refetchProveedores}
        open={openProveedorModal}
        handleClose={handleCloseProveedorModal}
      />
      <ProductoModalComponent
        refetchProducts={refetchProducts}
        open={openProductoModal}
        handleClose={handleCloseProductoModal}
      />

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
    </Box>
  );
};

export default RegisterBuyComponent;
