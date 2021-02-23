import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import Navlinks from "./Navlinks/Navlinks";
import Burger from "./Burger/Burger";
import Sidebar from "./Sidebar/Sidebar";

import "./Navbar.css";
import Backdrop from "../Backdrop/Backdrop";

const Navbar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const navbar = document.getElementsByClassName("navbar")[0];

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        navbar.style.borderBottom = "5px solid #454AE4";
      } else {
        navbar.style.borderBottom = "5px solid transparent";
      }
    });
  }, []);

  return ReactDOM.createPortal(
    <div className="navbar">
      <Link to="/">
        <img
          className="navbar__logo"
          width="120"
          height="120"
          src="https://yummy-mern.s3.amazonaws.com/logo/yummy-logo.png"
          alt="yummy-logo"
        />
      </Link>

      <Navlinks />

      <Burger show={show} onClick={() => setShow((prevState) => !prevState)} />

      {show && <Backdrop mobile onClick={() => setShow(false)} />}

      <CSSTransition
        in={show}
        timeout={300}
        classNames="sidbar-show"
        mountOnEnter
        unmountOnExit
      >
        <Sidebar onClick={() => setShow(false)} />
      </CSSTransition>
    </div>,
    document.getElementById("navbar")
  );
};

export default Navbar;
