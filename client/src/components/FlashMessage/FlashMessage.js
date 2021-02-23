import React from "react";
import { CSSTransition } from "react-transition-group";

import "./FlashMessage.css";

const FlashMessage = ({ message, onClick, show, error }) => {
  return (
    <CSSTransition
      in={show}
      timeout={150}
      classNames="flash-show"
      mountOnEnter
      unmountOnExit
    >
      <div className="flashMessage" style={{ backgroundColor: error && "red" }}>
        <p>{message}</p>
        <span onClick={onClick}>&#10006;</span>
      </div>
    </CSSTransition>
  );
};

export default FlashMessage;
