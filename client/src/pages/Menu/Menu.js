import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MenuHero from "../../components/MenuHero/MenuHero";
import SideMenu from "../../components/SideMenu/SideMenu";
import MenuDetails from "../../components/MenuDetails/MenuDetails";
import MenuDishes from "../../components/MenuDishes/MenuDishes";
import Reviews from "../../components/Reviews/Reviews";
import Spinner from "../../components/Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";

import "./Menu.css";

const Menu = () => {
  const [restaurant, setRestaurant] = useState();
  const [rating, setRating] = useState(0);

  const { fetchHandler, loading } = useFetch();
  const restaurantId = useParams().restaurantId;

  useEffect(() => {
    fetchHandler(`/restaurants/${restaurantId}`)
      .then((res) => {
        if (res) {
          setRestaurant(res.restaurant);
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler, restaurantId]);

  useEffect(() => {
    fetchHandler(`/${restaurantId}/reviews/rating`)
      .then((res) => {
        if (res && res.ratings && res.ratings.length > 0) {
          let score = 0;

          for (const item of res.ratings) {
            score += item.rating;
          }

          const avgRating = (score / res.ratings.length).toFixed(1);

          setRating(avgRating);
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler, restaurantId]);

  return (
    <div className="menu">
      {loading && <Spinner />}

      {!loading && restaurant && (
        <>
          <div className="menu__hero">
            <MenuHero
              name={restaurant.name}
              catagories={restaurant.catagories}
              rating={parseFloat(rating) || 0}
              imageUrl={restaurant.imageUrl}
            />
          </div>

          <div className="menu__main">
            <MenuDetails
              street={restaurant.street}
              city={restaurant.city}
              phoneNumber={restaurant.phoneNumber}
              schedule={restaurant.schedule}
              hidden
            />

            <SideMenu />

            <MenuDishes />

            <MenuDetails
              street={restaurant.street}
              city={restaurant.city}
              phoneNumber={restaurant.phoneNumber}
              schedule={restaurant.schedule}
            />
          </div>

          <Reviews setRating={setRating} />
        </>
      )}
    </div>
  );
};

export default Menu;
