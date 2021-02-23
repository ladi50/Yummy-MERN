import React, { useContext, useState } from "react";

import Modal from "../../../../Modal/Modal";
import Backdrop from "../../../../Backdrop/Backdrop";
import Button from "../../../../Button/Button";
import Spinner from "../../../../Spinner/Spinner";
import FlashMessage from "../../../../FlashMessage/FlashMessage";
import { useFetch } from "../../../../../hooks/useFetch";
import { AppContext } from "../../../../../context/context";

import "./CatagoryDish.css";

const CatagoryDish = ({ id, name, description, image, price }) => {
  const [show, setShow] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [text, setText] = useState({
    kitchenNotes: "",
    deliveryNotes: "",
    quantity: 1
  });

  const { loading } = useFetch();
  const { addToCart, orderItems } = useContext(AppContext);

  const textHandler = (e) => {
    const { name, value } = e.target;

    setText((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      };
    });
  };

  const addDishToCart = (e) => {
    e.preventDefault();

    let content = { id, ...text, name, image, price };

    for (const item of orderItems) {
      if (item.id === id) {
        content = { id, quantity: text.quantity };

        break;
      }
    }

    addToCart(content);

    setShow(false);
    setShowMsg(true);
    setMessage("Dish added to cart successfully!");
    setText({
      kitchenNotes: "",
      deliveryNotes: "",
      quantity: 1
    });
  };

  return (
    <>
      <FlashMessage
        message={message}
        show={showMsg}
        onClick={() => setShowMsg(false)}
      />

      {show && <Backdrop onClick={() => setShow(false)} />}

      <Modal show={show} setShow={setShow}>
        <form onSubmit={addDishToCart}>
          <div className="modal__dish">
            <div className="modal__dish-details">
              <h4>{name}</h4>
              <p>{description}</p>
              <p>${price * text.quantity}</p>

              <div className="modal__dish-qty">
                <button
                  type="button"
                  onClick={() =>
                    text.quantity > 1 &&
                    setText((prevState) => ({
                      ...prevState,
                      quantity: text.quantity - 1
                    }))
                  }
                >
                  -
                </button>
                <p>{text.quantity}</p>
                <button
                  type="button"
                  onClick={() =>
                    setText((prevState) => ({
                      ...prevState,
                      quantity: text.quantity + 1
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal__dish-image">
              <img width="600" src={image} alt={name} />
            </div>
          </div>

          <div className="modal__dish-notes">
            <label htmlFor="kitchenNotes">kitchen notes</label>
            <textarea
              onChange={textHandler}
              value={text.kitchenNotes}
              name="kitchenNotes"
              id="kitchenNotes"
              rows="3"
            ></textarea>
            <label htmlFor="deliveryNotes">delivery notes</label>
            <textarea
              onChange={textHandler}
              value={text.deliveryNotes}
              name="deliveryNotes"
              id="deliveryNotes"
              rows="3"
            ></textarea>
          </div>

          <div className="modal__dish-button">
            <Button type="submit" title={<span>add dish</span>}>
              {loading && <Spinner button />}
            </Button>
          </div>
        </form>
      </Modal>

      <li className="catagoryDish" onClick={() => setShow(true)}>
        <div className="catagoryDish__container">
          <div className="catagoryDish__details">
            <h4>{name}</h4>
            <p>{description}</p>
            <p>${price}</p>
          </div>

          <div className="catagoryDish__image">
            <img src={image} alt={name} />
          </div>
        </div>
      </li>
    </>
  );
};

export default CatagoryDish;
