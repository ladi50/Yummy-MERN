import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "./Burger.css";

const Burger = ({ onClick, show }) => {
  useEffect(() => {
    if (!show) {
      const burgerChildren = document.getElementsByClassName("burger__child");
      for (const child of burgerChildren) {
        child.classList.remove("change");
      }
    }
  }, [show]);

  const burgerHandler = () => {
    const burgerChildren = document.getElementsByClassName("burger__child");
    for (const child of burgerChildren) {
      child.classList.toggle("change");
    }

    onClick();
  };

  return ReactDOM.createPortal(
    <div className="burger" onClick={burgerHandler}>
      <div className="burger__child"></div>
      <div className="burger__child"></div>
      <div className="burger__child"></div>
    </div>,
    document.getElementById("burger")
  );
};

export default Burger;
