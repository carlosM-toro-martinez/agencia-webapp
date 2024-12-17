import { makeStyles } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: "width 225ms ease-in-out",
    overflowX: "hidden",
  },
  drawerClose: {
    transition: "width 225ms ease-in-out",
    overflowX: "hidden",
    width: 64,
    "@media (min-width: 600px)": {
      width: 90,
    },
  },
  drawerHeader: {
    padding: "0 8px",
    minHeight: 50,
  },
  aside: {
    backgroundColor: "white",
    padding: "16px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  profileImg: {
    borderRadius: "50%",
    marginRight: "8px",
    width: "10rem",
    width: (props) => (props.open ? "10rem" : "3rem"),
  },
  profileNameInitial: {
    fontSize: "2rem",
    marginBottom: "-25px",
    marginTop: "-10px",
    fontWeight: 600,
    display: (props) => (props.open ? "none" : "block"),
  },
  profileName: {
    fontSize: "1.125rem",
    fontWeight: 600,
    display: (props) => (props.open ? "block" : "none"),
  },
  profileJob: {
    fontSize: "0.875rem",
    color: "#71717A",
    display: (props) => (props.open ? "block" : "none"),
  },
  listItemIcon: {
    justifyContent: "center",
    minWidth: 0,
  },
  listItemButton: {
    minHeight: 48,
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "red",
  },
}));

export default useStyles;
