import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Rating } from "@material-ui/lab";

import Review from "./Review/Review";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import { AppContext } from "../../context/context";
import { useFetch } from "../../hooks/useFetch";

import "./Reviews.css";
import FlashMessage from "../FlashMessage/FlashMessage";

const Reviews = ({ setRating }) => {
  const [noReviews, setNoReviews] = useState("");
  const [showFlash, setShowFlash] = useState(false);
  const [value, setValue] = useState({
    rating: 0,
    title: "",
    content: ""
  });
  const [errors, setErrors] = useState({
    ratingError: "",
    titleError: "",
    contentError: "",
    existsError: ""
  });
  const [reviews, setReviews] = useState([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  const restaurantId = useParams().restaurantId;
  const history = useHistory();
  const { token, userId } = useContext(AppContext);
  const { loading, errorMsg, fetchHandler } = useFetch();

  useEffect(() => {
    fetchHandler(`/${restaurantId}/reviews`)
      .then((res) => {
        if (res && res.message && res.message.includes("no reviews")) {
          setNoReviews(res.message.toString());
        } else if (res && res.reviews) {
          setReviews(res.reviews);
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler, restaurantId]);

  useEffect(() => {
    if (errorMsg) {
      for (const error of errorMsg) {
        if (error.toLowerCase().includes("rating")) {
          setErrors((prevState) => ({
            ...prevState,
            ratingError: error
          }));

          continue;
        }

        if (error.toLowerCase().includes("title")) {
          setErrors((prevState) => ({
            ...prevState,
            titleError: error
          }));

          continue;
        }

        if (error.toLowerCase().includes("content")) {
          setErrors((prevState) => ({
            ...prevState,
            contentError: error
          }));

          continue;
        }

        if (error.toLowerCase().includes("already been reviewd")) {
          setErrors((prevState) => ({
            ...prevState,
            existsError: error
          }));

          continue;
        }
      }
    }
  }, [errorMsg]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setReviewsLength(reviews.length);
    }

    return () => {
      setReviewsLength(0);
    };
  }, [reviews.length]);

  useEffect(() => {
    let ratings = 0;

    for (const item of reviews) {
      ratings += item.rating;
    }

    setRating((ratings / reviews.length).toFixed(1));
  }, [reviewsLength, reviews, setRating]);

  const valueHandler = (e) => {
    const { name, value } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: value
    }));
  };

  const postReviewHandler = (e) => {
    e.preventDefault();

    if (!token) {
      return history.push("/signup");
    }

    setErrors({
      ratingError: "",
      titleError: "",
      contentError: "",
      existsError: ""
    });

    if (value.rating === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ratingError: "Rating is required!"
      }));
    }

    fetchHandler(`/${restaurantId}/${userId}/review`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(value)
    })
      .then((res) => {
        if (res) {
          setReviews((prevState) => [res.review, ...prevState]);

          setValue({
            rating: 0,
            title: "",
            content: ""
          });

          setShowFlash(true);

          setNoReviews("");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="reviews">
      <FlashMessage
        show={showFlash}
        onClick={() => setShowFlash(false)}
        message="Review added successfully!"
      />

      <FlashMessage
        show={errors.existsError.length > 0}
        onClick={() =>
          setErrors((prevState) => ({ ...prevState, existsError: "" }))
        }
        message={errors.existsError}
        error
      />

      <div className="reviews__add">
        {token ? (
          <>
            <h4>Write a Review</h4>

            <Rating
              value={parseFloat(value.rating)}
              name="rating"
              onChange={valueHandler}
              precision={0.5}
              max={10}
            />
            <p style={{ color: "red" }}>{errors.ratingError}</p>

            <form className="reviews__form" onSubmit={postReviewHandler}>
              <label htmlFor="title">title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={value.title}
                onChange={valueHandler}
                placeholder="Add review title..."
              />
              <p style={{ color: "red" }}>{errors.titleError}</p>

              <label htmlFor="content">content</label>
              <textarea
                name="content"
                id="content"
                rows="3"
                value={value.content}
                onChange={valueHandler}
                placeholder="Write your review here..."
              />
              <p style={{ color: "red" }}>{errors.contentError}</p>

              <Button type="submit" title={"add review"}>
                {loading && <Spinner button />}
              </Button>
            </form>

            <h4>Users Reviews</h4>
          </>
        ) : (
          <h4 style={{ paddingTop: "0" }}>Reviews</h4>
        )}
      </div>

      {noReviews && <h4 className="reviews__empty">{noReviews}</h4>}

      {reviews &&
        reviews.map(({ _id, title, content, rating, createdAt }) => (
          <Review
            key={_id}
            title={title}
            content={content}
            rating={rating}
            createdAt={new Date(createdAt)
              .toLocaleDateString()
              .replace(/\./g, "/")}
          />
        ))}
    </div>
  );
};

export default Reviews;
