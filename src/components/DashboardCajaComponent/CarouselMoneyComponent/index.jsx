import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "react-query";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import { useStyles } from "./carouselMoney.styles";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import cajaOpenAddService from "../../../async/services/post/cajaOpenAddService";
import twoHundred from "../../../assets/images/200.jpg";
import oneHundred from "../../../assets/images/100.jpg";
import fifty from "../../../assets/images/50.jpg";
import twenty from "../../../assets/images/20.jpg";
import teen from "../../../assets/images/10.jpg";
import five from "../../../assets/images/5.jpg";
import two from "../../../assets/images/2.jpg";
import one from "../../../assets/images/1.jpg";
import fiftyCent from "../../../assets/images/050.jpg";
import twentyCent from "../../../assets/images/020.jpg";
import teenCent from "../../../assets/images/010.jpg";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import moveCashAddService from "../../../async/services/post/moveCashAddService";
import { getLocalDateTime } from "../../../utils/getDate";
import SendIcon from "@mui/icons-material/Send";
import cajaCloseAddService from "../../../async/services/post/cajaCloseAddService";
import { MainContext } from "../../../context/MainContext";

function CarouselMoneyComponent({
  caja,
  refetch,
  editingEnabled,
  setEditingEnabled,
  cajaState,
}) {
  const classes = useStyles();
  const {
    user,
    refetch: refetchContext,
    setOpenCaja,
  } = useContext(MainContext);

  const initialDenominations = [
    { tipo_dinero: "billete", denominacion: 200, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 100, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 50, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 20, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 10, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 5, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 2, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 1, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 0.5, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 0.2, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 0.1, cantidad: 0 },
  ];

  const [denominaciones, setDenominaciones] = useState(initialDenominations);
  const [total, setTotal] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const images = [
    twoHundred,
    oneHundred,
    fifty,
    twenty,
    teen,
    five,
    two,
    one,
    fiftyCent,
    twentyCent,
    teenCent,
  ];

  useEffect(() => {
    setTotalChange(0);
    setDescripcion("");
    if (!cajaState.isCajaCerrada) {
      const updatedDenominations = initialDenominations.map((denom) => {
        const matchingDenomination = caja?.denominaciones.find(
          (d) =>
            d.tipo_dinero === denom.tipo_dinero &&
            parseFloat(d.denominacion) === parseFloat(denom.denominacion)
        );

        const cantidad = matchingDenomination
          ? matchingDenomination.cantidad
          : denom.cantidad;

        return { ...denom, cantidad };
      });
      setDenominaciones(updatedDenominations);
      updateTotal(updatedDenominations);
    } else {
      setDenominaciones(initialDenominations);
      setTotal(0);
    }
  }, [caja, editingEnabled]);

  const updateTotal = (denominaciones) => {
    const newTotal = denominaciones.reduce(
      (acc, denom) => acc + denom.denominacion * denom.cantidad,
      0
    );
    setTotal(newTotal);
  };

  const handleIncrease = (index, denominacion) => {
    const newDenominaciones = [...denominaciones];
    newDenominaciones[index].cantidad += 1;
    setDenominaciones(newDenominaciones);
    updateTotal(newDenominaciones);
    setTotalChange(totalChange + denominacion);
  };

  const handleDecrease = (index, denominacion) => {
    const newDenominaciones = [...denominaciones];
    if (newDenominaciones[index].cantidad > 0) {
      newDenominaciones[index].cantidad -= 1;
      setDenominaciones(newDenominaciones);
      updateTotal(newDenominaciones);
      setTotalChange(totalChange - denominacion);
    }
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const mutation = useMutation(
    () =>
      cajaOpenAddService({
        monto_inicial: total,
        denominaciones,
        id_trabajador: user?.id_trabajador,
      }),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Datos enviados exitosamente!",
          severity: "success",
        });
        setEditingEnabled(false);
        setOpenCaja(true);
        refetch();
        refetchContext();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al enviar los datos: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const mutationMoveCash = useMutation(
    () =>
      moveCashAddService({
        id_caja: caja?.caja?.id_caja,
        tipo_movimiento: totalChange < 0 ? "retiro" : "ingreso",
        monto: totalChange,
        motivo: descripcion,
        fecha_movimiento: getLocalDateTime(),
        denominacionesDetalles: denominaciones,
        id_trabajador: user?.id_trabajador,
      }),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Datos enviados exitosamente!",
          severity: "success",
        });
        setEditingEnabled(false);
        refetch();
        refetchContext();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al enviar los datos: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const mutationCloseCash = useMutation(
    () =>
      cajaCloseAddService({
        id_caja: caja?.caja?.id_caja,
        id_trabajador: user?.id_trabajador,
      }),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Caja cerrada exitosamente!",
          severity: "success",
        });
        setEditingEnabled(false);
        setOpenCaja(false);
        refetch();
        refetchContext();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al enviar los datos: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = () => {
    if (caja?.caja?.fecha_cierre === null && caja?.caja?.id_caja) {
      mutationMoveCash.mutate();
    } else {
      mutation.mutate();
    }
  };

  const handleCloseCash = () => {
    mutationCloseCash.mutate();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {!cajaState.isCajaVacia && !cajaState.isCajaCerrada && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "4rem",
            paddingRight: "4rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditingEnabled(!editingEnabled)}
            className={classes.toggleButton}
            sx={{ marginTop: "2rem" }}
          >
            {editingEnabled ? "Cancelar" : "Registrar movimiento"}
          </Button>

          <Button
            variant="contained"
            //endIcon={<SendIcon />}
            onClick={handleCloseCash}
            className={classes.toggleButton}
            sx={{ marginTop: "2rem" }}
          >
            Cerrar caja
          </Button>
        </Box>
      )}
      <Box className={classes.container}>
        {editingEnabled &&
        !cajaState.isCajaVacia &&
        !cajaState.isCajaCerrada ? (
          <TextField
            id="outlined-textarea"
            label="Descripcion"
            placeholder="Descripcion de movimiento"
            sx={{ width: "25rem" }}
            multiline
            required
            value={descripcion}
            onChange={handleDescripcionChange}
          />
        ) : null}
        <Box className={classes.total}>
          {editingEnabled && totalChange < 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <h2 style={{ color: "red" }}>{totalChange.toFixed(2)}</h2>
              <AddIcon />
            </Box>
          )}
          {caja && (
            <h2>Caja: {parseFloat(caja?.caja?.monto_final).toFixed(2)}</h2>
          )}
          {editingEnabled && totalChange > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <AddIcon />
              <h2 style={{ color: "green" }}>{totalChange.toFixed(2)}</h2>
            </Box>
          )}
        </Box>

        <Box className={classes.imagesGrid}>
          {denominaciones.map((denom, index) => (
            <Box key={index} className={classes.imageContainer}>
              <img
                src={images[index]}
                alt={`money-${denom.denominacion}`}
                className={classes.image}
              />
              <Box className={classes.counterContainer}>
                {editingEnabled && (
                  <>
                    <IconButton
                      onClick={() => handleDecrease(index, denom.denominacion)}
                      className={classes.button}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </>
                )}
                <span className={classes.counter}>{denom.cantidad}</span>
                {editingEnabled && (
                  <>
                    <IconButton
                      onClick={() => handleIncrease(index, denom.denominacion)}
                      className={classes.button}
                    >
                      <AddIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {editingEnabled && (
            <Button
              variant="contained"
              //color="#3d97ef"
              onClick={handleSubmit}
              className={classes.saveButton}
              sx={{ marginTop: "2rem", backgroundColor: "#3d97ef" }}
            >
              Enviar
            </Button>
          )}
        </Box>

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
    </Box>
  );
}

export default CarouselMoneyComponent;
