import React, { useContext } from "react";
import { Avatar } from "@material-ui/core";

import Navlink from "./Navlink/Navlink";
import { AppContext } from "../../../context/context";

import useStyles from "./styles.js";
import "./Navlinks.css";

const Navlinks = () => {
  const { token, userId, username, logout } = useContext(AppContext);

  const classes = useStyles();

  let links = (
    <>
      <Navlink href="/signup" title="register" />
      <Navlink href="/login" title="sign in" />
    </>
  );

  if (token) {
    links = (
      <>
        <ul className="navlinks__user">
          <li>
            <div className="navlinks__avatar">
              <p>{username}</p>
              <Avatar className={classes.avatar} alt="avatar" />
            </div>
          </li>

          <li>
            <div className="navlinks__user-links">
              <Navlink
                href={`/${userId}/my_restaurant`}
                title="my restaurant"
              />
              <Navlink href={`/${userId}/orders`} title="order history" />
              <Navlink
                href="/logout"
                title="log out"
                onClick={() => logout()}
              />
            </div>
          </li>
        </ul>
      </>
    );
  }

  return <div className="navlinks">{links}</div>;
};

export default Navlinks;
