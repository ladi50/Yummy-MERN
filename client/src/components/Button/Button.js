import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = ({ title, type, children, onClick, url, download }) => {
  let button = (
    <button type={type} className="button" onClick={onClick}>
      {children}
      {title}
    </button>
  );

  if (url) {
    button = (
      <Link to={url} className="button" download={download}>
        {children}
        {title}
      </Link>
    );
  }

  return <>{button}</>;
};

export default Button;
