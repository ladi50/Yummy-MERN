import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import FlashMessage from "../../components/FlashMessage/FlashMessage";
import Hero from "../../components/Hero/Hero";
import Advatages from "../../components/Advantages/Advatages";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import AddYourRestaurant from "../../components/AddYourRestaurant/AddYourRestaurant";

import "./Homepage.css";

const Homepage = () => {
  const [show, setShow] = useState(false);
  const [showJoin, setShowJoin] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();

  const { fetchHandler, loading } = useFetch();
  const { token, userId } = useContext(AppContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (query.get("added_restaurant")) {
      setShow(true);
      setMessage("Your restaurant has been added to our website successfully!");
    }

    if (query.get("edited_restaurant")) {
      setShow(true);
      setMessage("Your restaurant details have been edited successfully!");
    }

    if (query.get("added_menu")) {
      setShow(true);
      setMessage("Your restaurant menu has been added successfully!");
    }

    if (query.get("edited_menu")) {
      setShow(true);
      setMessage("Your restaurant menu has been edited successfully!");
    }

    if (query.get("canceled")) {
      setError(true);
      setShow(true);
      setMessage("Checkout failed, please try again!");
    }

    return () => {
      setMessage("");
    };
  }, [location.search]);

  useEffect(() => {
    if (token && userId) {
      fetchHandler(`/${userId}/restaurant`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res && res.restaurant && setShowJoin(false))
        .catch((err) => console.log(err));
    }
  }, [fetchHandler, token, userId]);

  return (
    <div className="homepage">
      <FlashMessage
        message={message}
        show={show}
        onClick={() => setShow(false)}
        error={error && error}
      />

      <Hero
        image="https://yummy-mern.s3.amazonaws.com/homepage/food-1.jpg"
        alt="food-picture"
        link="ORDER NOW"
        href="/restaurants"
      />

      <Advatages />

      {showJoin && !loading && <AddYourRestaurant />}
    </div>
  );
};

export default Homepage;
