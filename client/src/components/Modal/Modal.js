import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./Modal.css";

const Modal = ({ children, show }) => {
  return ReactDOM.createPortal(
    <CSSTransition
      in={show}
      timeout={200}
      classNames="modal-show"
      mountOnEnter
      unmountOnExit
    >
      <div className="modal">{children}</div>
    </CSSTransition>,
    document.getElementById("modal")
  );
};

export default Modal;
