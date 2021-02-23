import React, { useContext, useEffect, useState } from "react";

import Spinner from "../../components/Spinner/Spinner";
import Restaurant from "../../components/Restaurant/Restaurant";
import Filter from "../../components/Filter/Filter";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./Restaurants.css";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const { loading } = useFetch();
  const { restaurants: filteredRestaurants } = useContext(AppContext);

  useEffect(() => {
    setRestaurants(filteredRestaurants);
    // setFiltered(filteredRestaurants)
  }, [filteredRestaurants]);

  return (
    <>
      {restaurants && restaurants.length > 0 && (
        <Filter
          filtered={filtered}
          setFiltered={setFiltered}
          setRestaurants={setRestaurants}
          restaurants={restaurants}
        />
      )}

      <div className="restaurants">
        {loading && <Spinner />}

        {filtered.length === 0 || restaurants.length === 0 ? (
          <div className="restaurants__empty">
            <h1>No restaurants found! 😕</h1>
            <p>Try to change your filter parameters...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(
            ({
              _id,
              name,
              catagories,
              imageUrl,
              street,
              city,
              deliveryTime,
              rating,
              deliveryPrice
            }) => (
              <Restaurant
                key={_id}
                image={imageUrl}
                name={name}
                id={_id}
                deliveryTime={deliveryTime}
                street={street}
                city={city}
                catagories={catagories}
                rating={rating}
                deliveryPrice={deliveryPrice}
              />
            )
          )
        ) : (
          restaurants.length > 0 &&
          restaurants.map(
            ({
              _id,
              name,
              catagories,
              imageUrl,
              street,
              city,
              deliveryTime,
              rating,
              deliveryPrice
            }) => (
              <Restaurant
                key={_id}
                image={imageUrl}
                name={name}
                id={_id}
                deliveryTime={deliveryTime}
                street={street}
                city={city}
                catagories={catagories}
                rating={rating}
                deliveryPrice={deliveryPrice}
              />
            )
          )
        )}
      </div>
    </>
  );
};

export default Restaurants;
