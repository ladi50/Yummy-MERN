import React from "react";
import { Link } from "react-router-dom";

import Button from "../Button/Button";

import "./Form.css";

const Form = ({ children, onSubmit, title, button, register }) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      {children}
      <Button title={button} />
      {register ? (
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      ) : (
        <p>
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      )}
    </form>
  );
};

export default Form;
