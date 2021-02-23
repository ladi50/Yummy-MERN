import React, { useContext } from "react";

import Button from "../Button/Button";
import { AppContext } from "../../context/context";

import "./AddYourRestaurant.css";

const AddYourRestaurant = () => {
  const { userId, token } = useContext(AppContext);

  return (
    <div
      className="addYourRestaurant"
      data-aos="fade-up"
      data-aos-delay={300}
      data-aos-offset={180}
    >
      <h2>Join our family and start to make money!</h2>

      <img
        src="https://yummy-mern.s3.amazonaws.com/homepage/food-delivery.webp"
        alt="food_delivery_image"
      />

      <Button
        title="Join Us"
        url={token ? `/${userId}/add_restaurant` : "/signup"}
      />
    </div>
  );
};

export default AddYourRestaurant;
