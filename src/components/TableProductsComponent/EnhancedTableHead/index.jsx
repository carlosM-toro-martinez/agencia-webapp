import React from "react";
import PropTypes from "prop-types";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import useStyles from "../table.styles";

const headCells = [
  { id: "nombre", numeric: false, disablePadding: false, label: "Nombre" },
  {
    id: "codigo_barra",
    numeric: false,
    disablePadding: false,
    label: "Código de Barras",
  },
  {
    id: "Cantidad",
    numeric: true,
    disablePadding: false,
    label: "Cantidad (Caja/Paquete)",
  },
  {
    id: "Cantidad (u)",
    numeric: true,
    disablePadding: false,
    label: "Cantidad (u)",
  },
  { id: "Peso", numeric: true, disablePadding: false, label: "Peso" },
  { id: "precio", numeric: true, disablePadding: false, label: "Precio" },
  { id: "actions", numeric: true, disablePadding: false, label: "Acciones" },
];

const EnhancedTableHead = () => {
  const classes = useStyles();

  return (
    <TableHead
      className={classes.tableHead}
      sx={{ backgroundColor: "#3d97ef" }}
    >
      {headCells.map((headCell) => (
        <TableCell key={headCell.id} sx={{ color: "#fff", fontWeight: "bold" }}>
          {headCell.label}
        </TableCell>
      ))}
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

export default EnhancedTableHead;
