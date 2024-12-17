import React from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { useStyles } from "./dashboardInicio.styles";
import { Link } from "react-router-dom"; // Importa Link
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import UndoIcon from "@mui/icons-material/Undo";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Box } from "@mui/material";

function DashboardInicioComponent() {
  const classes = useStyles();

  const items = [
    {
      title: "REPORTES",
      icon: <ReceiptIcon sx={{ fontSize: "5rem" }} />,
      path: "/reportes", // Ruta actualizada
    },
    {
      title: "ALMACÉN",
      icon: <LocalShippingIcon sx={{ fontSize: "5rem" }} />,
      path: "/almacenes", // Ruta actualizada
    },
    {
      title: "CATEGORÍAS",
      icon: <CategoryIcon sx={{ fontSize: "5rem" }} />,
      path: "/almacenes", // Ruta actualizada
    },
    {
      title: "TRABAJADORES",
      icon: <PeopleIcon sx={{ fontSize: "5rem" }} />,
      path: "/trabajadores", // Ruta actualizada
    },
    {
      title: "PRODUCTOS",
      icon: <StorefrontIcon sx={{ fontSize: "5rem" }} />,
      path: "/ventas", // Ruta actualizada
    },
    {
      title: "CLIENTES",
      icon: <PeopleIcon sx={{ fontSize: "5rem" }} />,
      path: "/clientes", // Ruta actualizada
    },
    {
      title: "CAJA",
      icon: <CreditCardIcon sx={{ fontSize: "5rem" }} />,
      path: "/movimiento-caja", // Ruta actualizada
    },
    {
      title: "VENTAS",
      icon: <AttachMoneyIcon sx={{ fontSize: "5rem" }} />,
      path: "/ventas", // Ruta actualizada
    },
    // {
    //   title: "DEVOLUCIONES",
    //   icon: <UndoIcon sx={{ fontSize: "5rem" }} />,
    //   path: "/ventas", // Ruta actualizada (asumiendo que las devoluciones se manejan en ventas)
    // },
    // {
    //   title: "PERFIL",
    //   icon: <ReceiptIcon sx={{ fontSize: "5rem" }} />,
    //   path: "/perfil", // Ruta actualizada
    // },
    {
      title: "MOVIMIENTOS",
      icon: <MoveUpIcon sx={{ fontSize: "5rem" }} />,
      path: "/movimiento-inventario", // Ruta actualizada
    },
  ];

  return (
    <Grid container spacing={2} className={classes.container}>
      {items.map((item, index) => (
        <Grid item xs={4} sm={3} md={3} key={index}>
          <Link to={item.path} style={{ textDecoration: "none" }}>
            <Paper className={classes.paper} elevation={1}>
              <Box className={classes.icon}>{item.icon}</Box>
              <Typography variant="h6" className={classes.title}>
                {item.title}
              </Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardInicioComponent;
