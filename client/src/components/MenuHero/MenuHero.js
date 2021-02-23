import React, { useEffect, useState } from "react";

import Hero from "../Hero/Hero";

import "./MenuHero.css";

const MenuHero = ({ name, catagories, rating, imageUrl }) => {
  const [emoji, setEmoji] = useState("😀");

  useEffect(() => {
    if (rating > 7) setEmoji("😀");

    if (rating <= 7 && rating >= 4) setEmoji("🙂");

    if (rating < 4) setEmoji("🙁");
  }, [rating]);

  return (
    <div className="menuHero">
      <Hero height="550px" image={imageUrl}>
        <div className="menuHero__details">
          <h1>{name}</h1>

          <div className="menuHero__details-catagories">
            {catagories.map((c, i) => {
              if (i === catagories.length - 1) {
                return <p key={i}>{c} </p>;
              } else {
                return <p key={i}>{c}, </p>;
              }
            })}
          </div>

          <span>
            {emoji} {rating && rating}
          </span>
        </div>
      </Hero>
    </div>
  );
};

export default MenuHero;
