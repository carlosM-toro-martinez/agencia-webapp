import { useContext, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Typography,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReportIcon from "@mui/icons-material/Report";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import useStyles from "./drawer.styles";
import { Link, useLocation } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import NavBarComponent from "./NavBarComponent";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import FooterComponent from "./FooterComponent";

export default function DrawerComponent({ children }) {
  const { open, setOpen } = useContext(MainContext);

  const classes = useStyles({ open });
  const location = useLocation();

  const handleDrawerOpen = () => setOpen(!open);

  const routes = [
    {
      path: "/",
      name: "Inicio",
      icon: <HomeIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/ventas",
      name: "Ventas",
      icon: <ShoppingCartIcon sx={{ color: "#fff" }} />,
    },
    // { path: "/compras", name: "Compras", icon: <ShoppingCartIcon /> },
    {
      path: "/movimiento-caja",
      name: "Caja",
      icon: <AttachMoneyIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/reportes",
      name: "Reportes",
      icon: <ReportIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/almacenes",
      name: "Almacenes",
      icon: <StoreIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/clientes",
      name: "Clientes",
      icon: <PersonIcon sx={{ color: "#fff" }} />,
    },
    {
      path: "/trabajadores",
      name: "Trabajadores",
      icon: <GroupIcon sx={{ color: "#fff" }} />,
    },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", backgroundColor: "#f9fafc" }}
    >
      <Drawer
        variant="permanent"
        className={open ? classes.drawerOpen : classes.drawerClose}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1f1f21",
            color: "white",
            margin: ".2rem",
            borderRadius: "1rem",
          },
        }}
      >
        <Box className={classes.drawerHeader}>
          <Typography
            variant="h1"
            style={{
              textAlign: "center",
              fontSize: "2rem",
              margin: "1rem 0 1rem 0",
              fontWeight: "bold",
            }}
          >
            {open ? "Bienvenido" : <WavingHandIcon />}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: "#c0c0c0" }} />
        <List>
          {routes.slice(0, 7).map(({ path, name, icon }) => (
            <Box key={path} style={{ padding: "8px", display: "block" }}>
              <Link
                to={path}
                style={{
                  display: "flex",
                  justifyContent: open ? "flex-start" : "center",
                  alignItems: "center",
                  textDecoration: "none",
                  backgroundColor:
                    path === "/"
                      ? location.pathname === path
                        ? "#3d97ef"
                        : ""
                      : location.pathname.includes(path)
                      ? "#3d97ef"
                      : "",
                  color: "white",
                  padding: "10px 10px 10px 20px",
                  borderRadius: "4px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {icon}
                  </span>
                  <Typography
                    variant="button"
                    gutterBottom
                    style={{
                      display: open ? "block" : "none",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {name}
                  </Typography>
                </Box>
              </Link>
            </Box>
          ))}
        </List>
        {/* <Divider sx={{ backgroundColor: "#c0c0c0" }} /> */}
        {/* <List
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {routes.slice(7).map(({ path, name, icon }) => (
            <Box key={path} style={{ padding: "8px", display: "block" }}>
              <Link
                to={path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  backgroundColor:
                    path === "/"
                      ? location.pathname === path
                        ? "#3d97ef"
                        : ""
                      : location.pathname.includes(path)
                      ? "#3d97ef"
                      : "",
                  color: "white",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "85%",
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {icon}
                  </span>
                  <span
                    style={{
                      display: open ? "block" : "none",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {name}
                  </span>
                </Box>
              </Link>
            </Box>
          ))}
        </List> */}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          flexDirection: "column",
          backgroundColor: "#f9fafc",
        }}
      >
        <NavBarComponent handleDrawerOpen={handleDrawerOpen} open={open} />
        {children}
        <FooterComponent />
      </Box>
    </Box>
  );
}
