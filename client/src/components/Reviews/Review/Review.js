import React from "react";
import {Rating} from "@material-ui/lab"

import "./Review.css";

const Review = ({ title, content, rating, createdAt }) => {
  return (
    <div className="review">
      <div className="review__details">
        <h5>{title}</h5>
        <p>{content}</p>
        <p>{createdAt}</p>
      </div>

      <div className="review__rating">
        <span><Rating value={rating} precision={0.5} max={10} readOnly /></span>
      </div>
    </div>
  );
};

export default Review;
