import React from "react";
import ReactDOM from "react-dom";

import "./Footer.css";

const Footer = () => {
  return ReactDOM.createPortal(
    <div className="footer">
      <p>&copy; All Rights Reserved - Adi Leviim 2021</p>
    </div>,
    document.getElementById("footer")
  );
};

export default Footer;
