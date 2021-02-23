import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  deleteButton: {
    "&:hover": {
      color: "red"
    }
  },
  editButton: {
    "&:hover": {
      color: "black"
    }
  }
}));
