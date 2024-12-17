import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  paper: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  icon: {
    fontSize: 10,
    color: "#607d8b",
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  count: {
    fontSize: "0.875rem",
    color: "#607d8b",
  },
}));
