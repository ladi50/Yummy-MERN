import React from "react";

import CatagoryDish from "./CatagoryDish/CatagoryDish";

import "./CatagoryDishes.css";

const CatagoryDishes = ({ dishes }) => {
  return (
    <ul className="catagoryDishes">
      {dishes &&
        dishes.map(({ _id, name, description, imageUrl, price }) => (
          <CatagoryDish
            key={_id}
            id={_id}
            name={name}
            description={description}
            image={imageUrl}
            price={price}
          />
        ))}
    </ul>
  );
};

export default CatagoryDishes;
