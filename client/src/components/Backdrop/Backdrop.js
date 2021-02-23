import React from "react";

import "./Backdrop.css";

const Backdrop = ({onClick, mobile}) => {
  return <div className={`backdrop ${mobile && "backdrop__mobile"}`} onClick={onClick}></div>;
};

export default Backdrop;
