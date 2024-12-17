import React, { useContext, useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import { MainContext } from "../../../context/MainContext";
import { useNavigate } from "react-router-dom";

function NavBarComponent({ handleDrawerOpen, open }) {
  const { setToken, setUser, setSuperAdmin } = useContext(MainContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseSession = () => {
    localStorage.setItem("token", null);
    setToken();
    localStorage.setItem("user", null);
    setUser();
    localStorage.setItem("superAdmin", null);
    setSuperAdmin();
    navigate("/login");

    setAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    navigate("/perfil");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1rem",
        alignItems: "center",
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
      >
        {open ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      <BreadcrumbsComponent />
      <IconButton
        color="inherit"
        aria-label="account options"
        onClick={handleMenuOpen}
        edge="start"
      >
        <AccountCircleIcon sx={{ fontSize: "2rem" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleNavigateProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleCloseSession}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
}

export default NavBarComponent;
