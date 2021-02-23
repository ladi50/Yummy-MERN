import React from "react";

import "./Spinner.css";

const Spinner = ({ button }) => {
  return (
    <div className={`spinner-wrapper ${button && "spinner__button-wrapper"}`}>
      <div className={`loader ${button && "spinner__button"}`}>Loading...</div>
    </div>
  );
};

export default Spinner;
