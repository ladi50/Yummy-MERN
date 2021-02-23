import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AppContext } from "../../../../context/context";

import "./Navlinks.css";

const NavLinks = ({ onClick }) => {
  const { token, userId, logout } = useContext(AppContext);

  let links = (
    <>
      <NavLink to="/signup" onClick={onClick}>
        register
      </NavLink>
      <NavLink to="/login" onClick={onClick}>
        sign in
      </NavLink>
    </>
  );

  if (token) {
    links = (
      <>
        <NavLink to={`/${userId}/my_restaurant`} onClick={onClick}>
          my restaurant
        </NavLink>
        <NavLink to={`/${userId}/orders`} onClick={onClick}>
          order history
        </NavLink>
        <NavLink
          to="/logout"
          onClick={() => {
            onClick();
            logout();
          }}
        >
          log out
        </NavLink>
      </>
    );
  }

  return <div className="navlinks-mobile">{links}</div>;
};

export default NavLinks;
