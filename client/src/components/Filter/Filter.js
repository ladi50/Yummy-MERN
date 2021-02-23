import React, { useEffect, useState } from "react";

import FilterCatagories from "./FilterCatagories/FilterCatagories";

import "./Filter.css";

const Filter = ({ restaurants, setFiltered }) => {
  const [inputs, setInputs] = useState({
    name: "",
    catagories: [],
    rating: 10,
    deliveryPrice: 20
  });

  useEffect(() => {
    let newRestaurants = [...restaurants];

    // filter by restaurant name
    if (inputs.name.length > 0) {
      newRestaurants = newRestaurants.filter((item) =>
        item.name.toLowerCase().includes(inputs.name.toLowerCase())
      );
    }

    // filter by restaurant rating
    if (inputs.rating.length > 0) {
      newRestaurants = newRestaurants.filter(
        (item) => item.rating <= inputs.rating
      );
    }

    // filter by delivery price
    if (inputs.deliveryPrice.length > 0) {
      newRestaurants = newRestaurants.filter(
        (item) => item.deliveryPrice <= inputs.deliveryPrice
      );
    }

    // filter by catagories
    if (inputs.catagories.length > 0) {
      newRestaurants = newRestaurants.filter((restaurant) => {
        let equal = null;

        for (const catag of inputs.catagories) {
          if (equal === false) break;

          equal = restaurant.catagories.includes(catag);
        }

        return equal;
      });
    }

    setFiltered(newRestaurants);
  }, [inputs]);

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="filter">
      <h1>filter restaurants</h1>

      <div className="filter__divs">
        <div className="filter__div" style={{ alignItems: "center" }}>
          <label htmlFor="name">name</label>

          <input
            type="text"
            name="name"
            id="name"
            value={inputs.name}
            onChange={inputHandler}
          />
        </div>

        <div className="filter__div">
          <label htmlFor="rating">rating</label>

          <div>
            <p>{inputs.rating}</p>

            <input
              type="range"
              name="rating"
              id="rating"
              min="0"
              max="10"
              value={inputs.rating}
              onChange={inputHandler}
            />
          </div>
        </div>

        <div className="filter__div">
          <label htmlFor="deliveryPrice">Delivery Price</label>

          <div>
            <p>{inputs.deliveryPrice}</p>

            <input
              type="range"
              name="deliveryPrice"
              id="deliveryPrice"
              min="0"
              max="20"
              value={inputs.deliveryPrice}
              onChange={inputHandler}
            />
          </div>
        </div>
      </div>

      <FilterCatagories setInputs={setInputs} inputs={inputs} />
    </div>
  );
};

export default Filter;
