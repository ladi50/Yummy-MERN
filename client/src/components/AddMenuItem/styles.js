import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  backdropButton: {
    width: "50px",
    height: "50px",
    backgroundColor: "white",
    color: "black"
  },
  deleteButton: {
    "&:hover, &:focus": {
      backgroundColor: "#ff331c",
      color: "white"
    }
  },
  editButton: {
    "&:hover, &:focus": {
      backgroundColor: "#454ae4",
      color: "white"
    }
  }
}));
