import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap", // Para que los elementos se ajusten a la pantalla
    gap: "4rem", // Espacio entre los elementos
    marginTop: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "contain",
  },
  title: {
    marginTop: "10px",
    fontSize: "40px",
    fontWeight: "bold",
    textAlign: "center",
  },
}));

export default useStyles;
