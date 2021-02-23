import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "../Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./Restaurant.css";

const Restaurant = ({
  id,
  image,
  name,
  deliveryTime,
  city,
  catagories,
  deliveryPrice
}) => {
  const [emoji, setEmoji] = useState("😀");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);

  const { fetchHandler, loading } = useFetch();
  const { token, userId } = useContext(AppContext);

  useEffect(() => {
    if (rating > 7) setEmoji("😀");

    if (rating < 7 && rating > 4) setEmoji("🙂");

    if (rating < 4) setEmoji("🙁");
  }, [rating]);

  useEffect(() => {
    fetchHandler(`/${id}/menu_price`)
      .then((res) => res && setPrice(res.price))
      .catch((err) => console.log(err));
  }, [fetchHandler, token, userId, id]);

  useEffect(() => {
    fetchHandler(`/${id}/reviews/rating`)
      .then((res) => {
        if (res && res.ratings && res.ratings.length > 0) {
          let score = 0;

          for (const item of res.ratings) {
            score += item.rating;
          }

          setRating((score / res.ratings.length).toFixed(1));
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler, id]);

  return (
    <div className="restaurant">
      {loading && <Spinner />}

      <div className="restaurant__imageDiv">
        <img src={image} alt={name} />
        <div className="restaurant__imageDiv-backdrop"></div>
      </div>

      <div className="restaurant__details-container">
        <div className="restaurant__details">
          <div>
            <h3>{name}</h3>
            <p className="restaurant__details-catagories">
              {catagories.map((c) => " " + c).toString()}
            </p>
          </div>
          <div>
            <p className="restaurant__details-deliveryTime">
              {deliveryTime} min
            </p>
          </div>
        </div>
        <div className="restaurant__subDetails">
          <span>{price}</span>
          <span>
            · {emoji} {parseFloat(rating)}
          </span>
          <span>· ${deliveryPrice} delivery</span>
        </div>
      </div>
      <Link to={`/${city}/restaurant/${id}`}>show menu</Link>
    </div>
  );
};

export default Restaurant;
