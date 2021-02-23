import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "../../components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Backdrop from "../../components/Backdrop/Backdrop";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./MyRestaurant.css";

const MyRestaurant = () => {
  const [restaurant, setRestaurant] = useState();
  const [show, setShow] = useState(false);

  const { userId, token } = useContext(AppContext);
  const { fetchHandler, loading } = useFetch();

  useEffect(() => {
    fetchHandler(`/${userId}/restaurant`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res && setRestaurant(res.restaurant))
      .catch((err) => console.log(err));
  }, [fetchHandler, userId, token]);

  const removeRestaurant = () => {
    fetchHandler(`/${userId}/${restaurant._id}/deleteRestaurant`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((err) => console.log(err));

    setRestaurant(null);
  };

  return (
    <>
      {show && <Backdrop onClick={() => setShow(false)} />}

      <Modal show={show}>
        <h2 className="myRestaurant__modal-title">
          Do you really want to delete your restaurant?
        </h2>

        <div className="myRestaurant__modal-buttons">
          <button
            className="myRestaurant__darkButton"
            onClick={() => setShow(false)}
          >
            cancel
          </button>

          <button
            className="myRestaurant__deleteButton"
            onClick={removeRestaurant}
          >
            delete
          </button>
        </div>
      </Modal>

      <h1 className="myRestaurant__title">my restaurant</h1>

      <div className="myRestaurant">
        {loading && <Spinner />}

        {restaurant ? (
          <>
            <div className="myRestaurant__details">
              <h2>{restaurant.name}</h2>

              <img src={restaurant.imageUrl} alt={restaurant.name} />
            </div>

            <div className="myRestaurant__actions">
              <Link to={`/${userId}/add_restaurant`}>Edit</Link>

              <Link
                className="myRestaurant__darkButton"
                to={`/${userId}/${restaurant._id}/add_menu`}
              >
                {restaurant.menuId ? "edit menu" : "create menu"}
              </Link>

              <button
                className="myRestaurant__deleteButton"
                type="button"
                onClick={() => setShow(true)}
              >
                remove
              </button>
            </div>
          </>
        ) : (
          <div className="myRestaurant__empty">
            <h2>You have no restaurant yet...</h2>

            <Button url={`/${userId}/add_restaurant`}>
              add your restaurant
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MyRestaurant;
