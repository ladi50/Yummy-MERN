import React from "react";
import ReactDOM from "react-dom";

import Navlinks from "./Navlinks/Navlinks";

import "./Sidebar.css";

const Sidebar = ({ onClick }) => {
  return ReactDOM.createPortal(
    <aside className="sidebar">
      <Navlinks onClick={onClick} />
    </aside>,
    document.getElementById("sidebar")
  );
};

export default Sidebar;
