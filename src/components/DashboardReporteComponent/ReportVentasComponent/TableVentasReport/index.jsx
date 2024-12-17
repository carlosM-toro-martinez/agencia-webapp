import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useStyles from "./tableVentas.styles";
import { useMutation } from "react-query";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import anularVentaAddService from "../../../../async/services/post/anularVentaAddService";
import { getLocalDateTime } from "../../../../utils/getDate";

function TableVentasReport({ reportData, ventaToday, refetchVentas, caja }) {
  const [utilidades, setUtilidades] = useState([]);
  const [utilidadGlobal, setUtilidadGlobal] = useState(0);

  useEffect(() => {
    if (reportData && !ventaToday) {
      calcularUtilidades(reportData);
    }
  }, [reportData]);

  const calcularUtilidades = (ventas) => {
    let totalGlobalUtilidad = 0;
    console.log(ventas);
    const resultados = ventas.map((venta) => {
      let utilidadVenta = 0;
      const detallesConUtilidad = [];
  
      venta.detallesVenta.forEach((detalle) => {
        const lote = detalle.lote;
        const detalleCompra = lote.detalleCompra;
  
        let precioCompraPorUnidad;
        if (detalleCompra.subCantidad && detalleCompra.subCantidad > 0) {
          precioCompraPorUnidad =
            parseFloat(detalleCompra.precio_unitario) /
            lote.cantidadPorCaja;
        } else if (lote.peso && lote.peso > 0) {
          precioCompraPorUnidad = parseFloat(detalleCompra.precio_unitario) / lote.peso;
        } else {
          precioCompraPorUnidad = parseFloat(detalleCompra.precio_unitario);
        }
          console.log(detalle);
  
          const cantidadVendida =
          detalle.subCantidad > 0
            ? detalle.subCantidad
            : detalle.cantidad > 0
            ? detalle.cantidad
            : detalle.peso > 0
            ? detalle.peso
            : 0;
  
        const utilidadDetalle =
          cantidadVendida *
          (parseFloat(detalle.precio_unitario) - precioCompraPorUnidad);
  
        utilidadVenta += utilidadDetalle;
  
        detallesConUtilidad.push({
          producto: detalle.producto || "Producto desconocido",
          cantidadVendida,
          precioCompraPorUnidad: precioCompraPorUnidad.toFixed(2),
          precioVentaPorUnidad: parseFloat(detalle.precio_unitario).toFixed(2),
          utilidadDetalle: utilidadDetalle.toFixed(2),
        });
      });
  
      totalGlobalUtilidad += utilidadVenta;
  
      return {
        id_venta: venta.id_venta,
        utilidadVenta: utilidadVenta.toFixed(2),
        detallesConUtilidad,
      };
    });
  
    setUtilidades(resultados);
    setUtilidadGlobal(totalGlobalUtilidad.toFixed(2));
  };

  const classes = useStyles();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 80, 10);
    doc.text(` Utilidad Total: ${utilidadGlobal}`, 80, 20);
    const tableData = reportData.map((venta, index) => [
      new Date(venta.fecha_venta).toLocaleDateString(),
      `${venta?.cliente?.nombre} ${venta.cliente.apellido}`,
      venta.trabajadorVenta?.nombre,
      venta.total,
      venta.metodo_pago,
      utilidades[index]?.utilidadVenta,
    ]);

    doc.autoTable({
      head: [
        [
          "Fecha Venta",
          "Cliente",
          "Trabajador",
          "Metodo de pago",
          "Total",
          "Utilidades",
          // "Rebaja Aplicada",
          // "Descuento Fidelidad",
        ],
      ],
      body: tableData,
      startY: 25,
      theme: "grid",
    });
    reportData.forEach((venta) => {
      doc.autoTable({
        head: [
          [
            "Producto",
            "Cantidad",
            "Cantidad por Unidad",
            "Peso",
            "Precio Unitario",
            //"Precio Total Unitario",
          ],
        ],
        body: venta.detallesVenta.map((detalle) => [
          detalle.producto.nombre,
          detalle.cantidad,
          detalle.subCantidad || "N/A",
          detalle.peso || "N/A",
          detalle.precio_unitario,
        ]),
        startY: doc.previousAutoTable.finalY + 20,
        theme: "striped",
        didDrawPage: (data) => {
          doc.text(
            `Detalles de la Venta (${venta.total})`,
            15,
            data.settings.startY - 5
          );
        },
      });
    });

    const pdfOutput = doc.output("blob");
    setPdfBlob(pdfOutput);
    setOpenDialog(true);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="500px"
              title="Vista previa del PDF"
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead style={{ backgroundColor: "#3d97ef" }}>
            <TableRow>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }} />
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Fecha Venta
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Cliente
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Trabajador
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Metodo de pago
              </TableCell>

              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Total
              </TableCell>
              {ventaToday ? (
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              ) : (
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Utilidades
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((venta, index) => (
              <VentaRow
                key={venta.id_venta}
                venta={venta}
                ventaToday={ventaToday}
                refetchVentas={refetchVentas}
                caja={caja}
                utilidades={utilidades[index]}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!ventaToday ? (
        <Typography
          variant="h3"
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "1.5rem",
            color: "green",
          }}
        >
          Utilidad Total: {utilidadGlobal}
        </Typography>
      ) : null}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={generatePDF}
          style={{ marginBottom: "10px" }}
        >
          Guardar Reporte
        </Button>
      </Box>
    </>
  );
}

