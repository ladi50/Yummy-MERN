import React from "react";
import { Link } from "react-router-dom";

import "./Hero.css";

const Hero = ({ button, onClick, href, link, image, height, children }) => {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${image})`, height: `${height}` }}
    >
      {button && (
        <button type="button" onClick={onClick}>
          {button}
        </button>
      )}
      {href && <Link to={href}>{link}</Link>}
      {children}
    </section>
  );
};

export default Hero;
