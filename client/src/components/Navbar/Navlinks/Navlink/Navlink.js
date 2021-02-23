import React from "react";
import { NavLink } from "react-router-dom";

import "./Navlink.css";

const Navlink = ({ href, title, onClick }) => {
  return (
    <NavLink className="navlink" to={href} onClick={onClick}>
      {title}
    </NavLink>
  );
};

export default Navlink;