function VentaRow({ venta, ventaToday, refetchVentas, caja, utilidades }) {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const classes = useStyles();

  const ventaMutation = useMutation(
    (payload) => anularVentaAddService(payload),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "¡Venta anulada correctamente!",
          severity: "success",
        });
        refetchVentas();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al anular la venta: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleAnularVenta = (ventaAAnular) => {
    let transformVenta = ventaAAnular.detallesVenta.map((detalle) => ({
      id_producto: detalle.id_producto,
      nombre: detalle.producto.nombre,
      clienteNombre: venta.cliente.nombre,
      clienteId: ventaAAnular.cliente,
      id_lote: detalle.id_lote,
      peso: parseFloat(detalle.peso),
      precio: detalle.precio_unitario,
      cantidad_unidad: detalle.subCantidad,
      cantidad: detalle.cantidad,
      id_trabajador: venta.id_trabajador,
      id_venta: venta.id_venta,
      id_detalle: detalle.id_detalle,
      id_caja: caja?.caja?.id_caja || 1,
      fecha_venta: getLocalDateTime(),
    }));
    if (transformVenta?.length === 0) {
      transformVenta = [
        {
          clienteId: ventaAAnular.id_cliente,
          id_venta: ventaAAnular.id_venta,
          id_caja: caja?.caja?.id_caja || 1,
          fecha_venta: getLocalDateTime(),
        },
      ];
    }

    ventaMutation.mutate(transformVenta);
  };

  return (
    <>
      <TableRow style={{ backgroundColor: "#c7e3ff" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          {new Date(venta?.fecha_venta).toLocaleDateString()}
        </TableCell>
        <TableCell>{`${venta?.cliente?.nombre} ${
          venta.cliente.apellido ? venta?.cliente?.apellido : ""
        }`}</TableCell>
        <TableCell>{venta?.trabajadorVenta?.nombre}</TableCell>
        <TableCell>{venta?.metodo_pago}</TableCell>

        <TableCell>{venta.total}</TableCell>
        {ventaToday ? (
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAnularVenta(venta)}
              sx={{ backgroundColor: "red", fontWeight: "bold" }}
            >
              ANULAR VENTA
            </Button>
          </TableCell>
        ) : (
          <TableCell
            style={{ color: utilidades?.utilidadVenta > 0 ? "green" : "red" }}
          >
            {utilidades?.utilidadVenta}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className={classes.collapseContainer}>
              <Typography variant="h6" gutterBottom>
                Detalles de Venta
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Cantidad por Unidad</TableCell>
                    <TableCell>Peso</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venta.detallesVenta.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>{detalle?.producto?.nombre}</TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{detalle.subCantidad}</TableCell>
                      <TableCell>{detalle.peso}</TableCell>
                      <TableCell>{detalle.precio_unitario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
    </>
  );
}

export default TableVentasReport;
