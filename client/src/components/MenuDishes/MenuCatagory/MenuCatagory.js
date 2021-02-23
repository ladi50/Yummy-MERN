import React from "react";

import CatagoryDishes from "./CatagoryDishes/CatagoryDishes";

import "./MenuCatagory.css";

const MenuCatagory = ({ catagory, dishes }) => {
  return (
    <div className="menuCatagory">
      <h3 id={catagory}>{catagory}</h3>

      <CatagoryDishes dishes={dishes} />
    </div>
  );
};

export default MenuCatagory;
