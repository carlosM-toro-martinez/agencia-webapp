import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import TableVentasReport from "../../components/DashboardReporteComponent/ReportVentasComponent/TableVentasReport/index.jsx";
import empty from "../../assets/images/empty.svg";
import DrawerComponent from "../../components/DrawerComponent/index.jsx";
import ventasPorPagarService from "../../async/services/get/ventasPorPagarService.js";

function VentasPorPagar() {
  const {
    data: reportVentas,
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
    refetch: refetchVentas,
  } = useQuery("ventasToday", ventasPorPagarService);

  return (
    <>
        <DrawerComponent>
            <Box
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 30,
                }}
                >
                <Typography
                    component={"h2"}
                    style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    }}
                >
                    Ventas Por Pagar
                </Typography>

                {isLoadingVentas ? (
                    <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                    >
                    <CircularProgress />
                    </Box>
                ) : isErrorVentas ? (
                    <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                    >
                    <p>Error al cargar el reporte de ventas</p>
                    </Box>
                ) : (
                    <>
                    {reportVentas && Array.isArray(reportVentas) && reportVentas.length > 0 ? (
                        <TableVentasReport
                        reportData={reportVentas}
                        ventaToday={true}
                        refetchVentas={refetchVentas}
                        />
                    ) : (
                        <img
                        src={empty}
                        alt="No hay datos"
                        style={{
                            width: "10rem",
                            height: "auto",
                            display: "block",
                            margin: "auto",
                        }}
                        />
                    )}
                    </>
                )}
            </Box>
        </DrawerComponent>
    </>
  );
}

export default VentasPorPagar;
